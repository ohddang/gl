import { Camera } from "../core/Camera";
import { Object3D } from "../components/core/Object3D";
import { fs_default } from "../shaders/defaultShader";
import { vs_default } from "../shaders/defaultShader";
import { ProgramInfo } from "../types/webgl";
import { WebGLError } from "../utils/errors";

export class WebGLRenderer {
  #gl: WebGL2RenderingContext;
  #programInfo!: ProgramInfo;
  #clearColor: number[] = [0, 0, 0, 1];

  constructor(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext("webgl2");
    if (!gl) {
      throw new WebGLError("WebGL 2.0 is not supported");
    }
    this.#gl = gl;
    this.init();
  }

  public getContext() {
    return this.#gl;
  }

  private init(): void {
    this.initShaders();
  }

  private initShaders(): void {
    const vertexShader = this.compileShader(vs_default, this.#gl.VERTEX_SHADER);
    const fragmentShader = this.compileShader(fs_default, this.#gl.FRAGMENT_SHADER);

    const shaderProgram = this.#gl.createProgram();
    if (!shaderProgram) {
      throw new Error("Failed to create shader program");
    }

    this.#gl.attachShader(shaderProgram, vertexShader);
    this.#gl.attachShader(shaderProgram, fragmentShader);
    this.#gl.linkProgram(shaderProgram);

    if (!this.#gl.getProgramParameter(shaderProgram, this.#gl.LINK_STATUS)) {
      throw new Error("Failed to initialize shader program");
    }

    this.#programInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: this.#gl.getAttribLocation(shaderProgram, "aVertexPosition"),
        vertexColor: this.#gl.getAttribLocation(shaderProgram, "aVertexColor"),
      },
      uniformLocations: {
        viewProjectMatrix: this.#gl.getUniformLocation(shaderProgram, "uViewProjectMatrix"),
        modelMatrix: this.#gl.getUniformLocation(shaderProgram, "uModelMatrix"),
      },
    };
  }

  private compileShader(source: string, type: number): WebGLShader {
    const shader = this.#gl.createShader(type);
    if (!shader) {
      throw new Error("Failed to create shader");
    }

    this.#gl.shaderSource(shader, source);
    this.#gl.compileShader(shader);

    if (!this.#gl.getShaderParameter(shader, this.#gl.COMPILE_STATUS)) {
      const info = this.#gl.getShaderInfoLog(shader);
      this.#gl.deleteShader(shader);
      throw new Error(`Failed to compile shader: ${info}`);
    }

    return shader;
  }

  public setCanvasSize(canvas: HTMLCanvasElement, camera: Camera, width: number, height: number): void {
    canvas.width = width;
    canvas.height = height;
    this.#gl.viewport(0, 0, width, height);
    camera.setAspect(width / height);
  }

  public setClearColor(r: number, g: number, b: number, a: number) {
    this.#clearColor = [r, g, b, a];
  }

  public render(camera: Camera, objects: Object3D[]): void {
    this.#gl.clearColor(this.#clearColor[0], this.#clearColor[1], this.#clearColor[2], this.#clearColor[3]);
    this.#gl.clear(this.#gl.COLOR_BUFFER_BIT | this.#gl.DEPTH_BUFFER_BIT);

    // 카메라의 view-projection 매트릭스 업데이트
    const viewProjectionMatrix = camera.getViewProjectionMatrix();
    this.#gl.useProgram(this.#programInfo.program);
    this.#gl.uniformMatrix4fv(this.#programInfo.uniformLocations.viewProjectMatrix, false, viewProjectionMatrix);

    // 각 오브젝트 렌더링
    for (const object of objects) {
      object.drawElements(this.#programInfo);
    }
  }
}
