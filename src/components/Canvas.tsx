import React, { useRef, useState, useEffect } from 'react';
import { Node, Connection, Transform } from '../types';
import { NodeBlock } from './NodeBlock.tsx';
import { ConnectionLine } from './ConnectionLine.tsx';

interface CanvasProps {
  nodes: Node[];
  connections: Connection[];
  transform: Transform;
  setTransform: React.Dispatch<React.SetStateAction<Transform>>;
  onCanvasClick: (e: React.MouseEvent) => void;
  selectedNodeId: string | null;
  setSelectedNodeId: React.Dispatch<React.SetStateAction<string | null>>;
  connectingFrom: string | null;
  setConnectingFrom: React.Dispatch<React.SetStateAction<string | null>>;
  onUpdateNode: (id: string, updates: Partial<Node>) => void;
  onRequestDeleteNode: (id: string) => void;
  onAddConnection: (fromId: string, toId: string) => void;
  onDeleteConnection: (connectionId: string) => void;
  onNodeContextMenu: (e: React.MouseEvent, nodeId: string) => void;
  onCanvasContextMenu: (e: React.MouseEvent) => void;
}

export function Canvas({
  nodes,
  connections,
  transform,
  setTransform,
  onCanvasClick,
  selectedNodeId,
  setSelectedNodeId,
  connectingFrom,
  setConnectingFrom,
  onUpdateNode,
  onRequestDeleteNode,
  onAddConnection,
  onDeleteConnection,
  onNodeContextMenu,
  onCanvasContextMenu,
}: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragTransformStart, setDragTransformStart] = useState({ x: 0, y: 0 });
  const [hasDragged, setHasDragged] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.node-block')) return;
    if (e.button === 0) {
      setIsDragging(true);
      setHasDragged(false);
      setDragStart({ x: e.clientX, y: e.clientY });
      setDragTransformStart({ x: transform.x, y: transform.y });
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (connectingFrom && !(e.target as HTMLElement).closest('.node-block')) {
      setConnectingFrom(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        setHasDragged(true);
      }
      setTransform({
        ...transform,
        x: dragTransformStart.x + dx,
        y: dragTransformStart.y + dy,
      });
    }
  };

  const handleDocumentMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        setHasDragged(true);
      }
      setTransform({
        ...transform,
        x: dragTransformStart.x + dx,
        y: dragTransformStart.y + dy,
      });
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    // console.log('canvas click', e.clientX, e.clientY, e.nativeEvent);
    if (hasDragged) {
      e.stopPropagation();
      return;
    }

    onCanvasClick(e);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('mousemove', handleDocumentMouseMove);
    }
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleDocumentMouseMove);
    };
  }, [isDragging, dragStart, dragTransformStart, transform]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheelWithPassiveFalse = (e: WheelEvent) => {
      e.preventDefault();
      
      if (e.ctrlKey) {
        const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
        const newScale = Math.max(0.1, Math.min(3, transform.scale * scaleFactor));
        
        const rect = canvas.getBoundingClientRect();
        if (rect) {
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;
          
          const newX = mouseX - (mouseX - transform.x) * (newScale / transform.scale);
          const newY = mouseY - (mouseY - transform.y) * (newScale / transform.scale);
          
          setTransform({ x: newX, y: newY, scale: newScale });
        }
      } else {
        const sensitivity = 0.8;
        setTransform({
          ...transform,
          x: transform.x - e.deltaX * sensitivity,
          y: transform.y - e.deltaY * sensitivity,
        });
      }
    };

    canvas.addEventListener('wheel', handleWheelWithPassiveFalse, { passive: false });
    
    return () => {
      canvas.removeEventListener('wheel', handleWheelWithPassiveFalse);
    };
  }, [transform, setTransform]);



  return (
    <div
      ref={canvasRef}
      className="canvas-container"
      onMouseDown={(e) => {
        handleMouseDown(e);
        handleCanvasMouseDown(e);
      }}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      onContextMenu={onCanvasContextMenu}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: '#1a1a2e',
        cursor: isDragging ? 'grabbing' : 'default',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '300vw',
          height: '300vh',
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: '0 0',
          pointerEvents: 'none',
        }}
      >
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            pointerEvents: 'none',
            overflow: 'visible',
          }}
        >
          {connections.map((conn) => (
            <ConnectionLine
              key={conn.id}
              fromNode={nodes.find((n) => n.id === conn.fromId)}
              toNode={nodes.find((n) => n.id === conn.toId)}
              connectionId={conn.id}
              onDelete={onDeleteConnection}
              isSelected={conn.fromId === selectedNodeId || conn.toId === selectedNodeId}
            />
          ))}
        </svg>

        {nodes.map((node) => (
          <div
            key={node.id}
            style={{
              position: 'absolute',
              left: node.x,
              top: node.y,
              pointerEvents: 'auto',
            }}
          >
            <NodeBlock
              node={node}
              isSelected={selectedNodeId === node.id}
              isConnectingFrom={connectingFrom === node.id}
              isPreselected={!!(connectingFrom && connectingFrom !== node.id)}
              scale={transform.scale}
              onSelect={() => setSelectedNodeId(node.id)}
              onUpdate={onUpdateNode}
              onRequestDelete={() => onRequestDeleteNode(node.id)}
              onToggleConnect={() => {
                if (connectingFrom === node.id) {
                  setConnectingFrom(null);
                } else {
                  setConnectingFrom(node.id);
                }
              }}
              onConnectTo={(toId: string) => {
                if (connectingFrom && connectingFrom !== toId) {
                  onAddConnection(connectingFrom, toId);
                  setConnectingFrom(null);
                } else {
                  setSelectedNodeId(toId);
                }
              }}
              onContextMenu={(e: React.MouseEvent) => onNodeContextMenu(e, node.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
