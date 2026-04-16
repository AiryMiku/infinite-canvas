# NodeBlock 组件文档

## 概述
`src/components/NodeBlock.tsx` 是可编辑的文本块组件，用户可以拖拽移动、编辑文本、删除节点，以及通过连接手柄与其他节点建立连接。

## Props
```typescript
interface NodeBlockProps {
  node: Node;
  isSelected: boolean;
  isConnectingFrom: boolean;
  onSelect: () => void;
  onUpdate: (id: string, updates: Partial<Node>) => void;
  onDelete: (id: string) => void;
  onStartConnect: () => void;
  onEndConnect: (toId: string) => void;
}
```

## 功能特性
1. **节点拖拽**：支持节点在画布上自由移动
2. **文本编辑**：内置 textarea，支持直接编辑
3. **删除功能**：右上角删除按钮
4. **连接功能**：底部连接手柄，用于创建节点间连接
5. **选中状态**：选中时有高亮效果
6. **快捷键支持**：空节点按 Backspace 可删除

## 调用流程

### 1. 节点拖拽流程
```
用户按下节点（非文本区域、非按钮）
  ↓
handleMouseDown()
  ↓
调用 onSelect() 选中节点
  ↓
设置 isDragging = true
  ↓
记录拖拽起始位置 (dragStart) 和节点初始位置 (nodeStart)
  ↓
handleMouseMove() 持续更新
  ↓
计算位移 (dx, dy)
  ↓
调用 onUpdate 更新节点坐标
```

### 2. 文本编辑流程
```
用户点击 textarea
  ↓
textarea 获取焦点
  ↓
用户输入文本
  ↓
handleTextChange() 触发
  ↓
调用 onUpdate 更新 node.text
```

### 3. 连接节点流程
```
用户点击底部连接手柄
  ↓
handleMouseDown()
  ↓
设置 isConnecting = true
  ↓
调用 onStartConnect()
  ↓
用户拖拽鼠标
  ↓
handleMouseUp() 触发
  ↓
查找鼠标位置下的 .node-block
  ↓
调用 onEndConnect(toId)
```

### 4. 删除节点流程
```
用户点击右上角 × 按钮
  ↓
handleMouseDown()
  ↓
调用 onDelete(node.id)
  ↓
useCanvasState.ts 中的 deleteNode 执行
  ↓
从 nodes 数组移除该节点
  ↓
从 connections 数组移除相关连接
```
