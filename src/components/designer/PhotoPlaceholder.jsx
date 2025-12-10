import React from 'react';
import { User, Image, Camera } from 'lucide-react';

const MASK_TYPES = {
  none: 'none',
  circle: 'circle',
  rounded: 'rounded',
  square: 'square',
  hexagon: 'hexagon',
  diamond: 'diamond',
  oval: 'oval',
};

const getMaskStyle = (maskType, width, height) => {
  switch (maskType) {
    case 'circle':
      return { borderRadius: '50%' };
    case 'rounded':
      return { borderRadius: '16px' };
    case 'square':
      return { borderRadius: '0' };
    case 'hexagon':
      return {
        clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
      };
    case 'diamond':
      return {
        clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
      };
    case 'oval':
      return { borderRadius: '50%' };
    default:
      return { borderRadius: '8px' };
  }
};

export function PhotoPlaceholderElement({ element, isSelected }) {
  const {
    width = 120,
    height = 120,
    style = {},
    imageUrl,
    maskType = 'circle',
    showBorder = true,
    placeholderIcon = 'user',
  } = element;

  const maskStyle = getMaskStyle(maskType, width, height);
  
  const PlaceholderIcon = placeholderIcon === 'camera' ? Camera : placeholderIcon === 'image' ? Image : User;

  return (
    <div
      className={`relative overflow-hidden flex items-center justify-center ${
        isSelected ? 'ring-2 ring-indigo-500' : ''
      }`}
      style={{
        width,
        height,
        backgroundColor: style.backgroundColor || '#e2e8f0',
        border: showBorder ? `${style.borderWidth || 3}px solid ${style.borderColor || '#6366f1'}` : 'none',
        ...maskStyle,
      }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Profile"
          className="w-full h-full object-cover"
          style={maskStyle}
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-slate-400">
          <PlaceholderIcon 
            className="w-1/3 h-1/3" 
            style={{ color: style.iconColor || '#94a3b8' }}
          />
          {style.showText && (
            <span className="text-xs mt-1" style={{ color: style.textColor || '#94a3b8' }}>
              Add Photo
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export const PHOTO_MASK_OPTIONS = [
  { value: 'circle', label: 'Circle', preview: '50%' },
  { value: 'rounded', label: 'Rounded', preview: '16px' },
  { value: 'square', label: 'Square', preview: '0' },
  { value: 'hexagon', label: 'Hexagon', preview: 'hex' },
  { value: 'diamond', label: 'Diamond', preview: 'diamond' },
  { value: 'oval', label: 'Oval', preview: 'oval' },
];

export default PhotoPlaceholderElement;
