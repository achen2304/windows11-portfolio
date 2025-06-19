import { Metadata } from 'next';

// Base URL for the site
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://caichen.dev';

// Default metadata that can be shared across pages
export const defaultMetadata = {
  siteName: 'Cai Chen Portfolio',
  author: 'Cai Chen',
  twitterHandle: '@caichen',
  defaultImage: '/other/readme-banner.webp',
  defaultImageAlt: 'Cai Chen - Windows 11 Portfolio Preview',
  profileImage: '/other/profile.webp',
};

// Generate metadata for specific pages
export function generatePageMetadata({
  title,
  description,
  image = defaultMetadata.defaultImage,
  imageAlt = defaultMetadata.defaultImageAlt,
  noIndex = false,
  additionalKeywords = [],
}: {
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  noIndex?: boolean;
  additionalKeywords?: string[];
}): Metadata {
  const fullTitle = `${title} | ${defaultMetadata.author} - Software Engineer`;
  const url = SITE_URL;

  const keywords = [
    'Cai Chen',
    'software engineer',
    'full-stack developer',
    'portfolio',
    'React',
    'Next.js',
    'TypeScript',
    ...additionalKeywords,
  ];

  return {
    title: fullTitle,
    description,
    keywords,
    authors: [{ name: defaultMetadata.author }],
    creator: defaultMetadata.author,
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: defaultMetadata.siteName,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
      creator: defaultMetadata.twitterHandle,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: url,
    },
  };
}

// Generate structured data for a person (portfolio owner)
export function generatePersonStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: defaultMetadata.author,
    jobTitle: 'Full-Stack Software Engineer',
    description:
      'Passionate full-stack software engineer specializing in React, Next.js, TypeScript, Node.js, and modern web development.',
    url: SITE_URL,
    image: `${SITE_URL}${defaultMetadata.profileImage}`,
    sameAs: [
      process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/achen2304',
      process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://linkedin.com/in/caichen',
    ],
    knowsAbout: [
      'React',
      'Next.js',
      'TypeScript',
      'JavaScript',
      'Node.js',
      'Python',
      'Java',
      'MongoDB',
      'Express.js',
      'AWS',
      'Full-Stack Development',
      'Frontend Development',
      'Backend Development',
      'Web Development',
    ],
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'Iowa State University',
    },
    hasOccupation: {
      '@type': 'Occupation',
      name: 'Software Engineer',
      occupationLocation: {
        '@type': 'Place',
        name: 'United States',
      },
    },
  };
}

// Generate structured data for a portfolio website
export function generateWebsiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Website',
    name: defaultMetadata.siteName,
    description:
      'Interactive Windows 11-inspired portfolio showcasing full-stack development skills',
    url: SITE_URL,
    author: {
      '@type': 'Person',
      name: defaultMetadata.author,
    },
    inLanguage: 'en-US',
    copyrightYear: new Date().getFullYear(),
    copyrightHolder: {
      '@type': 'Person',
      name: defaultMetadata.author,
    },
  };
}

// Generate structured data for projects/portfolio items
export function generateCreativeWorkStructuredData(
  title: string,
  description: string,
  technologies: string[],
  url?: string,
  image?: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: title,
    description,
    creator: {
      '@type': 'Person',
      name: defaultMetadata.author,
    },
    about: technologies,
    url: url || SITE_URL,
    image: image
      ? `${SITE_URL}${image}`
      : `${SITE_URL}${defaultMetadata.defaultImage}`,
    inLanguage: 'en-US',
  };
}
