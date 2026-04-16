import React, { useState, useRef, useCallback } from 'react';
import { Canvas } from './components/Canvas';
import { DeleteConfirmDialog } from './components/DeleteConfirmDialog';
import { ContextMenu } from './components/ContextMenu';
import { useCanvasState } from './hooks/useCanvasState';
import { Node } from './types';

type ContextMenuType = 'canvas' | 'node' | null;

function App() {
  const {
    nodes,
    connections,
    transform,
    setTransform,
    selectedNodeId,
    setSelectedNodeId,
    connectingFrom,
    setConnectingFrom,
    addNode,
    updateNode,
    deleteNode,
    addConnection,
    deleteConnection,
    clearAll,
  } = useCanvasState();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [nodeToDelete, setNodeToDelete] = useState<string | null>(null);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    type: ContextMenuType;
    x: number;
    y: number;
    nodeId?: string;
  } | null>(null);
  const [copiedNode, setCopiedNode] = useState<Node | null>(null);
  const lastContextMenuPos = useRef<{ x: number; y: number } | null>(null);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.node-block')) return;
    if ((e.target as HTMLElement).closest('.toolbar')) return;
    if (connectingFrom) return;
    
    if (selectedNodeId) {
      setSelectedNodeId(null);
      return;
    }
    console.log('canvas click', e.clientX, e.clientY);
  };

  const handleCanvasContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if ((e.target as HTMLElement).closest('.node-block')) return;
    if ((e.target as HTMLElement).closest('.toolbar')) return;
    
    console.log('handleCanvasContextMenu called', e.clientX, e.clientY);
    lastContextMenuPos.current = { x: e.clientX, y: e.clientY };
    setContextMenu({
      type: 'canvas',
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleNodeContextMenu = (e: React.MouseEvent, nodeId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      type: 'node',
      x: e.clientX,
      y: e.clientY,
      nodeId,
    });
  };

  const handleCloseContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  const handleAddNode = useCallback(() => {
    if (lastContextMenuPos.current) {
      const canvas = document.querySelector('.canvas-container');
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const x = (lastContextMenuPos.current.x - rect.left - transform.x) / transform.scale;
        const y = (lastContextMenuPos.current.y - rect.top - transform.y) / transform.scale;
        addNode(x - 90, y - 40);
      }
    }
    handleCloseContextMenu();
  }, [addNode, transform, handleCloseContextMenu]);

  const handlePasteNode = useCallback(() => {
    if (copiedNode && lastContextMenuPos.current) {
      const canvas = document.querySelector('.canvas-container');
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const x = (lastContextMenuPos.current.x - rect.left - transform.x) / transform.scale;
        const y = (lastContextMenuPos.current.y - rect.top - transform.y) / transform.scale;
        addNode(x - 90, y - 40, { text: copiedNode.text });
      }
    }
    handleCloseContextMenu();
  }, [copiedNode, transform, addNode, handleCloseContextMenu]);

  const handleCopyNode = useCallback((nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (node) {
      setCopiedNode({ ...node });
    }
    handleCloseContextMenu();
  }, [nodes, handleCloseContextMenu]);

  const handleDeleteNode = useCallback((nodeId: string) => {
    setNodeToDelete(nodeId);
    setShowDeleteDialog(true);
    handleCloseContextMenu();
  }, [handleCloseContextMenu]);

  const handleRequestDeleteNode = (id: string) => {
    setNodeToDelete(id);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (nodeToDelete) {
      deleteNode(nodeToDelete);
    }
    setShowDeleteDialog(false);
    setNodeToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setNodeToDelete(null);
  };

  const handleRequestClearAll = () => {
    setShowClearDialog(true);
  };

  const handleConfirmClearAll = () => {
    clearAll();
    setShowClearDialog(false);
  };

  const handleCancelClearAll = () => {
    setShowClearDialog(false);
  };

  const getContextMenuItems = () => {
    if (contextMenu?.type === 'canvas') {
      return [
        {
          label: '添加节点',
          icon: '➕',
          onClick: handleAddNode,
        },
        {
          label: '粘贴',
          icon: '📋',
          onClick: handlePasteNode,
          disabled: !copiedNode,
        },
      ];
    } else if (contextMenu?.type === 'node' && contextMenu.nodeId) {
      return [
        {
          label: '复制',
          icon: '📋',
          onClick: () => handleCopyNode(contextMenu.nodeId!),
        },
        {
          label: '删除',
          icon: '🗑️',
          onClick: () => handleDeleteNode(contextMenu.nodeId!),
        },
      ];
    }
    return [];
  };

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <div
        className="toolbar"
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          background: '#16213e',
          padding: '12px 20px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
          border: '1px solid #2d3a5a',
          zIndex: 1000,
        }}
      >
        <h1 style={{ margin: '0 0 8px 0', color: '#e2e8f0', fontSize: '16px' }}>
          🧠 无限画布思维导图
        </h1>
        <p style={{ margin: '0 0 10px 0', color: '#94a3b8', fontSize: '12px' }}>
          数据已自动保存 · 刷新不会丢失
        </p>
        <div style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '10px', lineHeight: '1.6' }}>
          <p style={{ margin: '0' }}>• Ctrl + 滚轮：缩放画布</p>
          <p style={{ margin: '0' }}>• 滚轮上下/左右：拖动画布</p>
          <p style={{ margin: '0' }}>• 鼠标拖拽：拖动画布</p>
          <p style={{ margin: '0' }}>• 右键空白处：添加节点/粘贴</p>
          <p style={{ margin: '0' }}>• 右键节点：复制/删除</p>
          <p style={{ margin: '0' }}>• 悬浮连接线：显示删除按钮</p>
        </div>
        {connectingFrom && (
          <p style={{ margin: '0 0 10px 0', color: '#10b981', fontSize: '12px', fontWeight: '500' }}>
            🔗 连接模式：点击另一个节点完成连接（点击空白处取消）
          </p>
        )}
        {!connectingFrom && (
          <p style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: '11px' }}>
            选中节点后点击底部 + 按钮开始连接
          </p>
        )}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleRequestClearAll}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #2d3a5a',
              background: 'transparent',
              color: '#94a3b8',
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#1a2744';
              e.currentTarget.style.color = '#e2e8f0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#94a3b8';
            }}
          >
            🗑️ 清空画布
          </button>
        </div>
      </div>

      <div
        style={{ width: '100%', height: '100%' }}
      >
        <Canvas
          nodes={nodes}
          connections={connections}
          transform={transform}
          setTransform={setTransform}
          onCanvasClick={handleCanvasClick}
          selectedNodeId={selectedNodeId}
          setSelectedNodeId={setSelectedNodeId}
          connectingFrom={connectingFrom}
          setConnectingFrom={setConnectingFrom}
          onUpdateNode={updateNode}
          onRequestDeleteNode={handleRequestDeleteNode}
          onAddConnection={addConnection}
          onDeleteConnection={deleteConnection}
          onNodeContextMenu={handleNodeContextMenu}
          onCanvasContextMenu={handleCanvasContextMenu}
        />
      </div>

      <DeleteConfirmDialog
        isOpen={showDeleteDialog}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {showClearDialog && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCancelClearAll();
          }}
        >
          <div
            style={{
              background: '#16213e',
              padding: '24px',
              borderRadius: '16px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
              border: '1px solid #2d3a5a',
              maxWidth: '320px',
              width: '90%',
            }}
          >
            <h3
              style={{
                margin: '0 0 12px 0',
                color: '#e2e8f0',
                fontSize: '18px',
              }}
            >
              清空画布
            </h3>
            <p
              style={{
                margin: '0 0 24px 0',
                color: '#94a3b8',
                fontSize: '14px',
                lineHeight: '1.5',
              }}
            >
              确定要清空所有节点和连接吗？此操作无法撤销。
            </p>
            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
              }}
            >
              <button
                onClick={handleCancelClearAll}
                style={{
                  padding: '8px 20px',
                  borderRadius: '8px',
                  border: '1px solid #2d3a5a',
                  background: 'transparent',
                  color: '#e2e8f0',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#1a2744';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                取消
              </button>
              <button
                onClick={handleConfirmClearAll}
                style={{
                  padding: '8px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#ef4444',
                  color: 'white',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#dc2626';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#ef4444';
                }}
              >
                清空
              </button>
            </div>
          </div>
        </div>
      )}

      {(() => {
        console.log('render contextMenu:', contextMenu);
        return contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            items={getContextMenuItems()}
            onClose={handleCloseContextMenu}
          />
        );
      })()}
    </div>
  );
}

export default App;
