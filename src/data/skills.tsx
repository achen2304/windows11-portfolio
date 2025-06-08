import {
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaNodeJs,
  FaPython,
  FaJava,
  FaGitAlt,
  FaGoogle,
} from 'react-icons/fa';
import { SiMongodb, SiMariadb, SiGnubash, SiPostman } from 'react-icons/si';
import { TbBrandMysql } from 'react-icons/tb';
import { TiVendorMicrosoft } from 'react-icons/ti';

export interface Skill {
  name: string;
  icon: React.ReactNode;
  type: 'language' | 'frontend' | 'backend' | 'database' | 'devops' | 'tools';
}

export const skills: Skill[] = [
  {
    name: 'Typescript',
    icon: <FaJs />,
    type: 'language',
  },
  {
    name: 'Javascript',
    icon: <FaJs />,
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
    icon: <FaHtml5 />,
    type: 'language',
  },
  {
    name: 'HTML',
    icon: <FaHtml5 />,
    type: 'frontend',
  },
  {
    name: 'CSS',
    icon: <FaCss3Alt />,
    type: 'frontend',
  },
  {
    name: 'Next.js',
    icon: <FaReact />,
    type: 'frontend',
  },
  {
    name: 'React',
    icon: <FaReact />,
    type: 'frontend',
  },
  {
    name: 'Tailwind CSS',
    icon: <FaCss3Alt />,
    type: 'frontend',
  },
  {
    name: 'Material UI',
    icon: <FaCss3Alt />,
    type: 'frontend',
  },
  {
    name: 'Redux Toolkit',
    icon: <FaCss3Alt />,
    type: 'frontend',
  },
  {
    name: 'React Context',
    icon: <FaCss3Alt />,
    type: 'frontend',
  },
  {
    name: 'Express.js',
    icon: <FaNodeJs />,
    type: 'backend',
  },
  {
    name: 'Node.js',
    icon: <FaNodeJs />,
    type: 'backend',
  },
  {
    name: 'Spring Boot',
    icon: <FaNodeJs />,
    type: 'backend',
  },
  {
    name: 'Swagger',
    icon: <FaNodeJs />,
    type: 'backend',
  },
  {
    name: 'MongoDB',
    icon: <SiMongodb />,
    type: 'database',
  },
  {
    name: 'PostgreSQL',
    icon: <SiMariadb />,
    type: 'database',
  },
  {
    name: 'MySQL',
    icon: <TbBrandMysql />,
    type: 'database',
  },
  { name: 'Bash', icon: <SiGnubash />, type: 'tools' },
  { name: 'Git', icon: <FaGitAlt />, type: 'tools' },
  {
    name: 'PostMan',
    icon: <SiPostman />,
    type: 'tools',
  },
  {
    name: 'Microsoft Office',
    icon: <TiVendorMicrosoft />,
    type: 'tools',
  },
  {
    name: 'Google Suite',
    icon: <FaGoogle />,
    type: 'tools',
  },
];
