'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../../../theme-provider';
import { themes } from '@/lib/themes';
import { projects } from '@/data/projects';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FeaturedCard from './featured-card';
import Image from 'next/image';
import AboutMe from './about-me';
import MediaList from './media-list';

const FeaturedProjects: React.FC = () => {
  const { theme } = useTheme();
  const currentTheme = themes[theme as keyof typeof themes];
  const steamTheme = currentTheme.steam;

  const featuredProjects = projects.filter((project) => project.featured);

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
    startTimer(featuredProjects.length);
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [startTimer, featuredProjects.length]);

  const nextProject = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % featuredProjects.length);
    startTimer(featuredProjects.length);
  };

  const prevProject = () => {
    setDirection(-1);
    setCurrentIndex(
      (prev) => (prev - 1 + featuredProjects.length) % featuredProjects.length
    );
    startTimer(featuredProjects.length);
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
    <div
      className="h-full flex flex-col overflow-auto"
      style={{
        background: steamTheme.content,
        backgroundImage: steamTheme.featuredGradient,
      }}
    >
      {/* Banner Header */}
      <div className="w-full">
        <Image
          src="/other/steam-header.webp"
          alt="Steam Header"
          width={1000}
          height={200}
          className="w-full h-[275px] object-cover"
          priority
        />
      </div>

      {/* Main Content Area */}
      <div
        className="flex-1 flex flex-col p-4 md:p-6 w-full"
        style={{
          maxWidth: '900px',
          minWidth: '400px',
          margin: '0 auto',
        }}
      >
        <div className="w-full  flex flex-col">
          <h2
            className="text-lg font-bold mb-2"
            style={{ color: steamTheme.textPrimary }}
          >
            Featured & Recommended Projects
          </h2>

          {/* Infinite Carousel */}
          <div className="relative w-full max-w-5xl mx-auto">
            {/* Carousel container */}
            <div className="relative h-[360px] md:h-[450px] w-97/100 overflow-hidden mx-auto">
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
                    project={featuredProjects[currentIndex]}
                    steamTheme={steamTheme}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Controls - Rectangular buttons with chevrons outside the card */}
            <div className="absolute left-[-40px] top-1/2 -translate-y-1/2 z-10">
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

            <div className="absolute right-[-40px] top-1/2 -translate-y-1/2 z-10">
              <motion.button
                onClick={nextProject}
                className="flex items-center justify-center w-12 h-20 text-white cursor-pointer "
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
            <div className="flex justify-center mt-3 gap-1.5 ">
              {featuredProjects.map((_, index) => (
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
        </div>

        <div className="w-full mt-10">
          <Image
            src="/other/steam-pagebreak.webp"
            alt="Steam Header"
            width={1000}
            height={100}
            className="w-full h-[100px] object-cover rounded-sm"
            priority
          />
        </div>

        {/* Hobbies Section */}
        <div className="w-full mt-10">
          <h2
            className="text-lg font-bold mb-2"
            style={{ color: steamTheme.textPrimary }}
          >
            Some Pictures
          </h2>
          <AboutMe />
        </div>

        <div className="w-full mt-10">
          <Image
            src="/other/steam-pagebreak.webp"
            alt="Steam Header"
            width={1000}
            height={100}
            className="w-full h-[100px] object-cover rounded-sm"
            priority
          />
        </div>

        <div className="w-full mt-10">
          <h2
            className="text-lg font-bold mb-2"
            style={{ color: steamTheme.textPrimary }}
          >
            My Favorites
          </h2>
          <MediaList />
        </div>
      </div>
    </div>
  );
};

export default FeaturedProjects;
