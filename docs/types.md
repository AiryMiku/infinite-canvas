# 类型定义文档

## 概述
`src/types.ts` 定义了应用中所有核心数据结构的类型。

## 类型说明

### Node（节点）
```typescript
interface Node {
  id: string;        // 节点唯一标识符
  x: number;         // 节点在画布上的 X 坐标
  y: number;         // 节点在画布上的 Y 坐标
  width: number;     // 节点宽度
  height: number;    // 节点高度
  text: string;      // 节点文本内容
}
```

### Connection（连接）
```typescript
interface Connection {
  id: string;        // 连接唯一标识符
  fromId: string;    // 起始节点 ID
  toId: string;      // 目标节点 ID
}
```

### Transform（变换）
```typescript
interface Transform {
  x: number;         // 画布平移 X 坐标
  y: number;         // 画布平移 Y 坐标
  scale: number;     // 画布缩放比例
}
```

## 调用流程
1. `Node` 类型被所有涉及节点操作的组件使用（NodeBlock、Canvas、App）
2. `Connection` 类型被 ConnectionLine、Canvas、App 组件使用
3. `Transform` 类型主要在 Canvas 组件中用于管理画布变换
