export interface Experience {
  company: string;
  position: string;
  location: string;
  startMonth: string;
  endMonth: string;
  description: string;
  technologies?: string[];
}

export const experience: Experience[] = [
  {
    company: 'Dwolla',
    position: 'Software Engineering Intern',
    location: 'Des Moines, IA',
    startMonth: 'May 2025',
    endMonth: 'August 2025',
    description:
      'Worked in an agile environment to build a new Dashboard for the Dwolla platform.',
    technologies: ['Typescript', 'React', 'Next.js', 'Material UI', 'Redux'],
  },
  {
    company: 'Iowa State University',
    position: 'Computer Engineering Student',
    location: 'Ames, IA',
    startMonth: 'August 2023',
    endMonth: 'December 2026',
    description:
      'Currently a Computer Engineering student at Iowa State University. I am expected to graduate in December 2026.',
  },
];
