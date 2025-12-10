import React from 'react';

const getShapePath = (shapeType, width, height) => {
  const cx = width / 2;
  const cy = height / 2;
  const r = Math.min(width, height) / 2;

  switch (shapeType) {
    case 'triangle':
      return `M${cx},0 L${width},${height} L0,${height} Z`;
    
    case 'diamond':
      return `M${cx},0 L${width},${cy} L${cx},${height} L0,${cy} Z`;
    
    case 'hexagon':
      const hexPoints = [];
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 2;
        hexPoints.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
      }
      return `M${hexPoints.join(' L')} Z`;
    
    case 'pentagon':
      const pentPoints = [];
      for (let i = 0; i < 5; i++) {
        const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
        pentPoints.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
      }
      return `M${pentPoints.join(' L')} Z`;
    
    case 'octagon':
      const octPoints = [];
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI / 4) * i - Math.PI / 8;
        octPoints.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
      }
      return `M${octPoints.join(' L')} Z`;
    
    case 'star':
      const starPoints = [];
      for (let i = 0; i < 10; i++) {
        const angle = (Math.PI / 5) * i - Math.PI / 2;
        const radius = i % 2 === 0 ? r : r * 0.4;
        starPoints.push(`${cx + radius * Math.cos(angle)},${cy + radius * Math.sin(angle)}`);
      }
      return `M${starPoints.join(' L')} Z`;
    
    case 'heart':
      return `M${cx},${height * 0.85} 
              C${width * 0.1},${height * 0.5} 0,${height * 0.3} ${width * 0.25},${height * 0.15}
              C${width * 0.4},${height * 0.05} ${cx},${height * 0.2} ${cx},${height * 0.35}
              C${cx},${height * 0.2} ${width * 0.6},${height * 0.05} ${width * 0.75},${height * 0.15}
              C${width},${height * 0.3} ${width * 0.9},${height * 0.5} ${cx},${height * 0.85} Z`;
    
    case 'arrowRight':
      return `M0,${height * 0.3} L${width * 0.6},${height * 0.3} L${width * 0.6},0 L${width},${cy} L${width * 0.6},${height} L${width * 0.6},${height * 0.7} L0,${height * 0.7} Z`;
    
    case 'arrowLeft':
      return `M${width},${height * 0.3} L${width * 0.4},${height * 0.3} L${width * 0.4},0 L0,${cy} L${width * 0.4},${height} L${width * 0.4},${height * 0.7} L${width},${height * 0.7} Z`;
    
    case 'arrowUp':
      return `M${width * 0.3},${height} L${width * 0.3},${height * 0.4} L0,${height * 0.4} L${cx},0 L${width},${height * 0.4} L${width * 0.7},${height * 0.4} L${width * 0.7},${height} Z`;
    
    case 'arrowDown':
      return `M${width * 0.3},0 L${width * 0.3},${height * 0.6} L0,${height * 0.6} L${cx},${height} L${width},${height * 0.6} L${width * 0.7},${height * 0.6} L${width * 0.7},0 Z`;
    
    case 'chevronRight':
      return `M0,0 L${width * 0.6},${cy} L0,${height} L${width * 0.4},${height} L${width},${cy} L${width * 0.4},0 Z`;
    
    case 'badge':
      return `M${cx},0 L${width * 0.85},${height * 0.15} L${width},${cy} L${width * 0.85},${height * 0.85} L${cx},${height} L${width * 0.15},${height * 0.85} L0,${cy} L${width * 0.15},${height * 0.15} Z`;
    
    case 'shield':
      return `M${cx},0 L${width},${height * 0.15} L${width},${height * 0.5} Q${width},${height * 0.8} ${cx},${height} Q0,${height * 0.8} 0,${height * 0.5} L0,${height * 0.15} Z`;
    
    case 'bookmark':
      return `M0,0 L${width},0 L${width},${height} L${cx},${height * 0.75} L0,${height} Z`;
    
    case 'flag':
      return `M0,0 L${width},${height * 0.25} L${width},${height * 0.75} L0,${height} Z`;
    
    case 'burst':
      const burstPoints = [];
      for (let i = 0; i < 12; i++) {
        const angle = (Math.PI / 6) * i - Math.PI / 2;
        const radius = i % 2 === 0 ? r : r * 0.6;
        burstPoints.push(`${cx + radius * Math.cos(angle)},${cy + radius * Math.sin(angle)}`);
      }
      return `M${burstPoints.join(' L')} Z`;
    
    default:
      return `M0,0 L${width},0 L${width},${height} L0,${height} Z`;
  }
};

export function AdvancedShapeElement({ element, isSelected }) {
  const {
    width = 100,
    height = 100,
    style = {},
    shapeType = 'rectangle',
  } = element;

  const backgroundColor = style.backgroundColor || '#6366f1';
  const isGradient = backgroundColor.includes('gradient');
  
  if (shapeType === 'circle' || shapeType === 'pill' || shapeType === 'roundedRect' || shapeType === 'rectangle') {
    return (
      <div
        className={`${isSelected ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}`}
        style={{
          width,
          height,
          background: backgroundColor,
          borderRadius: style.borderRadius || 0,
          border: style.borderWidth ? `${style.borderWidth}px solid ${style.borderColor || 'transparent'}` : 'none',
          boxShadow: style.shadow || 'none',
        }}
      />
    );
  }

  const path = getShapePath(shapeType, width, height);

  return (
    <div className={`${isSelected ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}`} style={{ width, height }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {isGradient && (
          <defs>
            <linearGradient id={`grad-${element.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={backgroundColor.match(/#[a-fA-F0-9]{6}/g)?.[0] || '#6366f1'} />
              <stop offset="100%" stopColor={backgroundColor.match(/#[a-fA-F0-9]{6}/g)?.[1] || '#8b5cf6'} />
            </linearGradient>
          </defs>
        )}
        <path
          d={path}
          fill={isGradient ? `url(#grad-${element.id})` : backgroundColor}
          stroke={style.borderColor || 'transparent'}
          strokeWidth={style.borderWidth || 0}
        />
      </svg>
    </div>
  );
}

export default AdvancedShapeElement;
