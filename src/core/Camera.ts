import { vec3, mat4 } from "gl-matrix";
import { DEFAULT_FOV, DEFAULT_NEAR, DEFAULT_FAR } from "../config/constants";

export interface CameraOptions {
  position?: vec3;
  target?: vec3;
  up?: vec3;
  fov?: number;
  aspect?: number;
  near?: number;
  far?: number;
}

export class Camera {
  public position: vec3;
  public target: vec3;
  public up: vec3;
  public fov: number;
  public aspect: number;
  public near: number;
  public far: number;
  public viewMatrix: mat4;
  public projectionMatrix: mat4;

  constructor(options: CameraOptions = {}) {
    this.position = options.position ?? vec3.fromValues(0, 0, -5);
    this.target = options.target ?? vec3.fromValues(0, 0, 0);
    this.up = options.up ?? vec3.fromValues(0, 1, 0);
    this.fov = options.fov ?? DEFAULT_FOV;
    this.aspect = options.aspect ?? 1;
    this.near = options.near ?? DEFAULT_NEAR;
    this.far = options.far ?? DEFAULT_FAR;

    this.viewMatrix = mat4.create();
    this.projectionMatrix = mat4.create();
    this.updateMatrices();
  }

  private updateMatrices(): void {
    mat4.lookAt(this.viewMatrix, this.position, this.target, this.up);
    mat4.perspective(this.projectionMatrix, this.fov, this.aspect, this.near, this.far);
  }

  public setPosition(x: number, y: number, z: number): void {
    this.position = vec3.fromValues(x, y, z);
    this.updateMatrices();
  }
}
