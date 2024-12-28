export const degToRad = (degrees) => (degrees * Math.PI) / 180;
export const radToDeg = (radians) => (radians * 180) / Math.PI;

export const lerp = (start, end, alpha) => start + (end - start) * alpha;
