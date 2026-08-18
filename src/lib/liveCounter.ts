import { supabase, isSupabaseConfigured } from './supabaseClient'

const SESSION_KEY = 'cohort_clone_view_counted'
const LOCAL_KEY = 'cohort_clone_local_views'
const LOCAL_BASE = 11461

export async function bumpAndGetViewCount(): Promise<number> {
  const alreadyCounted = sessionStorage.getItem(SESSION_KEY)

  if (isSupabaseConfigured && supabase) {
    if (!alreadyCounted) {
      sessionStorage.setItem(SESSION_KEY, '1')
      const { data, error } = await supabase.rpc('increment_site_views')
      if (!error && typeof data === 'number') return data
    }
    const { data } = await supabase.from('site_stats').select('count').eq('id', 'views').maybeSingle()
    if (data && typeof data.count === 'number') return data.count
    return LOCAL_BASE
  }

  let count = Number(localStorage.getItem(LOCAL_KEY) ?? LOCAL_BASE)
  if (!Number.isFinite(count)) count = LOCAL_BASE
  if (!alreadyCounted) {
    sessionStorage.setItem(SESSION_KEY, '1')
    count += 1
    localStorage.setItem(LOCAL_KEY, String(count))
  }
  return count
}

export function subscribeToViewCount(onChange: (count: number) => void): () => void {
  if (!isSupabaseConfigured || !supabase) return () => {}
  const client = supabase
  const channel = client
    .channel('site_stats_views')
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'site_stats', filter: 'id=eq.views' },
      (payload) => {
        const count = (payload.new as { count?: number })?.count
        if (typeof count === 'number') onChange(count)
      },
    )
    .subscribe()
  return () => {
    client.removeChannel(channel)
  }
}
