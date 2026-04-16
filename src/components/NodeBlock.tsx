import React, { useRef, useState, useEffect } from 'react';
import { Node } from '../types';

interface NodeBlockProps {
  node: Node;
  isSelected: boolean;
  isConnectingFrom: boolean;
  isPreselected: boolean;
  scale: number;
  onSelect: () => void;
  onUpdate: (id: string, updates: Partial<Node>) => void;
  onRequestDelete: () => void;
  onToggleConnect: () => void;
  onConnectTo: (toId: string) => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

export function NodeBlock({
  node,
  isSelected,
  isConnectingFrom,
  isPreselected,
  scale,
  onSelect,
  onUpdate,
  onRequestDelete,
  onToggleConnect,
  onConnectTo,
  onContextMenu,
}: NodeBlockProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [nodeStart, setNodeStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if ((e.target as HTMLElement).closest('.connect-handle')) {
      return;
    }
    if ((e.target as HTMLElement).classList.contains('delete-btn')) {
      onRequestDelete();
      return;
    }
    if ((e.target as HTMLElement).classList.contains('drag-handle')) {
      onSelect();
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      setNodeStart({ x: node.x, y: node.y });
      return;
    }
    if ((e.target as HTMLElement).tagName === 'TEXTAREA') return;
    
    onSelect();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setNodeStart({ x: node.x, y: node.y });
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleConnect();
  };

  const handleDocumentMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const dx = (e.clientX - dragStart.x) / scale;
      const dy = (e.clientY - dragStart.y) / scale;
      onUpdate(node.id, {
        x: nodeStart.x + dx,
        y: nodeStart.y + dy,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate(node.id, { text: e.target.value });
  };

  const handleNodeClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.connect-handle')) return;
    if ((e.target as HTMLElement).closest('.delete-btn')) return;
    if ((e.target as HTMLElement).closest('.drag-handle')) return;
    if ((e.target as HTMLElement).tagName === 'TEXTAREA') return;
    
    onConnectTo(node.id);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDocumentMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleDocumentMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, nodeStart]);

  const renderNodeContent = () => (
    <>
      <div
        className="drag-handle"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '6px 12px',
          borderBottom: '1px solid #2d3a5a',
          cursor: 'grab',
          background: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '10px 10px 0 0',
        }}
      >
        <div style={{ display: 'flex', gap: '4px' }}>
          <div
            style={{
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              background: '#64748b',
            }}
          />
          <div
            style={{
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              background: '#64748b',
            }}
          />
          <div
            style={{
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              background: '#64748b',
            }}
          />
        </div>
      </div>

      <div style={{ padding: '12px' }}>
        {isSelected && (
        <div
          className="delete-btn"
          style={{
            position: 'absolute',
            top: '-10px',
            right: '-10px',
            width: '24px',
            height: '24px',
            background: '#ef4444',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            zIndex: 2,
          }}
        >
          ×
        </div>
      )}

        <div
          style={{
            position: 'absolute',
            bottom: '-20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isSelected ? 1 : 0,
            transition: 'opacity 0.2s',
            zIndex: 2,
            cursor: 'pointer',
          }}
          onClick={handleClick}
        >
          <div
            className="connect-handle"
            style={{
              width: isConnectingFrom ? '26px' : '20px',
              height: isConnectingFrom ? '26px' : '20px',
              background: isConnectingFrom ? '#10b981' : '#8b5cf6',
              borderRadius: '50%',
              border: `3px solid ${isConnectingFrom ? '#059669' : '#1a1a2e'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'width 0.2s, height 0.2s, background 0.2s, border-color 0.2s',
              pointerEvents: 'none',
            }}
          >
            <span style={{ color: 'white', fontSize: isConnectingFrom ? '14px' : '12px', fontWeight: 'bold' }}>
              {isConnectingFrom ? '✓' : '+'}
            </span>
          </div>
        </div>

        <textarea
          ref={textareaRef}
          value={node.text}
          onChange={handleTextChange}
          onClick={(e) => e.stopPropagation()}
          onFocus={() => onSelect()}
          style={{
            width: '100%',
            minHeight: '50px',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#e2e8f0',
            fontSize: '14px',
            fontFamily: 'inherit',
            resize: 'none',
            lineHeight: '1.4',
            cursor: 'text',
          }}
          placeholder="输入文本..."
        />
      </div>
    </>
  );

  const isInConnectModeAndNotFrom = !isConnectingFrom && isPreselected;

  return (
    <div
      className="node-block"
      data-node-id={node.id}
      onContextMenu={onContextMenu}
      style={{
        width: node.width,
        minHeight: node.height,
        background: isConnectingFrom ? '#4a00e0' : isSelected ? '#6366f1' : '#16213e',
        borderRadius: '12px',
        padding: '0',
        boxShadow: isPreselected
          ? '0 0 30px rgba(16, 185, 129, 0.8), 0 0 60px rgba(16, 185, 129, 0.4)'
          : isConnectingFrom
          ? '0 0 30px rgba(139, 92, 246, 0.8), 0 0 60px rgba(139, 92, 246, 0.4)'
          : isSelected
          ? '0 0 20px rgba(99, 102, 241, 0.5)'
          : '0 4px 6px rgba(0, 0, 0, 0.3)',
        border: `2px solid ${isPreselected ? '#10b981' : isConnectingFrom ? '#a78bfa' : isSelected ? '#818cf8' : '#2d3a5a'}`,
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: isPreselected ? 11 : isConnectingFrom ? 11 : isSelected ? 10 : 1,
        transition: 'box-shadow 0.2s, border-color 0.2s, background 0.2s',
      }}
    >
      {isInConnectModeAndNotFrom ? (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onConnectTo(node.id);
          }}
          style={{
            position: 'absolute',
            top: '-20px',
            left: '-20px',
            right: '-20px',
            bottom: '-40px',
            cursor: 'pointer',
            zIndex: 100,
          }}
        />
      ) : null}

      <div
        onMouseDown={isInConnectModeAndNotFrom ? (e) => e.stopPropagation() : handleMouseDown}
        onClick={isInConnectModeAndNotFrom ? undefined : handleNodeClick}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          pointerEvents: isInConnectModeAndNotFrom ? 'none' : 'auto',
        }}
      >
        {renderNodeContent()}
      </div>
    </div>
  );
}
