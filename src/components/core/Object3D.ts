import { vec3, mat4 } from "gl-matrix";
import { ProgramInfo } from "../../types/webgl";
import { Component } from "react";

type MeshType = "Cube" | "Sphere" | "Cone";

export interface Object3DProps {
  type: MeshType;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  gl?: WebGL2RenderingContext;
}

export abstract class Object3D<T extends Object3DProps = Object3DProps> extends Component<T> {
  // protected gl: WebGL2RenderingContext;
  position: vec3;
  rotation: vec3;
  scale: vec3;
  matrix: mat4;
  gl: WebGL2RenderingContext | null;

  protected buffers!: {
    vertices: WebGLBuffer;
    color: WebGLBuffer;
    indices: WebGLBuffer;
  };
  protected bufferInfo!: {
    vertexCount: number;
  };

  constructor(props: T) {
    super(props);
    this.gl = props.gl ? props.gl : null;
    this.position = props.position as vec3;
    this.rotation = props.rotation as vec3;
    this.scale = props.scale as vec3;
    this.matrix = mat4.create();
  }

  abstract initBuffers(): void;

  public setGl(gl: WebGL2RenderingContext): void {
    this.gl = gl;
  }

  protected createBuffer(data: number[]): WebGLBuffer {
    if (!this.gl) {
      throw new Error("GL context is not set");
    }
    const buffer = this.gl.createBuffer();
    if (!buffer) {
      throw new Error("Failed to create buffer");
    }
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW);
    return buffer;
  }

  protected createIndexBuffer(data: number[]): WebGLBuffer {
    if (!this.gl) {
      throw new Error("GL context is not set");
    }
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

  public drawElements(programInfo: ProgramInfo): void {
    if (!this.gl) {
      throw new Error("GL context is not set");
    }

    this.updateMatrix();

    // modelMatrix uniform에 오브젝트의 변환 행렬을 전달
    this.gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, false, this.matrix);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.vertices);
    this.gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 3, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.color);
    this.gl.vertexAttribPointer(programInfo.attribLocations.vertexColor, 4, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);
    this.gl.drawElements(this.gl.TRIANGLES, this.bufferInfo.vertexCount, this.gl.UNSIGNED_SHORT, 0);
  }
}
