import React, { useState, useRef, useCallback } from 'react';
import { Canvas } from './components/Canvas';
import { DeleteConfirmDialog } from './components/DeleteConfirmDialog';
import { ContextMenu } from './components/ContextMenu';
import { useCanvasState } from './hooks/useCanvasState';
import { Node } from './types';
import { getTheme, Theme } from './utils/theme';

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
  const [themeName, setThemeName] = useState<'dark' | 'light'>('dark');
  const theme = getTheme(themeName);
  const [showHelp, setShowHelp] = useState(true);
  const [contextMenu, setContextMenu] = useState<{
    type: ContextMenuType;
    x: number;
    y: number;
    nodeId?: string;
  } | null>(null);
  const [copiedNode, setCopiedNode] = useState<Node | null>(null);
  const lastContextMenuPos = useRef<{ x: number; y: number } | null>(null);

  const handleExportImage = useCallback(() => {
    // 如果没有节点就不导出
    if (nodes.length === 0) {
      alert('请先添加一些节点再导出！');
      return;
    }

    // 计算所有节点的边界
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    nodes.forEach(node => {
      minX = Math.min(minX, node.x);
      minY = Math.min(minY, node.y);
      maxX = Math.max(maxX, node.x + node.width);
      maxY = Math.max(maxY, node.y + node.height);
    });

    // 添加一些内边距
    const padding = 50;
    const width = maxX - minX + padding * 2;
    const height = maxY - minY + padding * 2;

    // 创建画布
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = width;
    exportCanvas.height = height;
    const ctx = exportCanvas.getContext('2d');

    if (!ctx) return;

    // 绘制背景
    ctx.fillStyle = theme.canvas.background;
    ctx.fillRect(0, 0, width, height);

    // 首先绘制连接线
    const drawConnections = () => {
      connections.forEach(conn => {
        const fromNode = nodes.find(n => n.id === conn.fromId);
        const toNode = nodes.find(n => n.id === conn.toId);
        if (!fromNode || !toNode) return;

        // 计算中心点坐标
        const fromX = fromNode.x + fromNode.width / 2 - minX + padding;
        const fromY = fromNode.y + fromNode.height / 2 - minY + padding;
        const toX = toNode.x + toNode.width / 2 - minX + padding;
        const toY = toNode.y + toNode.height / 2 - minY + padding;

        // 绘制贝塞尔曲线
        const dx = toX - fromX;
        const cp1x = fromX + dx * 0.3;
        const cp1y = fromY;
        const cp2x = toX - dx * 0.3;
        const cp2y = toY;

        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, toX, toY);
        ctx.strokeStyle = theme.connection.line;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.stroke();
      });
    };

    // 绘制节点
    const drawNodes = () => {
      // 绘制圆角矩形的辅助函数
      const drawRoundRect = (x: number, y: number, width: number, height: number, radius: number) => {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
      };

      nodes.forEach(node => {
        const x = node.x - minX + padding;
        const y = node.y - minY + padding;
        const w = node.width;
        const h = node.height;

        // 绘制节点背景和边框
        const isSelected = selectedNodeId === node.id;
        const bgColor = isSelected ? theme.node.backgroundSelected : theme.node.background;
        const borderColor = isSelected ? theme.node.borderSelected : theme.node.border;

        drawRoundRect(x, y, w, h, 12);
        ctx.fillStyle = bgColor;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = borderColor;
        ctx.stroke();

        // 绘制文本
        ctx.fillStyle = theme.node.text;
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // 简单文本绘制（自动换行会复杂些，这里简化处理）
        const textY = y + h / 2;
        ctx.fillText(node.text, x + w / 2, textY);
      });
    };

    // 执行绘制
    drawConnections();
    drawNodes();

    // 导出为图片
    const pngUrl = exportCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'mindmap.png';
    link.href = pngUrl;
    link.click();
  }, [nodes, connections, selectedNodeId, theme]);

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
          background: theme.toolbar.background,
          padding: '12px 20px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
          border: `1px solid ${theme.toolbar.border}`,
          zIndex: 1000,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showHelp ? '8px' : '0' }}>
          <h1 style={{ margin: '0', color: theme.toolbar.text, fontSize: '16px' }}>
            🧠 无限画布思维导图
          </h1>
          <button
            onClick={() => setShowHelp(!showHelp)}
            style={{
              background: 'transparent',
              border: 'none',
              color: theme.toolbar.textSecondary,
              cursor: 'pointer',
              fontSize: '16px',
              padding: '4px',
              marginLeft: '8px',
              transition: 'transform 0.2s',
            }}
            title={showHelp ? '收起帮助' : '显示帮助'}
          >
            {showHelp ? '▲' : '▼'}
          </button>
        </div>

        {showHelp && (
          <>
            <p style={{ margin: '0 0 10px 0', color: theme.toolbar.textSecondary, fontSize: '12px' }}>
              数据已自动保存 · 刷新不会丢失
            </p>
            <div style={{ margin: '0 0 8px 0', color: theme.toolbar.textMuted, fontSize: '10px', lineHeight: '1.6' }}>
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
              <p style={{ margin: '0 0 10px 0', color: theme.toolbar.textMuted, fontSize: '11px' }}>
                选中节点后点击右侧 + 按钮开始连接
              </p>
            )}
          </>
        )}

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setThemeName(themeName === 'dark' ? 'light' : 'dark')}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: `1px solid ${theme.button.border}`,
              background: theme.button.background,
              color: theme.button.text,
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = theme.button.backgroundHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = theme.button.background;
            }}
          >
            {themeName === 'dark' ? '☀️ 浅色' : '🌙 深色'}
          </button>
          <button
            onClick={handleExportImage}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: `1px solid ${theme.button.border}`,
              background: theme.button.background,
              color: theme.button.text,
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = theme.button.backgroundHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = theme.button.background;
            }}
          >
            📷 导出图片
          </button>
          <button
            onClick={handleRequestClearAll}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: `1px solid ${theme.button.border}`,
              background: theme.button.background,
              color: theme.button.text,
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = theme.button.backgroundHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = theme.button.background;
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
          theme={theme}
        />
      </div>

      <DeleteConfirmDialog
        isOpen={showDeleteDialog}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        theme={theme}
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
              background: theme.dialog.background,
              padding: '24px',
              borderRadius: '16px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
              border: `1px solid ${theme.dialog.border}`,
              maxWidth: '320px',
              width: '90%',
            }}
          >
            <h3
              style={{
                margin: '0 0 12px 0',
                color: theme.dialog.text,
                fontSize: '18px',
              }}
            >
              清空画布
            </h3>
            <p
              style={{
                margin: '0 0 24px 0',
                color: theme.dialog.textSecondary,
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
                  border: `1px solid ${theme.button.border}`,
                  background: theme.button.background,
                  color: theme.button.text,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = theme.button.backgroundHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = theme.button.background;
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
            theme={theme}
          />
        );
      })()}
    </div>
  );
}

export default App;
