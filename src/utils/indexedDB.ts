import { Node, Connection } from '../types';

const DB_NAME = 'InfiniteCanvasDB';
const DB_VERSION = 1;
const STORE_NODES = 'nodes';
const STORE_CONNECTIONS = 'connections';

let db: IDBDatabase | null = null;

export function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(request.error);
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;

      if (!database.objectStoreNames.contains(STORE_NODES)) {
        const nodeStore = database.createObjectStore(STORE_NODES, { keyPath: 'id' });
        nodeStore.createIndex('id', 'id', { unique: true });
      }

      if (!database.objectStoreNames.contains(STORE_CONNECTIONS)) {
        const connectionStore = database.createObjectStore(STORE_CONNECTIONS, { keyPath: 'id' });
        connectionStore.createIndex('id', 'id', { unique: true });
        connectionStore.createIndex('fromId', 'fromId', { unique: false });
        connectionStore.createIndex('toId', 'toId', { unique: false });
      }
    };
  });
}

export async function getDB(): Promise<IDBDatabase> {
  if (!db) {
    return await initDB();
  }
  return db;
}

export async function getAllNodes(): Promise<Node[]> {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NODES], 'readonly');
    const store = transaction.objectStore(STORE_NODES);
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result || []);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function saveNode(node: Node): Promise<void> {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NODES], 'readwrite');
    const store = transaction.objectStore(STORE_NODES);
    const request = store.put(node);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function saveNodes(nodes: Node[]): Promise<void> {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NODES], 'readwrite');
    const store = transaction.objectStore(STORE_NODES);
    const clearRequest = store.clear();

    clearRequest.onsuccess = () => {
      nodes.forEach((node) => {
        store.put(node);
      });
      resolve();
    };

    clearRequest.onerror = () => {
      reject(clearRequest.error);
    };
  });
}

export async function deleteNode(id: string): Promise<void> {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NODES], 'readwrite');
    const store = transaction.objectStore(STORE_NODES);
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function getAllConnections(): Promise<Connection[]> {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_CONNECTIONS], 'readonly');
    const store = transaction.objectStore(STORE_CONNECTIONS);
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result || []);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function saveConnection(connection: Connection): Promise<void> {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_CONNECTIONS], 'readwrite');
    const store = transaction.objectStore(STORE_CONNECTIONS);
    const request = store.put(connection);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function saveConnections(connections: Connection[]): Promise<void> {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_CONNECTIONS], 'readwrite');
    const store = transaction.objectStore(STORE_CONNECTIONS);
    const clearRequest = store.clear();

    clearRequest.onsuccess = () => {
      connections.forEach((connection) => {
        store.put(connection);
      });
      resolve();
    };

    clearRequest.onerror = () => {
      reject(clearRequest.error);
    };
  });
}

export async function deleteConnection(id: string): Promise<void> {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_CONNECTIONS], 'readwrite');
    const store = transaction.objectStore(STORE_CONNECTIONS);
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function clearAll(): Promise<void> {
  const database = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NODES, STORE_CONNECTIONS], 'readwrite');
    
    const nodeStore = transaction.objectStore(STORE_NODES);
    const clearNodesRequest = nodeStore.clear();
    
    const connectionStore = transaction.objectStore(STORE_CONNECTIONS);
    const clearConnectionsRequest = connectionStore.clear();

    let completed = 0;
    const checkComplete = () => {
      completed++;
      if (completed === 2) {
        resolve();
      }
    };

    clearNodesRequest.onsuccess = checkComplete;
    clearConnectionsRequest.onsuccess = checkComplete;
    
    clearNodesRequest.onerror = () => reject(clearNodesRequest.error);
    clearConnectionsRequest.onerror = () => reject(clearConnectionsRequest.error);
  });
}
