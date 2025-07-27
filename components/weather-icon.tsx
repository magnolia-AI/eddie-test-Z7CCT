'use client';

import Image from 'next/image';

interface WeatherIconProps {
  iconCode: string;
  alt: string;
  width?: number;
  height?: number;
}

export function WeatherIcon({ iconCode, alt, width = 50, height = 50 }: WeatherIconProps) {
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  
  return (
    <div className="relative" style={{ width: `${width}px`, height: `${height}px` }}>
      <Image
        src={iconUrl}
        alt={alt}
        fill
        sizes="((max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw)"
        className="object-contain"
        unoptimized // Required for external images
      />
    </div>
  );
}
