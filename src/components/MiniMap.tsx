import React, { useState, useMemo } from 'react';
import { Node } from '../types';
import { Theme } from '../utils/theme';

interface MiniMapProps {
  nodes: Node[];
  transform: { x: number; y: number; scale: number };
  theme: Theme;
  onMapClick: (x: number, y: number) => void;
}

export function MiniMap({ nodes, transform, theme, onMapClick }: MiniMapProps) {
  const MAP_SIZE = 200;
  const PADDING = 20;

  // 计算所有节点的包围盒
  const bounds = useMemo(() => {
    if (nodes.length === 0) return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    nodes.forEach(node => {
      minX = Math.min(minX, node.x);
      minY = Math.min(minY, node.y);
      maxX = Math.max(maxX, node.x + node.width);
      maxY = Math.max(maxY, node.y + node.height);
    });
    return { minX, minY, maxX, maxY };
  }, [nodes]);

  const worldWidth = bounds.maxX - bounds.minX || 1000;
  const worldHeight = bounds.maxY - bounds.minY || 1000;
  
  // 映射世界坐标到概览图坐标
  const worldToMapX = (x: number) => 
    PADDING + ((x - bounds.minX) / worldWidth) * (MAP_SIZE - 2 * PADDING);
  const worldToMapY = (y: number) => 
    PADDING + ((y - bounds.minY) / worldHeight) * (MAP_SIZE - 2 * PADDING);

  // 映射概览图坐标回世界坐标
  const mapToWorldX = (mx: number) => 
    bounds.minX + ((mx - PADDING) / (MAP_SIZE - 2 * PADDING)) * worldWidth;
  const mapToWorldY = (my: number) => 
    bounds.minY + ((my - PADDING) / (MAP_SIZE - 2 * PADDING)) * worldHeight;

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    onMapClick(mapToWorldX(mx), mapToWorldY(my));
  };

  // 计算当前视口在概览图中的位置和大小
  const viewportWidth = (window.innerWidth - transform.x) / transform.scale; 
  // 这是一个简化计算，实际上应该是 (window.innerWidth / transform.scale)
  const viewW = window.innerWidth / transform.scale;
  const viewH = window.innerHeight / transform.scale;
  
  const viewX = worldToMapX(-transform.x);
  const viewY = worldToMapY(-transform.y);
  const viewWMap = (viewW / worldWidth) * (MAP_SIZE - 2 * PADDING);
  const viewHMap = (viewH / worldHeight) * (MAP_SIZE - 2 * PADDING);

  return (
    <div
      style={{
        width: MAP_SIZE,
        height: MAP_SIZE,
        background: theme.canvas.background,
        border: `2px solid ${theme.toolbar.border}`,
        borderRadius: '8px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 0 20px rgba(0,0,0,0.5)',
      }}
      onClick={handleMapClick}
    >
      {/* 绘制节点简化点 */}
      {nodes.map(node => (
        <div
          key={node.id}
          style={{
            position: 'absolute',
            left: worldToMapX(node.x),
            top: worldToMapY(node.y),
            width: Math.max(2, (node.width / worldWidth) * (MAP_SIZE - 2 * PADDING)),
            height: Math.max(2, (node.height / worldHeight) * (MAP_SIZE - 2 * PADDING)),
            background: theme.node.background,
            border: `1px solid ${theme.node.border}`,
            borderRadius: '1px',
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* 视口矩形 */}
      <div
        style={{
          position: 'absolute',
          left: viewX,
          top: viewY,
          width: viewWMap,
          height: viewHMap,
          border: `2px solid ${theme.node.borderSelected}`,
          background: 'rgba(59, 130, 246, 0.1)',
          pointerEvents: 'none',
          transition: 'all 0.1s ease-out',
        }}
      />
    </div>
  );
}
