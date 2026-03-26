import React from 'react';
import ImageCell from './ImageCell';

const AvatarCell = ({ src, imageSrc, name, size = 40 }) => {
  const finalSrc = src || imageSrc;
  return (
    <div className="flex items-center gap-3">
      <div 
        className="relative flex shrink-0 overflow-hidden rounded-full border border-gray-200 bg-gray-50"
        style={{ width: size, height: size }}
      >
        {finalSrc ? (
          <ImageCell 
            src={finalSrc} 
            alt={name || "Avatar"} 
            width={size} 
            height={size} 
            className="h-full w-full rounded-none border-none" 
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary font-semibold text-xs capitalize">
            {name ? name.charAt(0) : "U"}
          </div>
        )}
      </div>
      {name && <span className="font-medium text-sm text-gray-700">{name}</span>}
    </div>
  );
};

export default AvatarCell;
