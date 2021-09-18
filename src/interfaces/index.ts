export interface BoardProps {
  config: Cell[][];
  cellReveal: (r: number, c: number) => void;
  flagCell: (r: number, c: number) => void;
  size: BoardSize;
}

export interface BoardSize {
  w: number;
  h: number;
}

export interface Coords {
  x: number;
  y: number;
}

export interface Cell {
  type: 'mine' | 'number';
  show?: boolean;
  value?: number;
  flagged?: boolean;
}