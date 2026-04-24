import React, { useRef, useState, useEffect } from 'react';
import { Node } from '../types';
import { Theme } from '../utils/theme';

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
  theme: Theme;
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
  theme,
}: NodeBlockProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [nodeStart, setNodeStart] = useState({ x: 0, y: 0 });
  const [nodeSizeStart, setNodeSizeStart] = useState({ width: 0, height: 0 });

  // 最小宽高限制
  const MIN_WIDTH = 120;
  const MIN_HEIGHT = 80;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if ((e.target as HTMLElement).closest('.connect-handle')) {
      return;
    }
    if ((e.target as HTMLElement).classList.contains('delete-btn')) {
      onRequestDelete();
      return;
    }
    if ((e.target as HTMLElement).closest('.drag-handle')) {
      onSelect();
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      setNodeStart({ x: node.x, y: node.y });
      return;
    }
    if ((e.target as HTMLElement).closest('.resize-handle')) {
      onSelect();
      setIsResizing(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      setNodeSizeStart({ width: node.width, height: node.height });
      return;
    }
    if ((e.target as HTMLElement).tagName === 'TEXTAREA') return;
    
    onSelect();
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
    } else if (isResizing) {
      const dx = (e.clientX - dragStart.x) / scale;
      const dy = (e.clientY - dragStart.y) / scale;
      const newWidth = Math.max(MIN_WIDTH, nodeSizeStart.width + dx);
      const newHeight = Math.max(MIN_HEIGHT, nodeSizeStart.height + dy);
      onUpdate(node.id, {
        width: newWidth,
        height: newHeight,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
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
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleDocumentMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleDocumentMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart, nodeStart, nodeSizeStart]);

  const renderNodeContent = () => (
    <>
      <div
        className="drag-handle"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '6px 12px',
          borderBottom: `1px solid ${theme.node.border}`,
          cursor: 'grab',
          background: theme.node.dragHandle,
          borderRadius: '10px 10px 0 0',
        }}
      >
        <div style={{ display: 'flex', gap: '4px' }}>
          <div
            style={{
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              background: theme.node.dragHandleDot,
            }}
          />
          <div
            style={{
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              background: theme.node.dragHandleDot,
            }}
          />
          <div
            style={{
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              background: theme.node.dragHandleDot,
            }}
          />
        </div>
      </div>

      <div style={{ flex: 1, padding: '12px', position: 'relative' }}>
        <textarea
          ref={textareaRef}
          value={node.text}
          onChange={handleTextChange}
          onClick={(e) => e.stopPropagation()}
          onFocus={() => onSelect()}
          style={{
            width: '100%',
            height: '100%',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: theme.node.text,
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
        height: node.height,
        display: 'flex',
        flexDirection: 'column',
        background: isConnectingFrom
          ? theme.node.backgroundConnecting
          : isSelected
          ? theme.node.backgroundSelected
          : theme.node.background,
        borderRadius: '12px',
        padding: '0',
        boxShadow: isPreselected
          ? '0 0 30px rgba(16, 185, 129, 0.8), 0 0 60px rgba(16, 185, 129, 0.4)'
          : isConnectingFrom
          ? '0 0 30px rgba(59, 130, 246, 0.8), 0 0 60px rgba(59, 130, 246, 0.4)'
          : isSelected
          ? '0 0 20px rgba(59, 130, 246, 0.5)'
          : '0 4px 6px rgba(0, 0, 0, 0.3)',
        border: `2px solid ${
          isPreselected
            ? theme.node.borderPreselected
            : isConnectingFrom
            ? theme.node.borderConnecting
            : isSelected
            ? theme.node.borderSelected
            : theme.node.border
        }`,
        cursor: 'default',
        zIndex: isPreselected ? 11 : isConnectingFrom ? 11 : isSelected ? 10 : 1,
        transition: 'box-shadow 0.2s, border-color 0.2s, background 0.2s',
        position: 'relative',
      }}
    >
      {/* 删除按钮 - 右上角 */}
      {isSelected && (
        <div
          className="delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            onRequestDelete();
          }}
          style={{
            position: 'absolute',
            top: '-12px',
            right: '-12px',
            width: '28px',
            height: '28px',
            background: '#ef4444',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            zIndex: 20,
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
            transition: 'transform 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          ×
        </div>
      )}

      {/* 连接按钮 - 右侧居中 */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          handleClick(e);
        }}
        style={{
          position: 'absolute',
          right: '-18px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isSelected ? 1 : 0,
          transition: 'opacity 0.2s',
          zIndex: 15,
          cursor: 'pointer',
        }}
      >
        <div
          className="connect-handle"
          style={{
            width: isConnectingFrom ? '28px' : '22px',
            height: isConnectingFrom ? '28px' : '22px',
            background: isConnectingFrom ? theme.node.connectHandleActive : theme.node.connectHandle,
            borderRadius: '50%',
            border: `3px solid ${isConnectingFrom ? theme.node.connectHandleActiveBorder : theme.node.connectHandleBorder}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'width 0.2s, height 0.2s, background 0.2s, border-color 0.2s',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
        >
          <span style={{ color: 'white', fontSize: isConnectingFrom ? '15px' : '13px', fontWeight: 'bold' }}>
            {isConnectingFrom ? '✓' : '+'}
          </span>
        </div>
      </div>

      {/* 调整大小控制柄 - 右下角 */}
      {isSelected && (
        <div
          className="resize-handle"
          onMouseDown={handleMouseDown}
          style={{
            position: 'absolute',
            bottom: '-8px',
            right: '-8px',
            width: '20px',
            height: '20px',
            background: theme.node.borderSelected,
            borderRadius: '0 0 12px 0',
            cursor: 'se-resize',
            zIndex: 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
        >
          <div style={{
            width: '10px',
            height: '10px',
            borderRight: '3px solid white',
            borderBottom: '3px solid white',
            borderRadius: '0 0 4px 0',
          }} />
        </div>
      )}

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
            bottom: '-20px',
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
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          pointerEvents: isInConnectModeAndNotFrom ? 'none' : 'auto',
        }}
      >
        {renderNodeContent()}
      </div>
    </div>
  );
}
