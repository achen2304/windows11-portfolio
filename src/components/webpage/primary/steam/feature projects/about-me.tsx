import React from 'react';
import Image from 'next/image';
import { useWindowSize } from '@/components/webpage/breakpoints';
import { cn } from '@/lib/utils';

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
}

const BentoGrid: React.FC<BentoGridProps> = ({ children, className }) => {
  return <div className={cn('grid w-full gap-4', className)}>{children}</div>;
};

interface BentoCardProps {
  src: string;
  alt: string;
  text: string;
  className?: string;
}

const BentoCard: React.FC<BentoCardProps> = ({ src, alt, text, className }) => {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl',
        'bg-white dark:bg-black',
        'transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)]',
        className
      )}
    >
      <div className="relative w-full h-full">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/30" />

      <div className="pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-gpu items-center p-6 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <span className="text-xl font-semibold text-white">{text}</span>
      </div>
    </div>
  );
};

const AboutMe: React.FC = () => {
  const { isXs, isSm, isMd } = useWindowSize();
  const isMobileView = isXs || isSm || isMd;

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <BentoGrid
        className={cn(
          'grid-cols-4',
          isMobileView ? 'auto-rows-[200px] gap-3' : 'auto-rows-[250px] gap-4'
        )}
      >
        {/* Large rectangle on top */}
        <BentoCard
          src="/other/setup.webp"
          alt="Setup"
          text="Home Setup"
          className="col-span-3 row-span-1"
        />

        {/* Small square top right */}
        <BentoCard
          src="/other/pc.webp"
          alt="PC"
          text="PC"
          className="col-span-1 row-span-1"
        />

        {/* Small square bottom left */}
        <BentoCard
          src="/other/bike.webp"
          alt="Bike"
          text="Motorcycle"
          className="col-span-1 row-span-1"
        />

        {/* Large rectangle bottom right */}
        <BentoCard
          src="/other/Collection.jpg"
          alt="Book Collection"
          text="Collection"
          className="col-span-3 row-span-1"
        />
      </BentoGrid>
    </div>
  );
};

export default AboutMe;
