import { vec3, mat4 } from "gl-matrix";
import { ProgramInfo } from "../types/webgl";

export abstract class Object3D {
  public position: vec3;
  public rotation: vec3;
  public scale: vec3;
  public matrix: mat4;

  constructor() {
    this.position = vec3.fromValues(0, 0, 0);
    this.rotation = vec3.fromValues(0, 0, 0);
    this.scale = vec3.fromValues(1, 1, 1);
    this.matrix = mat4.create();
  }

  protected updateMatrix(): void {
    mat4.identity(this.matrix);
    mat4.translate(this.matrix, this.matrix, this.position);
    mat4.rotateX(this.matrix, this.matrix, this.rotation[0]);
    mat4.rotateY(this.matrix, this.matrix, this.rotation[1]);
    mat4.rotateZ(this.matrix, this.matrix, this.rotation[2]);
    mat4.scale(this.matrix, this.matrix, this.scale);
  }

  abstract render(gl: WebGL2RenderingContext, programInfo: ProgramInfo): void;
}
