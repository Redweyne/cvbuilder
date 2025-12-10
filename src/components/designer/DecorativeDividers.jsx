import React from 'react';

const DIVIDER_TYPES = {
  solid: 'solid',
  dashed: 'dashed',
  dotted: 'dotted',
  double: 'double',
  gradient: 'gradient',
  fadeLeft: 'fadeLeft',
  fadeRight: 'fadeRight',
  fadeCenter: 'fadeCenter',
  dots: 'dots',
  diamonds: 'diamonds',
  arrows: 'arrows',
  wave: 'wave',
  zigzag: 'zigzag',
};

export function DividerElement({ element, isSelected }) {
  const {
    width = 200,
    height = 20,
    style = {},
    dividerType = 'solid',
  } = element;

  const color = style.color || '#e2e8f0';
  const thickness = style.thickness || 2;

  const renderDivider = () => {
    switch (dividerType) {
      case 'solid':
        return (
          <div
            className="w-full"
            style={{
              height: thickness,
              backgroundColor: color,
            }}
          />
        );
      
      case 'dashed':
        return (
          <div
            className="w-full"
            style={{
              height: thickness,
              borderTop: `${thickness}px dashed ${color}`,
            }}
          />
        );
      
      case 'dotted':
        return (
          <div
            className="w-full"
            style={{
              height: thickness,
              borderTop: `${thickness}px dotted ${color}`,
            }}
          />
        );
      
      case 'double':
        return (
          <div className="w-full flex flex-col gap-1">
            <div style={{ height: thickness, backgroundColor: color }} />
            <div style={{ height: thickness, backgroundColor: color }} />
          </div>
        );
      
      case 'gradient':
        return (
          <div
            className="w-full"
            style={{
              height: thickness,
              background: `linear-gradient(90deg, ${color}, ${style.gradientEndColor || '#6366f1'})`,
            }}
          />
        );
      
      case 'fadeLeft':
        return (
          <div
            className="w-full"
            style={{
              height: thickness,
              background: `linear-gradient(90deg, transparent, ${color})`,
            }}
          />
        );
      
      case 'fadeRight':
        return (
          <div
            className="w-full"
            style={{
              height: thickness,
              background: `linear-gradient(90deg, ${color}, transparent)`,
            }}
          />
        );
      
      case 'fadeCenter':
        return (
          <div
            className="w-full"
            style={{
              height: thickness,
              background: `linear-gradient(90deg, transparent, ${color} 50%, transparent)`,
            }}
          />
        );
      
      case 'dots':
        const dotCount = Math.floor(width / 12);
        return (
          <div className="w-full flex justify-between items-center">
            {Array.from({ length: dotCount }).map((_, i) => (
              <div
                key={i}
                className="rounded-full"
                style={{
                  width: thickness * 2,
                  height: thickness * 2,
                  backgroundColor: color,
                }}
              />
            ))}
          </div>
        );
      
      case 'diamonds':
        const diamondCount = Math.floor(width / 16);
        return (
          <div className="w-full flex justify-between items-center">
            {Array.from({ length: diamondCount }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: thickness * 2.5,
                  height: thickness * 2.5,
                  backgroundColor: color,
                  transform: 'rotate(45deg)',
                }}
              />
            ))}
          </div>
        );
      
      case 'arrows':
        const arrowCount = Math.floor(width / 20);
        return (
          <div className="w-full flex justify-center items-center gap-1">
            {Array.from({ length: arrowCount }).map((_, i) => (
              <span
                key={i}
                style={{
                  color,
                  fontSize: thickness * 4,
                  lineHeight: 1,
                }}
              >
                ›
              </span>
            ))}
          </div>
        );
      
      case 'wave':
        return (
          <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
            <path
              d={`M0,${height/2} Q${width/8},0 ${width/4},${height/2} T${width/2},${height/2} T${width*3/4},${height/2} T${width},${height/2}`}
              fill="none"
              stroke={color}
              strokeWidth={thickness}
            />
          </svg>
        );
      
      case 'zigzag':
        const zigCount = Math.floor(width / 20);
        const zigWidth = width / zigCount;
        let zigPath = `M0,${height/2}`;
        for (let i = 0; i < zigCount; i++) {
          const x1 = zigWidth * i + zigWidth / 2;
          const x2 = zigWidth * (i + 1);
          const y1 = i % 2 === 0 ? 2 : height - 2;
          zigPath += ` L${x1},${y1} L${x2},${height/2}`;
        }
        return (
          <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
            <path
              d={zigPath}
              fill="none"
              stroke={color}
              strokeWidth={thickness}
            />
          </svg>
        );
      
      default:
        return (
          <div
            className="w-full"
            style={{
              height: thickness,
              backgroundColor: color,
            }}
          />
        );
    }
  };

  return (
    <div
      className={`flex items-center justify-center ${isSelected ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}`}
      style={{ width, height }}
    >
      {renderDivider()}
    </div>
  );
}

export const DIVIDER_OPTIONS = [
  { value: 'solid', label: 'Solid' },
  { value: 'dashed', label: 'Dashed' },
  { value: 'dotted', label: 'Dotted' },
  { value: 'double', label: 'Double' },
  { value: 'gradient', label: 'Gradient' },
  { value: 'fadeLeft', label: 'Fade Left' },
  { value: 'fadeRight', label: 'Fade Right' },
  { value: 'fadeCenter', label: 'Fade Center' },
  { value: 'dots', label: 'Dots' },
  { value: 'diamonds', label: 'Diamonds' },
  { value: 'arrows', label: 'Arrows' },
  { value: 'wave', label: 'Wave' },
  { value: 'zigzag', label: 'Zigzag' },
];

export default DividerElement;
