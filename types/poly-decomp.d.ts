declare module 'poly-decomp' {
  export function decompose(vertices: number[][]): number[][][];
  export function triangulate(vertices: number[][]): number[][];
  export function isConvex(vertices: number[][]): boolean;
  export function offset(vertices: number[][], delta: number): number[][];
  export function simplify(vertices: number[][], tolerance: number): number[][];
}
