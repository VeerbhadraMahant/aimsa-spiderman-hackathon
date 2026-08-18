import { supabase, isSupabaseConfigured } from './supabaseClient'
import { store, ensureSeeded } from './localStore'
import type {
  AppUser, Post, Reply, Community, Conversation, ChatMessage, XdItem, AppNotification, ContactMessage,
} from '@/types'

ensureSeeded()

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`
}

// ---------- Users ----------
// Postgres/Supabase columns are snake_case; AppUser is camelCase. Map explicitly
// instead of casting — a bare cast silently produces `undefined` for every
// multi-word field (displayName, communitiesCount, ...).
function mapUserRow(row: Record<string, any>): AppUser {
  return {
    id: row.id,
    handle: row.handle,
    displayName: row.display_name,
    avatarUrl: row.avatar_url ?? undefined,
    bannerUrl: row.banner_url ?? undefined,
    department: row.department ?? undefined,
    role: row.role ?? 'user',
    whatsapp: row.whatsapp ?? undefined,
    linkedinUsername: row.linkedin_username ?? undefined,
    email: row.email ?? undefined,
    bio: row.bio ?? undefined,
    communitiesCount: row.communities_count ?? 0,
    followersCount: row.followers_count ?? 0,
    followingCount: row.following_count ?? 0,
    flexCount: row.flex_count ?? 0,
  }
}

function userPatchToRow(patch: Partial<AppUser>): Record<string, any> {
  const row: Record<string, any> = {}
  if (patch.displayName !== undefined) row.display_name = patch.displayName
  if (patch.handle !== undefined) row.handle = patch.handle
  if (patch.avatarUrl !== undefined) row.avatar_url = patch.avatarUrl
  if (patch.bannerUrl !== undefined) row.banner_url = patch.bannerUrl
  if (patch.department !== undefined) row.department = patch.department
  if (patch.role !== undefined) row.role = patch.role
  if (patch.whatsapp !== undefined) row.whatsapp = patch.whatsapp
  if (patch.linkedinUsername !== undefined) row.linkedin_username = patch.linkedinUsername
  if (patch.email !== undefined) row.email = patch.email
  if (patch.bio !== undefined) row.bio = patch.bio
  return row
}

export async function getUsers(): Promise<AppUser[]> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase.from('users').select('*')
    return (data ?? []).map(mapUserRow)
  }
  return store.users.all()
}

export async function getUserById(id: string): Promise<AppUser | undefined> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase.from('users').select('*').eq('id', id).maybeSingle()
    return data ? mapUserRow(data) : undefined
  }
  const users = await getUsers()
  return users.find((u) => u.id === id)
}

export async function getUserByHandle(handle: string): Promise<AppUser | undefined> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase.from('users').select('*').eq('handle', handle).maybeSingle()
    return data ? mapUserRow(data) : undefined
  }
  const users = await getUsers()
  return users.find((u) => u.handle === handle)
}

// Called right after Google sign-in. Creates the `users` row if the
// on_auth_user_created DB trigger hasn't (or the row was never seeded),
// so the app never gets stuck treating an authenticated session as logged out.
export async function ensureUserProfile(authUser: {
  id: string
  email?: string | null
  user_metadata?: Record<string, any>
}): Promise<AppUser> {
  const existing = await getUserById(authUser.id)
  if (existing) return existing

  const handle = (authUser.email?.split('@')[0] || `user_${authUser.id.slice(0, 8)}`)
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '')
  const displayName = authUser.user_metadata?.full_name || authUser.user_metadata?.name || handle
  const avatarUrl = authUser.user_metadata?.avatar_url

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('users')
      .upsert(
        { id: authUser.id, handle, display_name: displayName, email: authUser.email, avatar_url: avatarUrl, role: 'user' },
        { onConflict: 'id' },
      )
      .select()
      .maybeSingle()
    if (!error && data) return mapUserRow(data)
  }

  return {
    id: authUser.id,
    handle,
    displayName,
    avatarUrl,
    role: 'user',
    communitiesCount: 0,
    followersCount: 0,
    followingCount: 0,
    flexCount: 0,
  }
}

export async function updateUser(id: string, patch: Partial<AppUser>): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase.from('users').update(userPatchToRow(patch)).eq('id', id)
    return
  }
  const users = store.users.all()
  const idx = users.findIndex((u) => u.id === id)
  if (idx >= 0) {
    users[idx] = { ...users[idx], ...patch }
    store.users.save(users)
  }
}

// ---------- Follows ----------
export async function getFollowing(userId: string): Promise<string[]> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase.from('follows').select('followee_id').eq('follower_id', userId)
    return (data ?? []).map((r: any) => r.followee_id)
  }
  return store.follows.all().filter((f) => f.followerId === userId).map((f) => f.followeeId)
}

export async function toggleFollow(followerId: string, followeeId: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase.from('follows').select('*').eq('follower_id', followerId).eq('followee_id', followeeId).maybeSingle()
    if (data) {
      await supabase.from('follows').delete().eq('follower_id', followerId).eq('followee_id', followeeId)
      return false
    }
    await supabase.from('follows').insert({ follower_id: followerId, followee_id: followeeId })
    return true
  }
  const all = store.follows.all()
  const idx = all.findIndex((f) => f.followerId === followerId && f.followeeId === followeeId)
  if (idx >= 0) {
    all.splice(idx, 1)
    store.follows.save(all)
    return false
  }
  all.push({ followerId, followeeId })
  store.follows.save(all)
  return true
}

// ---------- Posts ----------
export async function getPosts(authorId?: string): Promise<Post[]> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase.from('posts').select('*, replies(*)').order('created_at', { ascending: false })
    let posts = (data as Post[]) ?? []
    if (authorId) posts = posts.filter((p) => p.authorId === authorId)
    return posts
  }
  let posts = [...store.posts.all()].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
  if (authorId) posts = posts.filter((p) => p.authorId === authorId)
  return posts
}

export async function createPost(authorId: string, body: string): Promise<Post> {
  const mentions = Array.from(body.matchAll(/@(\w+)/g)).map((m) => m[1])
  const newPost: Post = {
    id: uid('p'),
    authorId,
    body,
    createdAt: new Date().toISOString(),
    attachments: [],
    mentions,
    likeCount: 0,
    likedByMe: false,
    replies: [],
  }
  if (isSupabaseConfigured && supabase) {
    await supabase.from('posts').insert({ id: newPost.id, author_id: authorId, body, mentions })
    return newPost
  }
  const posts = store.posts.all()
  posts.unshift(newPost)
  store.posts.save(posts)
  return newPost
}

export async function toggleLike(postId: string, userId: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase.from('post_likes').select('*').eq('post_id', postId).eq('user_id', userId).maybeSingle()
    if (data) await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', userId)
    else await supabase.from('post_likes').insert({ post_id: postId, user_id: userId })
    return
  }
  const posts = store.posts.all()
  const post = posts.find((p) => p.id === postId)
  if (!post) return
  post.likedByMe = !post.likedByMe
  post.likeCount += post.likedByMe ? 1 : -1
  store.posts.save(posts)
}

export async function addReply(postId: string, authorId: string, body: string): Promise<Reply> {
  const reply: Reply = { id: uid('r'), postId, authorId, body, createdAt: new Date().toISOString() }
  if (isSupabaseConfigured && supabase) {
    await supabase.from('replies').insert({ id: reply.id, post_id: postId, author_id: authorId, body })
    return reply
  }
  const posts = store.posts.all()
  const post = posts.find((p) => p.id === postId)
  if (post) {
    post.replies.push(reply)
    store.posts.save(posts)
  }
  return reply
}

// ---------- Communities ----------
export async function getCommunities(): Promise<Community[]> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase.from('communities').select('*')
    return (data as Community[]) ?? []
  }
  return store.communities.all()
}

export async function getCommunityByHandle(handle: string): Promise<Community | undefined> {
  const cs = await getCommunities()
  return cs.find((c) => c.handle === handle)
}

export async function getSubscriptions(userId: string): Promise<string[]> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase.from('community_subscriptions').select('community_id').eq('user_id', userId)
    return (data ?? []).map((r: any) => r.community_id)
  }
  return store.communitySubs.all()[userId] ?? []
}

export async function toggleSubscription(userId: string, communityId: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase.from('community_subscriptions').select('*').eq('user_id', userId).eq('community_id', communityId).maybeSingle()
    if (data) {
      await supabase.from('community_subscriptions').delete().eq('user_id', userId).eq('community_id', communityId)
      return false
    }
    await supabase.from('community_subscriptions').insert({ user_id: userId, community_id: communityId })
    return true
  }
  const subs = store.communitySubs.all()
  const list = new Set(subs[userId] ?? [])
  let joined: boolean
  if (list.has(communityId)) {
    list.delete(communityId)
    joined = false
  } else {
    list.add(communityId)
    joined = true
  }
  subs[userId] = Array.from(list)
  store.communitySubs.save(subs)
  return joined
}

export async function subscribeAll(userId: string, communityIds: string[]): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase.from('community_subscriptions').upsert(communityIds.map((id) => ({ user_id: userId, community_id: id })))
    return
  }
  const subs = store.communitySubs.all()
  const list = new Set(subs[userId] ?? [])
  communityIds.forEach((id) => list.add(id))
  subs[userId] = Array.from(list)
  store.communitySubs.save(subs)
}

// ---------- Connect (DMs) ----------
export async function getOrCreateConversation(userA: string, userB: string): Promise<Conversation> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase.from('conversations').select('*').or(`and(user_a.eq.${userA},user_b.eq.${userB}),and(user_a.eq.${userB},user_b.eq.${userA})`).maybeSingle()
    if (data) return data as Conversation
    const { data: created } = await supabase.from('conversations').insert({ user_a: userA, user_b: userB }).select().single()
    return created as Conversation
  }
  const convos = store.conversations.all()
  let convo = convos.find((c) => (c.userA === userA && c.userB === userB) || (c.userA === userB && c.userB === userA))
  if (!convo) {
    convo = { id: uid('conv'), userA, userB }
    convos.push(convo)
    store.conversations.save(convos)
  }
  return convo
}

export async function getConversationsForUser(userId: string): Promise<Conversation[]> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase.from('conversations').select('*').or(`user_a.eq.${userId},user_b.eq.${userId}`)
    return (data as Conversation[]) ?? []
  }
  return store.conversations.all().filter((c) => c.userA === userId || c.userB === userId)
}

export async function getMessages(conversationId: string): Promise<ChatMessage[]> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase.from('messages').select('*').eq('conversation_id', conversationId).order('sent_at', { ascending: true })
    return (data as ChatMessage[]) ?? []
  }
  return store.messages.all().filter((m) => m.conversationId === conversationId)
}

export async function sendMessage(conversationId: string, senderId: string, body: string): Promise<ChatMessage> {
  const msg: ChatMessage = { id: uid('msg'), conversationId, senderId, body, sentAt: new Date().toISOString() }
  if (isSupabaseConfigured && supabase) {
    await supabase.from('messages').insert({ id: msg.id, conversation_id: conversationId, sender_id: senderId, body_ciphertext: body, sent_at: msg.sentAt })
    return msg
  }
  const msgs = store.messages.all()
  msgs.push(msg)
  store.messages.save(msgs)
  return msg
}

export async function markMessageRead(messageId: string): Promise<void> {
  const readAt = new Date().toISOString()
  const expiresAt = new Date(Date.now() + 30000).toISOString()
  if (isSupabaseConfigured && supabase) {
    await supabase.from('messages').update({ read_at: readAt, expires_at: expiresAt }).eq('id', messageId)
    return
  }
  const msgs = store.messages.all()
  const m = msgs.find((x) => x.id === messageId)
  if (m) {
    m.readAt = readAt
    m.expiresAt = expiresAt
    store.messages.save(msgs)
  }
}

// ---------- XD ----------
export async function getXdItems(tag?: string): Promise<XdItem[]> {
  const items = isSupabaseConfigured && supabase
    ? ((await supabase.from('xd_items').select('*')).data as XdItem[]) ?? []
    : store.xdItems.all()
  return tag ? items.filter((i) => i.tag === tag) : items
}

export async function toggleXdLike(itemId: string): Promise<void> {
  if (isSupabaseConfigured && supabase) return
  const items = store.xdItems.all()
  const item = items.find((i) => i.id === itemId)
  if (!item) return
  item.likedByMe = !item.likedByMe
  item.likeCount += item.likedByMe ? 1 : -1
  store.xdItems.save(items)
}

// ---------- Notifications ----------
export async function getNotifications(userId: string): Promise<AppNotification[]> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false })
    return (data as AppNotification[]) ?? []
  }
  return [...store.notifications.forUser(userId)].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
}

export async function markNotificationRead(userId: string, id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase.from('notifications').update({ read_at: new Date().toISOString() }).eq('id', id)
    return
  }
  const list = store.notifications.forUser(userId)
  const n = list.find((x) => x.id === id)
  if (n) n.readAt = new Date().toISOString()
  store.notifications.save(userId, list)
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase.from('notifications').update({ read_at: new Date().toISOString() }).eq('user_id', userId).is('read_at', null)
    return
  }
  const list = store.notifications.forUser(userId)
  const now = new Date().toISOString()
  list.forEach((n) => { if (!n.readAt) n.readAt = now })
  store.notifications.save(userId, list)
}

// ---------- Contact ----------
export async function submitContactMessage(msg: Omit<ContactMessage, 'id' | 'createdAt'>): Promise<void> {
  const full: ContactMessage = { ...msg, id: uid('cm'), createdAt: new Date().toISOString() }
  if (isSupabaseConfigured && supabase) {
    await supabase.from('contact_messages').insert({ user_id: msg.userId, name: msg.name, email: msg.email, message: msg.message })
    return
  }
  const all = store.contactMessages.all()
  all.push(full)
  store.contactMessages.save(all)
}
