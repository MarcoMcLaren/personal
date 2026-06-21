/**
 * Single source of truth for all CV / profile content.
 * Keeping data separate from presentation keeps the Atomic components pure.
 */

export interface SocialLink {
  label: string;
  href: string;
  handle: string;
  icon: 'github' | 'linkedin' | 'mail' | 'phone';
}

export interface ExperienceItem {
  role: string;
  company: string;
  context?: string;
  period: string;
  summary?: string;
  highlights: string[];
  stack: string[];
}

export interface AwardItem {
  title: string;
  detail: string;
  year: string;
}

export interface SkillGroup {
  label: string;
  skills: string[];
}

/**
 * Path to the downloadable CV in /public. Uses Vite's BASE_URL so it resolves
 * correctly both in local dev ("/") and on GitHub Pages ("/personal/").
 */
export const cvUrl = `${import.meta.env.BASE_URL}Marco-McLaren-CV.pdf`;

export const profile = {
  name: 'Marco McLaren',
  firstName: 'Marco',
  lastName: 'McLaren',
  initials: 'MM',
  title: 'Software Engineer',
  subtitle: 'Backend & Cloud Systems',
  location: 'Pretoria, South Africa',
  email: 'mclarenmarco998@gmail.com',
  phone: '+27 72 184 3438',
  tagline: 'Building scalable backend systems & cloud-native enterprise solutions.',
  summary:
    'Software engineer with a passion for building scalable backend systems and cloud-native enterprise solutions. Strong foundation in .NET and Azure, with hands-on experience delivering production systems for major organizations across insurance, mining, and media. Award-winning academic record with multiple honours for best-in-class software systems.',
};

export const socials: SocialLink[] = [
  {
    label: 'GitHub',
    href: 'https://github.com/MarcoMcLaren',
    handle: 'MarcoMcLaren',
    icon: 'github',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/marco-mclaren-80010122a/',
    handle: 'Marco McLaren',
    icon: 'linkedin',
  },
  {
    label: 'Email',
    href: 'mailto:mclarenmarco998@gmail.com',
    handle: 'mclarenmarco998@gmail.com',
    icon: 'mail',
  },
  {
    label: 'Phone',
    href: 'tel:+27721843438',
    handle: '+27 72 184 3438',
    icon: 'phone',
  },
];

export const stats: { value: string; label: string }[] = [
  { value: '3+', label: 'Production systems shipped' },
  { value: '4', label: 'Academic awards & honours' },
  { value: '.NET', label: 'Core engineering stack' },
  { value: 'Azure', label: 'Cloud-native by default' },
];

export const skillGroups: SkillGroup[] = [
  {
    label: 'Languages & Frameworks',
    skills: ['C#', '.NET', 'Blazor', 'REST APIs'],
  },
  {
    label: 'Data & Caching',
    skills: ['SQL Server', 'Cosmos DB', 'Redis'],
  },
  {
    label: 'Cloud & Platform',
    skills: ['Azure', 'Cloud-Native', 'Distributed Systems'],
  },
  {
    label: 'Focus Areas',
    skills: ['Software Architecture', 'Enterprise Systems', 'AI', 'Financial Markets'],
  },
];

export const experience: ExperienceItem[] = [
  {
    role: 'Software Engineer',
    company: 'Agile Bridge — contracted to Hippo.co.za',
    context: "Hippo (TIH / Telesure Group) — South Africa's leading insurance comparison platform",
    period: '2025 — Present',
    highlights: [
      'Developing a new quote generation system integrating with multiple third-party insurance provider APIs.',
      'Building the quote comparison website, API layer, and a custom CMS solution from the ground up.',
      'Working with distributed caching (Redis), NoSQL (Cosmos DB), and relational databases (SQL Server) on Azure.',
      'Mentoring University of Pretoria Computer Science students on their capstone projects.',
      "Awarded Hippo's Initiative and Dedication Award for outstanding performance as a junior.",
    ],
    stack: ['.NET', 'Blazor', 'C#', 'Redis', 'Cosmos DB', 'SQL', 'Azure', 'REST APIs'],
  },
  {
    role: 'Junior Software Engineer',
    company: '4Sight',
    period: '2024',
    highlights: [
      "Assisted in developing an Enterprise Resource Planning (ERP) system for Glencore's mining operations across Southern Africa.",
      'Worked with .NET backend services and SQL Server while completing an Honours degree full-time.',
    ],
    stack: ['.NET', 'C#', 'SQL Server'],
  },
  {
    role: 'Computer Technician',
    company: 'TV Production',
    period: '2023',
    highlights: [
      'Designed and built a custom weather computer PC for live broadcast production.',
      'Provided on-set technical support for hardware and software systems.',
    ],
    stack: ['Hardware', 'Live Broadcast', 'Support'],
  },
];

export const education = {
  degree: 'BIT Honours in Information Systems',
  fullDegree: 'Bachelor of Information Technology — Honours in Information Systems',
  institution: 'University of Pretoria — Department of Informatics',
  period: '2021 — 2024 (4-year degree)',
  note: 'Conferred May 2025',
};

export const awards: AwardItem[] = [
  {
    title: 'Hippo Initiative & Dedication Award',
    detail: 'Recognised for outstanding contribution and drive.',
    year: '2025',
  },
  {
    title: 'Golden Key International Honour Society',
    detail: 'Membership reserved for top academic achievers.',
    year: '2024',
  },
  {
    title: 'BMW Award — Best System in Informatics 370',
    detail: 'Top software system in third-year Informatics, University of Pretoria.',
    year: '2023',
  },
  {
    title: 'Futurent Worldwide Award — Best Project in Informatics 370',
    detail: 'Best project in third-year Informatics, University of Pretoria.',
    year: '2023',
  },
];

export const languages: { name: string; level: string }[] = [
  { name: 'English', level: 'Fluent' },
  { name: 'Afrikaans', level: 'Fluent' },
  { name: 'Dutch', level: 'Reading' },
];

export const navLinks: { label: string; href: string }[] = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Awards', href: '#awards' },
  { label: 'Contact', href: '#contact' },
];
