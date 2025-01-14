export const degToRad = (degrees: number): number => (degrees * Math.PI) / 180;
export const radToDeg = (radians: number): number => (radians * 180) / Math.PI;
export const lerp = (start: number, end: number, alpha: number): number => start + (end - start) * alpha;
