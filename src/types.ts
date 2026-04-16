export interface Node {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
}

export interface Connection {
  id: string;
  fromId: string;
  toId: string;
}

export interface Transform {
  x: number;
  y: number;
  scale: number;
}
