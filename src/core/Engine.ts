import { Object3D } from "./Object3D";
import { Camera } from "./Camera";
import { WebGLRenderer } from "../renderer";

export interface EngineOptions {
  width: number;
  height: number;
  canvasRef?: React.RefObject<HTMLCanvasElement | null>;
}

/**
 * WebGL 렌더링 엔진의 메인 클래스
 */
export class Engine {
  #objects: Object3D[] = [];
  camera: Camera;
  renderer: WebGLRenderer;
  canvasRef?: React.RefObject<HTMLCanvasElement | null>;
  
  constructor(props: EngineOptions) {
    if (props.canvasRef?.current) {
      this.renderer = new WebGLRenderer(props.canvasRef.current);
      this.canvasRef = props.canvasRef;
    } else {
      throw new Error("Canvas is not found");
    }
    this.camera = new Camera();
  }

  public setCanvasSize(width: number, height: number): void {
    if (this.canvasRef?.current) {
      this.canvasRef.current.width = width;
      this.canvasRef.current.height = height;
      this.renderer.setCanvasSize(this.canvasRef.current, this.camera, width, height);
    } else {
      throw new Error("Canvas is not found");
    }
  }

  public getContext(): WebGL2RenderingContext {
    return this.renderer.getContext();
  }

  public useEngine() {
    return { renderer: this.renderer, camera: this.camera };
  }

  public addObject(object: Object3D): Object3D {
    this.#objects.push(object);
    return object;
  }

  public render(): void {
    this.renderer.render(this.camera, this.#objects);
  }
}
