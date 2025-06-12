import React, { useState, useCallback, useEffect } from 'react';
import { Project } from '@/data/projects';
import { SteamTheme } from '@/components/types/system-types';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MobileFeaturedCard from './mobile-featured-card';

interface MobileCarouselProps {
  projects: Project[];
  steamTheme: SteamTheme;
  onProjectClick: (projectName: string) => void;
}

const MobileCarousel: React.FC<MobileCarouselProps> = ({
  projects,
  steamTheme,
  onProjectClick,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const startTimer = useCallback((length: number) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % length);
    }, 10000);
  }, []);

  useEffect(() => {
    startTimer(projects.length);
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [startTimer, projects.length]);

  const nextProject = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % projects.length);
    startTimer(projects.length);
  };

  const prevProject = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
    startTimer(projects.length);
  };

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const threshold = 50; // minimum distance for swipe
    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0) {
        prevProject();
      } else {
        nextProject();
      }
    }
  };

  const fadeVariants = {
    enter: () => ({
      opacity: 0.5,
      scale: 0.95,
    }),
    center: {
      opacity: 1,
      scale: 1,
      transition: {
        opacity: { duration: 0.3 },
        scale: { duration: 0.3 },
      },
    },
    exit: () => ({
      opacity: 0.5,
      scale: 0.95,
      transition: {
        opacity: { duration: 0.1 },
        scale: { duration: 0.1 },
      },
    }),
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      {/* Carousel container */}
      <div className="relative h-[360px] w-full overflow-hidden mx-auto">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={fadeVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
          >
            <MobileFeaturedCard
              project={projects[currentIndex]}
              steamTheme={steamTheme}
              onClick={() => onProjectClick(projects[currentIndex].name)}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10">
        <motion.button
          onClick={prevProject}
          className="flex items-center justify-center w-10 h-10 text-white cursor-pointer rounded-full bg-black/70 backdrop-blur-sm"
          style={{
            background: 'linear-gradient(to left, #1D2C3D, #141e2a)',
            border: `1px solid ${steamTheme.divider}`,
          }}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          aria-label="Previous project"
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>
      </div>

      <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10">
        <motion.button
          onClick={nextProject}
          className="flex items-center justify-center w-10 h-10 text-white cursor-pointer rounded-full bg-black/70 backdrop-blur-sm"
          style={{
            background: 'linear-gradient(to right, #1D2C3D, #141e2a)',
            border: `1px solid ${steamTheme.divider}`,
          }}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          aria-label="Next project"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-2 gap-1.5">
        {projects.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`w-3.5 h-2 rounded-full transition-all hover:cursor-pointer ${
              index === currentIndex
                ? 'bg-white/80 scale-110'
                : 'bg-white/30 hover:bg-white/50'
            }`}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
    </div>
  );
};

export default MobileCarousel;
