import type { Community } from '@/types'

export const DEPARTMENTS = [
  'All Departments',
  'Student Development and Welfare (SDW)',
  'COHORT Special',
  'AIML Department',
  'CIVIL Department',
  'Computer Department',
  'Computer Regional Department',
  'ENTC Department',
  'IT Department',
  'Mechanical Department',
] as const

function c(partial: Omit<Community, 'id'> ): Community {
  return {
    id: `com-${partial.handle}`,
    ...partial,
  }
}

// Real handles, descriptions and member counts pulled from
// PCCOE_Communities_Directory.docx (screenshotted from the live
// cohortpccoe.in/dashboard/communities page).
export const seedCommunities: Community[] = [
  // SDW
  c({ handle: 'iicpccoe', name: "Institution's Innovation Council", description: "Institution's Innovation Council at PCCOE fostering innovation, startups, and problem-solving among students.", department: 'Student Development and Welfare (SDW)', memberCount: 6, subscribed: false }),
  c({ handle: 'isrpccoe', name: 'Institutional Social Responsibility', description: 'Institutional Social Responsibility community at PCCOE promoting social outreach and welfare initiatives.', department: 'Student Development and Welfare (SDW)', memberCount: 1, subscribed: false }),
  c({ handle: 'ircpccoe', name: 'International Relations Cell', description: 'International Relations Cell at PCCOE encouraging global exposure, exchange programs, and research culture.', department: 'Student Development and Welfare (SDW)', memberCount: 3, subscribed: false }),
  c({ handle: 'nsspccoe', name: 'National Service Scheme', description: 'National Service Scheme (NSS) community at PCCOE encouraging social service and community engagement.', department: 'Student Development and Welfare (SDW)', memberCount: 1, subscribed: false }),
  c({ handle: 'artcirclepccoe', name: 'PCCOE Art Circle', description: 'The Art Circle community at PCCOE celebrating creativity through drawing, painting, and visual arts.', department: 'Student Development and Welfare (SDW)', memberCount: 4, subscribed: false }),
  c({ handle: 'sportscellpccoe', name: 'PCCOE Sports Cell', description: 'Sports Cell community at PCCOE dedicated to sports activities, fitness, and inter-college tournaments.', department: 'Student Development and Welfare (SDW)', memberCount: 3, subscribed: false }),
  c({ handle: 'sdwpccoe', name: 'Student Development and Welfare', description: 'Student Development and Welfare community at PCCOE working on leadership and student welfare programs.', department: 'Student Development and Welfare (SDW)', memberCount: 1, subscribed: false }),
  c({ handle: 'swadcellpccoe', name: 'Students Welfare Grievance Handling Cell', description: 'SWAD Cell community focused on student welfare, academic support, and grievance handling.', department: 'Student Development and Welfare (SDW)', memberCount: 3, subscribed: false }),
  // COHORT Special
  c({ handle: 'cohort', name: 'COHORT — A Social Platform for PCCOE', description: 'Cohort is a campus-first social community at PCCOE where students connect, discuss, and stay updated.', department: 'COHORT Special', memberCount: 428, subscribed: true }),
  c({ handle: 'studygrouppccoe', name: 'PCCOE Study Groups', description: 'A collaborative study community at PCCOE where students discuss academics and share notes.', department: 'COHORT Special', memberCount: 427, isNew: true, subscribed: false }),
  c({ handle: 'pccoetechclub', name: 'PCCOE Tech Club', description: 'The official tech community at PCCOE for coding, hackathons, and all things technology.', department: 'COHORT Special', memberCount: 427, subscribed: false }),
  c({ handle: 'photography', name: 'Photography Club', description: 'Photography community at PCCOE for students passionate about photography and photo walks.', department: 'COHORT Special', memberCount: 427, isNew: true, subscribed: false }),
  c({ handle: 'pccoeplacements', name: 'Placement Preparation Club', description: 'A placement preparation community at PCCOE helping students with aptitude, interviews, and drives.', department: 'COHORT Special', memberCount: 427, subscribed: false }),
  // AIML
  c({ handle: 'aaai', name: 'AAAI Student Chapter', description: 'Advancing AI & ML innovation at PCCOE.', department: 'AIML Department', memberCount: 5, subscribed: false }),
  c({ handle: 'abhyudayapccoe', name: 'Abhyudaya E-Cell', description: 'Abhyudaya E-Cell at PCCOE fostering entrepreneurship, startups, and innovation.', department: 'AIML Department', memberCount: 2, subscribed: false }),
  c({ handle: 'aimsapccoe', name: 'AIML Student Association', description: 'Artificial Intelligence and Machine Learning Students Association at PCCOE.', department: 'AIML Department', memberCount: 15, subscribed: false }),
  c({ handle: 'gfgpccoe', name: 'Geeks For Geeks', description: 'GeeksforGeeks PCCOE community focused on data structures, algorithms, and coding practice.', department: 'AIML Department', memberCount: 21, subscribed: false }),
  c({ handle: 'higherstudies', name: 'Higher Studies Club CAT/GMAT', description: 'A focused community for students preparing for higher studies exams like CAT and GMAT.', department: 'AIML Department', memberCount: 5, subscribed: false }),
  c({ handle: 'higherstudiespccoe', name: 'Higher Studies Club UPSC/MPSC', description: 'A dedicated community for UPSC and MPSC aspirants at PCCOE, supporting exam prep.', department: 'AIML Department', memberCount: 6, subscribed: false }),
  c({ handle: 'ieeecs', name: 'IEEE Computer Society', description: 'Empowering Computer Science and Engineering professionals to fuel continued growth.', department: 'AIML Department', memberCount: 5, subscribed: false }),
  c({ handle: 'innspccoe', name: 'International Neural Networks Society', description: 'International Neural Networks Society chapter at PCCOE focused on neural networks and deep learning research.', department: 'AIML Department', memberCount: 3, subscribed: false }),
  c({ handle: 'ieeepccoe', name: 'PCCOE IEEE Computational Intelligence Society', description: 'IEEE student branch at PCCOE connecting students to global engineering communities.', department: 'AIML Department', memberCount: 2, subscribed: false }),
  // CIVIL
  c({ handle: 'ciesapccoe', name: "Civil Engineering Student's Association", description: 'Civil Engineering Students Association at PCCOE supporting civil engineering students.', department: 'CIVIL Department', memberCount: 0, subscribed: false }),
  // Computer
  c({ handle: 'codechefpccoe', name: 'CodeChef', description: 'CodeChef PCCOE community for competitive programming enthusiasts and coding contests.', department: 'Computer Department', memberCount: 1, subscribed: false }),
  c({ handle: 'cesapccoe', name: 'Computer Engineering Student Association', description: 'The official Computer Engineering Students Association at PCCOE, organizing events.', department: 'Computer Department', memberCount: 2, subscribed: false }),
  c({ handle: 'gdgcpccoe', name: 'Google Developer Groups PCCoE', description: 'Google Developer Groups on Campus PCCOE community for students interested in dev tech.', department: 'Computer Department', memberCount: 5, subscribed: false }),
  c({ handle: 'iotclubpccoe', name: 'IOT Club', description: 'The Internet of Things community at PCCOE exploring embedded systems and hardware.', department: 'Computer Department', memberCount: 3, subscribed: false }),
  c({ handle: 'lfdtpccoe', name: 'LFDT Student Chapter', description: 'LFDT student chapter at PCCOE focused on full stack development and modern web tech.', department: 'Computer Department', memberCount: 3, subscribed: false }),
  c({ handle: 'owasppccoe', name: 'OWASP', description: 'Open Web Application Security Project (OWASP) community at PCCOE focused on app security.', department: 'Computer Department', memberCount: 7, subscribed: false }),
  c({ handle: 'acmpccoe', name: 'PCCOE ACM Student Chapter', description: 'The official ACM student chapter at PCCOE dedicated to advancing computing.', department: 'Computer Department', memberCount: 3, subscribed: false }),
  c({ handle: 'acmwpccoe', name: 'PCCOE ACMW Student Chapter', description: "PCCOE's ACM-W community empowering women in computing through mentorship.", department: 'Computer Department', memberCount: 1, subscribed: false }),
  // Computer Regional
  c({ handle: 'cresapccoe', name: 'Computer Regional Student Association', description: 'Computer Research and Engineering Students Association at PCCOE.', department: 'Computer Regional Department', memberCount: 1, subscribed: false }),
  // ENTC
  c({ handle: 'etsapccoe', name: 'ENTC Student Association', description: 'Electronics and Telecommunication Students Association at PCCOE.', department: 'ENTC Department', memberCount: 2, subscribed: false }),
  // IT
  c({ handle: 'itsapccoe', name: 'IEEE Student Branch', description: 'IEEE chapter activities, workshops and technical talks at PCCOE.', department: 'IT Department', memberCount: 2, subscribed: false }),
  c({ handle: 'mlscpccoe', name: 'Microsoft Learn Student Chapter', description: 'Microsoft tech workshops, certifications and cloud sessions at PCCOE.', department: 'IT Department', memberCount: 2, subscribed: false }),
  // Mechanical
  c({ handle: 'iiepccoe', name: 'The Institution of Engineers PCCOE', description: 'Institution of Engineers (India) student chapter at PCCOE promoting engineering excellence.', department: 'Mechanical Department', memberCount: 0, subscribed: false }),
  c({ handle: 'teamkratosracing', name: 'Team Kratos Racing', description: 'Team Kratos Racing at PCCOE specializing in race car engineering and mechanical design.', department: 'Mechanical Department', memberCount: 1, subscribed: false }),
  c({ handle: 'teammaverick', name: 'Team Maverick', description: 'Team Maverick at PCCOE focused on innovative engineering projects.', department: 'Mechanical Department', memberCount: 0, subscribed: false }),
  c({ handle: 'teamredbaron', name: 'Team Red Baron', description: 'Team Red Baron at PCCOE dedicated to designing and building high-performance aero projects.', department: 'Mechanical Department', memberCount: 2, subscribed: false }),
  c({ handle: 'teamsolariumindia', name: 'Team Solarium India', description: 'Team Solarium India at PCCOE working on solar-powered vehicle design.', department: 'Mechanical Department', memberCount: 0, subscribed: false }),
  c({ handle: 'ishraepccoe', name: 'ISHRAE Student Chapter', description: 'ISHRAE student chapter at PCCOE exploring heating, refrigeration and air conditioning.', department: 'Mechanical Department', memberCount: 0, subscribed: false }),
  c({ handle: 'mesapccoe', name: 'Mechanical Engg Students Association', description: 'Mechanical Engineering Students Association at PCCOE supporting mechanical students.', department: 'Mechanical Department', memberCount: 0, subscribed: false }),
  c({ handle: 'teamambush', name: 'Team Ambush', description: 'Team Ambush at PCCOE focusing on off-road vehicle design and fabrication.', department: 'Mechanical Department', memberCount: 2, subscribed: false }),
  c({ handle: 'teamautomatons', name: 'Team Automatons', description: 'Team Automatons at PCCOE working on robotics, automation, and intelligent systems.', department: 'Mechanical Department', memberCount: 1, subscribed: false }),
]

export function getCommunityByHandle(handle: string): Community | undefined {
  return seedCommunities.find((c) => c.handle === handle)
}
