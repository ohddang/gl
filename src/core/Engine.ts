import { Object3D } from "./Object3D";
import { WebGLError } from "../utils/errors";
import { Camera } from "./Camera";
import { WebGLRenderer } from "../renderer";

export interface EngineOptions {
  canvas: string | HTMLCanvasElement;
  width: number;
  height: number;
}

/**
 * WebGL 렌더링 엔진의 메인 클래스
 */
export class Engine {
  #canvas: HTMLCanvasElement;
  #renderer: WebGLRenderer;
  #objects: Object3D[] = [];
  #camera: Camera;

  constructor(options: EngineOptions) {
    if (typeof options.canvas === "string") {
      const canvas = document.getElementById(options.canvas) as HTMLCanvasElement;
      if (!canvas) {
        throw new WebGLError("Canvas element not found");
      }
      this.#canvas = canvas;
    } else if (options.canvas instanceof HTMLCanvasElement) {
      this.#canvas = options.canvas;
    } else {
      throw new WebGLError("Either canvas or canvasId must be provided");
    }

    this.#camera = new Camera();

    this.#renderer = new WebGLRenderer(this.#canvas);
    this.#renderer.setCanvasSize(this.#canvas, this.#camera, this.#canvas.width, this.#canvas.height);
  }

  public useEngine() {
    return { renderer: this.#renderer, camera: this.#camera };
  }

  public addObject(object: Object3D): Object3D {
    this.#objects.push(object);
    return object;
  }

  public render(): void {
    this.#renderer.render(this.#camera, this.#objects);
  }
}
