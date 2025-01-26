import { vec3, mat4 } from "gl-matrix";
import { ProgramInfo } from "../types/webgl";

export abstract class Object3D {
  protected gl: WebGL2RenderingContext;
  public position: vec3;
  public rotation: vec3;
  public scale: vec3;
  public matrix: mat4;

  protected buffers!: {
    vertices: WebGLBuffer;
    color: WebGLBuffer;
    indices: WebGLBuffer;
  };
  protected bufferInfo!: {
    vertexCount: number;
  };

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
    this.position = vec3.fromValues(0, 0, 0);
    this.rotation = vec3.fromValues(0, 0, 0);
    this.scale = vec3.fromValues(1, 1, 1);
    this.matrix = mat4.create();
  }

  abstract initBuffers(): void;

  protected createBuffer(data: number[]): WebGLBuffer {
    const buffer = this.gl.createBuffer();
    if (!buffer) {
      throw new Error("Failed to create buffer");
    }
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW);
    return buffer;
  }

  protected createIndexBuffer(data: number[]): WebGLBuffer {
    const buffer = this.gl.createBuffer();
    if (!buffer) {
      throw new Error("Failed to create index buffer");
    }
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), this.gl.STATIC_DRAW);
    return buffer;
  }

  protected updateMatrix(): void {
    mat4.identity(this.matrix);
    mat4.translate(this.matrix, this.matrix, this.position);
    mat4.rotateX(this.matrix, this.matrix, this.rotation[0]);
    mat4.rotateY(this.matrix, this.matrix, this.rotation[1]);
    mat4.rotateZ(this.matrix, this.matrix, this.rotation[2]);
    mat4.scale(this.matrix, this.matrix, this.scale);
  }

  public render(gl: WebGL2RenderingContext, programInfo: ProgramInfo): void {
    this.updateMatrix();

    // modelMatrix uniform에 오브젝트의 변환 행렬을 전달
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, false, this.matrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.vertices);
    gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.color);
    gl.vertexAttribPointer(programInfo.attribLocations.vertexColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);
    gl.drawElements(gl.TRIANGLES, this.bufferInfo.vertexCount, gl.UNSIGNED_SHORT, 0);
  }
}
