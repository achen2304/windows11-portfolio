'use client';

import React from 'react';
import ProjectImageBackground from '../no-img-bg';
import { SteamTheme } from '@/components/types/system-types';
import Image from 'next/image';

interface HobbiesCardProps {
  game: {
    name: string;
    description: string;
    image: string;
    tags: string[];
  };
  steamTheme: SteamTheme;
  variant?: 'compact' | 'normal';
  maxTags?: number;
  maxDescriptionLength?: number;
}

const HobbiesCard: React.FC<HobbiesCardProps> = ({
  game,
  steamTheme,
  variant = 'normal',
  maxTags = 2,
  maxDescriptionLength = 60,
}) => {
  // Truncate description if needed
  const description =
    game.description.length > maxDescriptionLength
      ? `${game.description.substring(0, maxDescriptionLength)}...`
      : game.description;

  // Determine tags to display
  const displayTags = game.tags.slice(0, maxTags);
  const hasMoreTags = game.tags.length > maxTags;

  // Compact horizontal layout
  if (variant === 'compact') {
    return (
      <div
        className="flex items-center p-2 rounded-lg mb-3 cursor-pointer hover:brightness-110 transition-all duration-200"
        style={{
          background: steamTheme.card,
          border: `1px solid ${steamTheme.divider}`,
        }}
      >
        <Image
          src={`/hobbies/${game.image}`}
          alt={game.name}
          className="w-16 h-16 rounded-md object-cover mr-3 flex-shrink-0 pl-2"
          width={64}
          height={64}
        />
        <div className="flex-1 min-w-0">
          <h3
            className="font-bold text-md truncate pt-2 pb-1"
            style={{ color: steamTheme.textPrimary }}
          >
            {game.name}
          </h3>
          <p
            className="text-xs pr-2 line-clamp-2 h-8"
            style={{ color: steamTheme.textSecondary }}
          >
            {description}
          </p>
          <div className="flex overflow-hidden mt-1 pt-1 space-x-1  pr-2 pb-2">
            {displayTags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-sm text-xs flex-shrink-0"
                style={{
                  background: steamTheme.priceBg,
                  color: steamTheme.textSecondary,
                  border: `1px solid ${steamTheme.divider}`,
                }}
              >
                {tag}
              </span>
            ))}
            {hasMoreTags && (
              <span
                className="text-xs flex-shrink-0"
                style={{ color: steamTheme.textSecondary }}
              >
                +{game.tags.length - maxTags}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Normal grid card layout
  return (
    <div
      className="rounded-lg overflow-hidden cursor-pointer hover:brightness-110 transition-all duration-200"
      style={{
        background: steamTheme.card,
        border: `1px solid ${steamTheme.divider}`,
      }}
    >
      <ProjectImageBackground
        imagePath={`/hobbies/${game.image}`}
        alt={game.name}
        height="h-40"
        opacity={0.9}
      ></ProjectImageBackground>
      <div className="p-3">
        <h3
          className="font-bold text-md"
          style={{ color: steamTheme.textPrimary }}
        >
          {game.name}
        </h3>
        <p className="text-sm mt-1" style={{ color: steamTheme.textSecondary }}>
          {description}
        </p>
        <div className="flex flex-wrap gap-1 mt-2">
          {displayTags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-sm text-xs"
              style={{
                background: steamTheme.priceBg,
                color: steamTheme.textSecondary,
                border: `1px solid ${steamTheme.divider}`,
              }}
            >
              {tag}
            </span>
          ))}
          {hasMoreTags && (
            <span
              className="text-xs"
              style={{ color: steamTheme.textSecondary }}
            >
              +{game.tags.length - maxTags}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default HobbiesCard;
