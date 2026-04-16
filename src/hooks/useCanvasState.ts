import { useState, useCallback, useEffect } from 'react';
import { Node, Connection, Transform } from '../types';
import * as db from '../utils/indexedDB';

export function useCanvasState() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [transform, setTransform] = useState<Transform>({ x: 0, y: 0, scale: 1 });
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedNodes = await db.getAllNodes();
        const savedConnections = await db.getAllConnections();
        setNodes(savedNodes);
        setConnections(savedConnections);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    db.saveNodes(nodes).catch((error) => {
      console.error('Failed to save nodes:', error);
    });
  }, [nodes, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    db.saveConnections(connections).catch((error) => {
      console.error('Failed to save connections:', error);
    });
  }, [connections, isLoaded]);

  const addNode = useCallback((x: number, y: number, content?: Partial<Node>) => {
    const newNode: Node = {
      id: `node-${Date.now()}`,
      x,
      y,
      width: 180,
      height: 80,
      text: '新节点',
      ...content,
    };
    setNodes((prev) => [...prev, newNode]);
  }, []);

  const updateNode = useCallback((id: string, updates: Partial<Node>) => {
    setNodes((prev) =>
      prev.map((node) => (node.id === id ? { ...node, ...updates } : node))
    );
  }, []);

  const deleteNode = useCallback((id: string) => {
    setNodes((prev) => prev.filter((node) => node.id !== id));
    setConnections((prev) =>
      prev.filter((conn) => conn.fromId !== id && conn.toId !== id)
    );
    if (selectedNodeId === id) setSelectedNodeId(null);
  }, [selectedNodeId]);

  const addConnection = useCallback((fromId: string, toId: string) => {
    const exists = connections.some(
      (conn) => (conn.fromId === fromId && conn.toId === toId) ||
                (conn.fromId === toId && conn.toId === fromId)
    );
    if (!exists && fromId !== toId) {
      const newConnection: Connection = {
        id: `conn-${Date.now()}`,
        fromId,
        toId,
      };
      setConnections((prev) => [...prev, newConnection]);
    }
    setConnectingFrom(null);
  }, [connections]);

  const deleteConnection = useCallback((id: string) => {
    setConnections((prev) => prev.filter((conn) => conn.id !== id));
  }, []);

  const clearAll = useCallback(async () => {
    setNodes([]);
    setConnections([]);
    setSelectedNodeId(null);
    setConnectingFrom(null);
    await db.clearAll();
  }, []);

  return {
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
  };
}
