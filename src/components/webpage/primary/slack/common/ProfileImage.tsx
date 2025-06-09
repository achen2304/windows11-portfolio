import React from 'react';
import Image from 'next/image';

interface ProfileImageProps {
  src: string;
  alt: string;
  className?: string;
}

const ProfileImage: React.FC<ProfileImageProps> = ({
  src,
  alt,
  className = '',
}) => (
  <div
    className={`w-9 h-9 rounded mr-2 overflow-hidden flex-shrink-0 ${className}`}
  >
    <Image
      src={src}
      alt={alt}
      width={36}
      height={36}
      className="w-full h-full object-cover"
    />
  </div>
);

export default ProfileImage;
