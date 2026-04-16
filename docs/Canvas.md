# Canvas 组件文档

## 概述
`src/components/Canvas.tsx` 是应用的核心组件，负责渲染无限画布，处理画布的缩放、平移，以及节点和连接线的管理。

## Props
```typescript
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
  onDeleteNode: (id: string) => void;
  onAddConnection: (fromId: string, toId: string) => void;
}
```

## 功能特性
1. **画布平移**：通过鼠标拖拽移动画布
2. **画布缩放**：通过滚轮缩放画布，支持鼠标位置作为缩放中心
3. **节点渲染**：渲染所有 NodeBlock 组件
4. **连接线渲染**：通过 SVG 渲染所有 ConnectionLine 组件
5. **事件处理**：处理画布上的鼠标事件

## 调用流程

### 1. 初始化
```
App.tsx 渲染 Canvas 组件
  ↓
传入所有必要的 props
  ↓
Canvas 组件初始化内部状态
```

### 2. 画布缩放流程
```
用户滚动鼠标滚轮
  ↓
handleWheel(e) (Canvas.tsx)
  ↓
计算缩放因子 (0.9 或 1.1)
  ↓
计算新的缩放比例 (限制在 0.1-3 之间)
  ↓
计算鼠标相对于画布的位置
  ↓
调整平移坐标，使缩放中心保持在鼠标位置
  ↓
setTransform 更新状态
```

### 3. 渲染流程
```
组件状态变化触发重渲染
  ↓
渲染外层容器 (canvas-container)
  ↓
应用 transform: translate(x, y) scale(scale)
  ↓
渲染 SVG 层（连接线）
  ↓
遍历 connections 数组，渲染 ConnectionLine
  ↓
遍历 nodes 数组，渲染 NodeBlock
```
