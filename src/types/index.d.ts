declare module garo {
  export interface EngineOptions {
    canvasId?: string;
    canvas?: HTMLCanvasElement;
    width?: number;
    height?: number;
  }

  export interface CameraOptions {
    position?: [number, number, number];
    target?: [number, number, number];
    fov?: number;
    // ...
  }
}
