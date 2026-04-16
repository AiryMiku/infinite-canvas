import { useState, useRef, useEffect } from 'react';
import { Node } from '../types';

interface ConnectionLineProps {
  fromNode?: Node;
  toNode?: Node;
  connectionId: string;
  onDelete: (connectionId: string) => void;
  isSelected?: boolean;
}

export function ConnectionLine({ fromNode, toNode, connectionId, onDelete, isSelected }: ConnectionLineProps) {
  const [isHovered, setIsHovered] = useState(false);
  const hideTimeoutRef = useRef<number | null>(null);

  if (!fromNode || !toNode) return null;

  const fromCenterX = fromNode.x + fromNode.width / 2;
  const fromCenterY = fromNode.y + fromNode.height / 2;
  const toCenterX = toNode.x + toNode.width / 2;
  const toCenterY = toNode.y + toNode.height / 2;

  const dx = toCenterX - fromCenterX;
  const dy = toCenterY - fromCenterY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  if (distance === 0) return null;

  const dirX = dx / distance;
  const dirY = dy / distance;

  const fromHalfWidth = fromNode.width / 2;
  const fromHalfHeight = fromNode.height / 2;
  const toHalfWidth = toNode.width / 2;
  const toHalfHeight = toNode.height / 2;

  const getIntersection = (
    centerX: number,
    centerY: number,
    halfWidth: number,
    halfHeight: number,
    dirX: number,
    dirY: number
  ) => {
    const tX = halfWidth / Math.abs(dirX || 1);
    const tY = halfHeight / Math.abs(dirY || 1);
    const t = Math.min(tX, tY);
    return {
      x: centerX + dirX * t,
      y: centerY + dirY * t,
    };
  };

  const fromIntersection = getIntersection(fromCenterX, fromCenterY, fromHalfWidth, fromHalfHeight, dirX, dirY);
  const toIntersection = getIntersection(toCenterX, toCenterY, toHalfWidth, toHalfHeight, -dirX, -dirY);

  const fromX = fromIntersection.x;
  const fromY = fromIntersection.y;
  const toX = toIntersection.x;
  const toY = toIntersection.y;

  const cp1x = fromX + dx * 0.3;
  const cp1y = fromY;
  const cp2x = toX - dx * 0.3;
  const cp2y = toY;

  const pathD = `M ${fromX} ${fromY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${toX} ${toY}`;

  const midX = (fromX + toX) / 2;
  const midY = (fromY + toY) / 2;

  const handleMouseEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    hideTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  return (
    <g onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <defs>
        <linearGradient id={`flow-gradient-${connectionId}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#a78bfa" stopOpacity="1" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path
        d={pathD}
        fill="none"
        stroke="transparent"
        strokeWidth="20"
        style={{ pointerEvents: 'stroke' }}
      />
      <path
        d={pathD}
        fill="none"
        stroke={isHovered ? '#64748b' : '#4a5568'}
        strokeWidth={isHovered ? '4' : '3'}
        strokeLinecap="round"
      />
      <path
        d={pathD}
        fill="none"
        stroke={isHovered ? '#a78bfa' : '#8b5cf6'}
        strokeWidth={isHovered ? '3' : '2'}
        strokeLinecap="round"
      />
      {isSelected && (
        <path
          d={pathD}
          fill="none"
          stroke={`url(#flow-gradient-${connectionId})`}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="20 10"
          style={{
            animation: 'flowAnimation 1s linear infinite',
          }}
        />
      )}
      <style>{`
        @keyframes flowAnimation {
          from {
            stroke-dashoffset: 30;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
      {isHovered && (
        <foreignObject
          x={midX - 16}
          y={midY - 16}
          width="32"
          height="32"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{ pointerEvents: 'auto' }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              background: '#ef4444',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
              zIndex: 100,
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(connectionId);
            }}
          >
            ×
          </div>
        </foreignObject>
      )}
    </g>
  );
}
