# App 组件文档

## 概述
`src/App.tsx` 是应用的根组件，负责组织所有子组件，处理顶层逻辑，提供工具栏。

## 功能特性
1. **状态管理初始化**：调用 useCanvasState 获取所有状态和方法
2. **工具栏展示**：显示应用标题和使用说明
3. **事件协调**：协调各子组件之间的事件和数据流
4. **画布点击处理**：处理画布空白处点击，添加新节点

## 调用流程

### 1. 应用初始化
```
main.tsx 挂载 App 组件
  ↓
App 组件开始渲染
  ↓
调用 useCanvasState() 初始化状态
  ↓
返回所有状态和操作方法
```

### 2. 添加新节点流程
```
用户点击画布空白处
  ↓
handleCanvasClick(e) (App.tsx)
  ↓
检查点击目标是否为节点或工具栏
  ↓
获取 canvas-container 的 bounding rect
  ↓
计算鼠标点击在画布坐标系中的位置：
  x = (clientX - left - transform.x) / transform.scale
  y = (clientY - top - transform.y) / transform.scale
  ↓
调整节点位置，使节点中心在点击位置
  ↓
调用 addNode(x - 90, y - 40)
  ↓
新节点被添加到 nodes 数组
  ↓
触发重渲染
```

### 3. 完整渲染树
```
App
├── Toolbar (fixed, 显示标题和说明)
└── Canvas
    ├── SVG Layer (用于渲染连接线)
    │   └── ConnectionLine × N
    └── NodeBlock × M
```

## 数据流图
```
useCanvasState (状态源)
    ↓
App (协调者)
    ↓
┌───┴───────────────────┐
↓                       ↓
Toolbar (只读)         Canvas (读写)
                        ↓
            ┌───────────┴───────────┐
            ↓                       ↓
        ConnectionLine            NodeBlock
            (只读)             (读写)
```
