// My skills: use google to research more about the skill if asked.

import {
  FaHtml5,
  FaCss3Alt,
  FaReact,
  FaNodeJs,
  FaPython,
  FaJava,
  FaGitAlt,
  FaAws,
} from 'react-icons/fa';
import {
  SiMongodb,
  SiMariadb,
  SiGnubash,
  SiC,
  SiExpress,
  SiSwagger,
  SiJunit5,
  SiJest,
  SiStorybook,
  SiTailwindcss,
  SiMui,
  SiRedux,
  SiTypescript,
  SiJavascript,
} from 'react-icons/si';
import { TbBrandMysql } from 'react-icons/tb';
import { BiLogoSpringBoot } from 'react-icons/bi';
import { RiNextjsFill } from 'react-icons/ri';

export interface Skill {
  name: string;
  icon: React.ReactNode;
  type: 'language' | 'frontend' | 'backend' | 'database' | 'devops' | 'tools';
}

export const skills: Skill[] = [
  {
    name: 'Typescript',
    icon: <SiTypescript />,
    type: 'language',
  },

  {
    name: 'Javascript',
    icon: <SiJavascript />,
    type: 'language',
  },
  {
    name: 'Java',
    icon: <FaJava />,
    type: 'language',
  },
  {
    name: 'Python',
    icon: <FaPython />,
    type: 'language',
  },
  {
    name: 'C',
    icon: <SiC />,
    type: 'language',
  },
  {
    name: 'HTML',
    icon: <FaHtml5 />,
    type: 'language',
  },
  {
    name: 'CSS',
    icon: <FaCss3Alt />,
    type: 'language',
  },
  // ----------------Frontend----------------

  {
    name: 'Next.js',
    icon: <RiNextjsFill />,
    type: 'frontend',
  },
  {
    name: 'React',
    icon: <FaReact />,
    type: 'frontend',
  },
  {
    name: 'Tailwind CSS',
    icon: <SiTailwindcss />,
    type: 'frontend',
  },
  {
    name: 'Material UI',
    icon: <SiMui />,
    type: 'frontend',
  },
  {
    name: 'Redux Toolkit',
    icon: <SiRedux />,
    type: 'frontend',
  },
  {
    name: 'Storybook',
    icon: <SiStorybook />,
    type: 'frontend',
  },
  {
    name: 'Jest',
    icon: <SiJest />,
    type: 'frontend',
  },

  // ----------------Backend----------------

  {
    name: 'Express.js',
    icon: <SiExpress />,
    type: 'backend',
  },
  {
    name: 'Node.js',
    icon: <FaNodeJs />,
    type: 'backend',
  },
  {
    name: 'Spring Boot',
    icon: <BiLogoSpringBoot />,
    type: 'backend',
  },
  {
    name: 'Junit',
    icon: <SiJunit5 />,
    type: 'backend',
  },
  {
    name: 'Swagger',
    icon: <SiSwagger />,
    type: 'backend',
  },

  // ----------------Database----------------

  {
    name: 'MongoDB',
    icon: <SiMongodb />,
    type: 'database',
  },
  {
    name: 'MySQL',
    icon: <TbBrandMysql />,
    type: 'database',
  },
  {
    name: 'PostgreSQL',
    icon: <SiMariadb />,
    type: 'database',
  },

  // ----------------Tools----------------

  {
    name: 'AWS',
    icon: <FaAws />,
    type: 'tools',
  },
  { name: 'Bash', icon: <SiGnubash />, type: 'tools' },
  { name: 'Git', icon: <FaGitAlt />, type: 'tools' },
];
