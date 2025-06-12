import React, { useState, useCallback, useEffect } from 'react';
import { Project } from '@/data/projects';
import { SteamTheme } from '@/components/types/system-types';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import FeaturedCard from './featured-card';

interface DesktopCarouselProps {
  projects: Project[];
  steamTheme: SteamTheme;
  onProjectClick: (projectName: string) => void;
}

const DesktopCarousel: React.FC<DesktopCarouselProps> = ({
  projects,
  steamTheme,
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
      <div className="relative h-[450px] w-90/100 overflow-hidden mx-auto">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={fadeVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full"
          >
            <FeaturedCard
              project={projects[currentIndex]}
              steamTheme={steamTheme}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 z-10">
        <motion.button
          onClick={prevProject}
          className="flex items-center justify-center w-12 h-20 text-white cursor-pointer"
          whileTap={{ scale: 0.9 }}
          aria-label="Previous project"
          whileHover={{
            background: 'linear-gradient(to left, #1D2C3D, #2a475e)',
            opacity: 1,
          }}
          style={{
            background: 'linear-gradient(to left, #1D2C3D, #141e2a)',
            borderRadius: '2px',
            opacity: 0.9,
          }}
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>
      </div>

      <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 z-10">
        <motion.button
          onClick={nextProject}
          className="flex items-center justify-center w-12 h-20 text-white cursor-pointer"
          whileTap={{ scale: 0.9 }}
          aria-label="Next project"
          whileHover={{
            background: 'linear-gradient(to right, #284258, #435D71)',
            opacity: 1,
          }}
          style={{
            background: 'linear-gradient(to right, #284258, #1b2838)',
            borderRadius: '2px',
            opacity: 0.9,
          }}
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-3 gap-1.5">
        {projects.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`w-4.5 h-2.5 rounded-full transition-all hover:cursor-pointer ${
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

export default DesktopCarousel;
