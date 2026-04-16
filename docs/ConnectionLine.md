# ConnectionLine 组件文档

## 概述
`src/components/ConnectionLine.tsx` 是节点间的连接线组件，使用 SVG 贝塞尔曲线绘制，自动计算连接路径。

## Props
```typescript
interface ConnectionLineProps {
  fromNode?: Node;  // 起始节点（可选）
  toNode?: Node;    // 目标节点（可选）
}
```

## 功能特性
1. **自动路径计算**：根据两个节点的中心位置计算贝塞尔曲线路径
2. **美观曲线**：使用三次贝塞尔曲线实现平滑过渡
3. **双层线条**：底层深色背景 + 上层彩色线条，增强视觉效果

## 调用流程

### 渲染流程
```
Canvas 组件渲染
  ↓
遍历 connections 数组
  ↓
对每个 connection，查找对应的 fromNode 和 toNode
  ↓
渲染 ConnectionLine 组件
  ↓
检查 fromNode 和 toNode 是否存在
  ↓
计算两个节点的中心点
  ↓
计算贝塞尔曲线控制点
  ↓
生成 path 元素的 d 属性
  ↓
渲染两条 path（背景和前景）
```

### 路径计算算法
```
1. 计算起始节点中心点：
   fromCenterX = fromNode.x + fromNode.width / 2
   fromCenterY = fromNode.y + fromNode.height / 2

2. 计算目标节点中心点：
   toCenterX = toNode.x + toNode.width / 2
   toCenterY = toNode.y + toNode.height / 2

3. 计算位移向量：
   dx = toCenterX - fromCenterX
   dy = toCenterY - fromCenterY

4. 计算起点和终点（向内缩进 10%）：
   fromX = fromCenterX + dx * 0.1
   fromY = fromCenterY + dy * 0.1
   toX = toCenterX - dx * 0.1
   toY = toCenterY - dy * 0.1

5. 计算贝塞尔曲线控制点：
   cp1x = fromX + dx * 0.5
   cp1y = fromY
   cp2x = toX - dx * 0.5
   cp2y = toY

6. 生成路径字符串：
   M fromX fromY C cp1x cp1y, cp2x cp2y, toX toY
```
