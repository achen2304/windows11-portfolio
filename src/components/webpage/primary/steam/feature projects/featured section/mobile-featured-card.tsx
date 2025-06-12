import React from 'react';
import { Project } from '@/data/projects';
import { SteamTheme } from '@/components/types/system-types';
import Image from 'next/image';
import { Tilt } from '@/components/ui/tilt';

interface MobileFeaturedCardProps {
  project: Project;
  steamTheme: SteamTheme;
  onClick: () => void;
}

const MobileFeaturedCard: React.FC<MobileFeaturedCardProps> = ({
  project,
  steamTheme,
  onClick,
}) => (
  <div
    onClick={onClick}
    className="group bg-[#16202D] hover:bg-[#1B2838] transition-colors cursor-pointer rounded-lg overflow-hidden"
  >
    <Tilt rotationFactor={4} isRevese className="relative w-full h-[360px]">
      <Image
        src={`/projects/${project.image}`}
        alt={project.name}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        loading="lazy"
        quality={85}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="flex flex-col gap-2">
          <h3 className="text-xl pl-10 font-medium text-white group-hover:text-[#66c0f4] transition-colors">
            {project.name}
          </h3>
          <p className="text-[#acb2b8] pl-10 text-sm font-semibold line-clamp-2">
            {project.d1}
          </p>
          <p className="text-[#acb2b8] text-sm line-clamp-2">{project.d2}</p>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {project.technologies.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 text-xs rounded"
                style={{
                  background: 'rgba(25, 32, 46, 0.8)',
                  color: steamTheme.textSecondary,
                  border: `1px solid ${steamTheme.divider}`,
                }}
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span
                className="text-xs"
                style={{ color: steamTheme.textSecondary }}
              >
                +{project.technologies.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* View Project Button */}
        <div className="flex justify-end mt-2">
          <button
            className="min-w-[120px] max-w-[160px] flex items-center justify-center gap-2 px-4 py-1.5 cursor-pointer rounded text-sm font-medium"
            style={{
              background: `linear-gradient(to right, ${steamTheme.buttonGradientStart}, ${steamTheme.buttonGradientEnd})`,
              color: '#ffffff',
            }}
          >
            <span className="truncate">View Project</span>
          </button>
        </div>
      </div>
    </Tilt>
  </div>
);

export default MobileFeaturedCard;
