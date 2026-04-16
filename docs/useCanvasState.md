# useCanvasState Hook 文档

## 概述
`src/hooks/useCanvasState.ts` 是应用的核心状态管理 Hook，封装了所有画布相关的状态和操作逻辑。

## 功能特性
- 节点管理（增删改）
- 连接管理（增删）
- 画布变换管理
- 节点选中状态管理
- 连接模式管理

## 导出内容

### 返回值
```typescript
{
  nodes: Node[];                           // 节点列表
  connections: Connection[];               // 连接列表
  transform: Transform;                    // 画布变换
  setTransform: Dispatch<SetStateAction<Transform>>;  // 设置变换
  selectedNodeId: string | null;           // 当前选中的节点 ID
  setSelectedNodeId: Dispatch<SetStateAction<string | null>>;
  connectingFrom: string | null;           // 连接起始节点 ID
  setConnectingFrom: Dispatch<SetStateAction<string | null>>;
  addNode: (x: number, y: number) => void; // 添加节点
  updateNode: (id: string, updates: Partial<Node>) => void; // 更新节点
  deleteNode: (id: string) => void;        // 删除节点
  addConnection: (fromId: string, toId: string) => void; // 添加连接
  deleteConnection: (id: string) => void;  // 删除连接
}
```

## 调用流程

### 1. 初始化
在 `App.tsx` 中调用 Hook：
```typescript
const {
  nodes,
  connections,
  transform,
  setTransform,
  // ... 其他属性和方法
} = useCanvasState();
```

### 2. 添加节点
调用流程：
```
用户点击 Canvas 空白处
  ↓
handleCanvasClick() (App.tsx)
  ↓
addNode(x, y) (useCanvasState.ts)
  ↓
创建新 Node 对象并添加到 nodes 数组
  ↓
setNodes 更新状态，触发重渲染
```

### 3. 连接节点
调用流程：
```
用户点击 Node 的连接手柄
  ↓
onStartConnect() (NodeBlock.tsx)
  ↓
setConnectingFrom(fromId) (useCanvasState.ts)
  ↓
用户拖拽到另一个 Node 并释放
  ↓
onEndConnect(toId) (NodeBlock.tsx)
  ↓
addConnection(fromId, toId) (useCanvasState.ts)
  ↓
检查连接是否存在
  ↓
创建新 Connection 并添加到 connections 数组
```

### 4. 画布操作
调用流程：
```
用户拖拽画布空白处
  ↓
handleMouseDown() (Canvas.tsx)
  ↓
设置 isDragging = true
  ↓
handleMouseMove() 持续更新
  ↓
setTransform 更新画布平移
```
