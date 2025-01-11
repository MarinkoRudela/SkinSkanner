import React from 'react';

interface PictureProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
}

export const Picture = ({ src, alt, className, sizes, ...props }: PictureProps) => {
  // Generate WebP source if the original is not already WebP
  const isWebP = src.toLowerCase().endsWith('.webp');
  const webPSrc = isWebP ? src : `${src}?format=webp`;

  return (
    <picture>
      <source
        srcSet={webPSrc}
        type="image/webp"
        sizes={sizes}
      />
      <source
        srcSet={src}
        type={`image/${src.split('.').pop()?.toLowerCase() || 'jpeg'}`}
        sizes={sizes}
      />
      <img
        src={src}
        alt={alt}
        className={className}
        {...props}
      />
    </picture>
  );
};