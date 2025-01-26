import { Object3D } from "../objects/Object3D";
import { WebGLError } from "../utils/errors";
import { Camera } from "./Camera";
import { ProgramInfo } from "../types/webgl";
import { fs_default, vs_default } from "../shaders/defaultShader";

export interface EngineOptions {
  canvasId?: string;
  canvas?: HTMLCanvasElement;
  width?: number;
  height?: number;
}

/**
 * WebGL 렌더링 엔진의 메인 클래스
 */
export class Engine {
  private canvas: HTMLCanvasElement;
  private gl: WebGL2RenderingContext;
  private objects: Object3D[] = [];
  private programInfo!: ProgramInfo;
  private clearColor: number[] = [0, 0, 0, 1];
  public camera: Camera;

  constructor(options: EngineOptions = {}) {
    if (options.canvas) {
      this.canvas = options.canvas;
    } else if (options.canvasId) {
      const canvas = document.getElementById(options.canvasId) as HTMLCanvasElement;
      if (!canvas) {
        throw new WebGLError("Canvas element not found");
      }
      this.canvas = canvas;
    } else {
      throw new WebGLError("Either canvas or canvasId must be provided");
    }

    const gl = this.canvas.getContext("webgl2");
    if (!gl) {
      throw new WebGLError("WebGL 2.0 is not supported");
    }
    this.gl = gl;

    this.camera = new Camera();
    this.init();
  }

  public getContext() {
    return this.gl;
  }

  private init(): void {
    this.initShaders();
  }

  private initShaders(): void {
    const vertexShader = this.compileShader(vs_default, this.gl.VERTEX_SHADER);
    const fragmentShader = this.compileShader(fs_default, this.gl.FRAGMENT_SHADER);

    const shaderProgram = this.gl.createProgram();
    if (!shaderProgram) {
      throw new Error("Failed to create shader program");
    }

    this.gl.attachShader(shaderProgram, vertexShader);
    this.gl.attachShader(shaderProgram, fragmentShader);
    this.gl.linkProgram(shaderProgram);

    if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
      throw new Error("Failed to initialize shader program");
    }

    this.programInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: this.gl.getAttribLocation(shaderProgram, "aVertexPosition"),
        vertexColor: this.gl.getAttribLocation(shaderProgram, "aVertexColor"),
      },
      uniformLocations: {
        viewProjectMatrix: this.gl.getUniformLocation(shaderProgram, "uViewProjectMatrix"),
        modelMatrix: this.gl.getUniformLocation(shaderProgram, "uModelMatrix"),
      },
    };
  }

  private compileShader(source: string, type: number): WebGLShader {
    const shader = this.gl.createShader(type);
    if (!shader) {
      throw new Error("Failed to create shader");
    }

    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      const info = this.gl.getShaderInfoLog(shader);
      this.gl.deleteShader(shader);
      throw new Error(`Failed to compile shader: ${info}`);
    }

    return shader;
  }

  public setClearColor(r: number, g: number, b: number, a: number) {
    this.clearColor[0] = r;
    this.clearColor[1] = g;
    this.clearColor[2] = b;
    this.clearColor[3] = a;
  }

  public render(): void {
    this.gl.clearColor(this.clearColor[0], this.clearColor[1], this.clearColor[2], this.clearColor[3]);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    // 카메라의 view-projection 매트릭스 업데이트
    const viewProjectionMatrix = this.camera.getViewProjectionMatrix();
    this.gl.useProgram(this.programInfo.program);
    this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.viewProjectMatrix, false, viewProjectionMatrix);

    // 각 오브젝트 렌더링
    for (const object of this.objects) {
      object.render(this.gl, this.programInfo);
    }
  }

  public setCanvasSize(width: number, height: number): void {
    this.canvas.width = width;
    this.canvas.height = height;
    this.gl.viewport(0, 0, width, height);
    this.camera.setAspect(width / height);
  }

  /**
   * 새로운 3D 오브젝트를 씬에 추가
   */
  public addObject(object: Object3D): Object3D {
    this.objects.push(object);
    return object;
  }
}
