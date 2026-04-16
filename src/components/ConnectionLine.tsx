import { useState, useRef, useEffect } from 'react';
import { Node } from '../types';

interface ConnectionLineProps {
  fromNode?: Node;
  toNode?: Node;
  connectionId: string;
  onDelete: (connectionId: string) => void;
}

export function ConnectionLine({ fromNode, toNode, connectionId, onDelete }: ConnectionLineProps) {
  const [isHovered, setIsHovered] = useState(false);
  const hideTimeoutRef = useRef<number | null>(null);

  if (!fromNode || !toNode) return null;

  const fromCenterX = fromNode.x + fromNode.width / 2;
  const fromCenterY = fromNode.y + fromNode.height / 2;
  const toCenterX = toNode.x + toNode.width / 2;
  const toCenterY = toNode.y + toNode.height / 2;

  const dx = toCenterX - fromCenterX;
  const dy = toCenterY - fromCenterY;

  const fromX = fromCenterX + dx * 0.1;
  const fromY = fromCenterY + dy * 0.1;
  const toX = toCenterX - dx * 0.1;
  const toY = toCenterY - dy * 0.1;

  const cp1x = fromX + dx * 0.5;
  const cp1y = fromY;
  const cp2x = toX - dx * 0.5;
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
