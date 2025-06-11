import React, { useState } from 'react';
import { favoriteGames } from '@/data/hobbies';
import { useWindowSize } from '@/components/webpage/breakpoints';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

type MediaType = 'games' | 'westerns' | 'eastern' | 'novels';

const MediaCard: React.FC<{ item: (typeof favoriteGames)[0] }> = ({ item }) => (
  <Link href={item.link || ''} target="_blank">
    <div className="group bg-[#16202D] hover:bg-[#1B2838] transition-colors cursor-pointer rounded-lg overflow-hidden">
      <div className="relative w-full h-[180px]">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
          quality={85}
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-lg font-medium text-white group-hover:text-[#66c0f4] transition-colors">
            {item.name}
          </h3>
          <p className="text-[#acb2b8] mt-1 text-sm line-clamp-2">
            {item.description}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {item.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs rounded bg-[#384959] text-[#66c0f4]"
              >
                {tag}
              </span>
            ))}
            {item.tags.length > 3 && (
              <span className="text-xs text-[#66c0f4]">
                +{item.tags.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  </Link>
);

const MediaList: React.FC = () => {
  const { isXs, isSm, isMd } = useWindowSize();
  const [activeTab, setActiveTab] = useState<MediaType>('games');
  const types = Array.from(
    new Set(favoriteGames.map((item) => item.type))
  ) as MediaType[];
  const filteredItems = favoriteGames.filter((item) => item.type === activeTab);

  // Determine grid columns based on breakpoints
  const getGridCols = () => {
    if (isXs || isSm) return 'grid-cols-1';
    if (isMd) return 'grid-cols-2';
    return 'grid-cols-3';
  };

  return (
    <div className="w-full flex flex-col">
      {/* Tabs */}
      <div className="flex items-center gap-2 md:gap-4 px-2 md:px-4 overflow-x-auto scrollbar-none">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => setActiveTab(type)}
            className={cn(
              'uppercase font-medium whitespace-nowrap text-sm px-3 py-2 transition-all',
              'hover:text-white relative',
              activeTab === type ? 'text-white' : 'text-[#66c0f4]'
            )}
          >
            {type}
            {activeTab === type && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#66c0f4]" />
            )}
          </button>
        ))}
      </div>

      {/* Grid Layout */}
      <div className={cn('grid gap-3 p-2 md:p-4', getGridCols())}>
        {filteredItems.map((item) => (
          <MediaCard key={item.name} item={item} />
        ))}
      </div>
    </div>
  );
};

export default MediaList;
