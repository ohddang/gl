import { vec3 } from "gl-matrix";
import { Object3D } from "./Object3D";
import { ProgramInfo } from "../types/webgl";

export class Cone extends Object3D {
  private gl: WebGL2RenderingContext;
  private buffers!: {
    position: WebGLBuffer;
    color: WebGLBuffer;
    indices: WebGLBuffer;
  };
  private bufferInfo!: {
    vertexCount: number;
  };

  constructor(gl: WebGL2RenderingContext, x = 0, y = 0, z = 0, private radius = 1, private height = 2, private segments = 32) {
    super();
    this.gl = gl;
    this.position = vec3.fromValues(x, y, z);
    this.scale = vec3.fromValues(0.1, 0.1, 0.1);
    this.initBuffers();
  }

  private initBuffers(): void {
    const positions: number[] = [];
    const indices: number[] = [];
    const colors: number[] = [];

    // 꼭지점 (원뿔의 끝점)
    positions.push(0, this.height / 2, 0);
    colors.push(1, 1, 1, 1);

    // 바닥 원의 중심점
    positions.push(0, -this.height / 2, 0);
    colors.push(0.5, 0.5, 0.5, 1);

    // 바닥 원의 정점들
    for (let i = 0; i <= this.segments; i++) {
      const theta = (i * 2 * Math.PI) / this.segments;
      const x = this.radius * Math.cos(theta);
      const z = this.radius * Math.sin(theta);
      const y = -this.height / 2;

      positions.push(x, y, z);
      colors.push(Math.abs(Math.cos(theta)), 0.5, Math.abs(Math.sin(theta)), 1.0);
    }

    // 옆면 인덱스
    for (let i = 0; i < this.segments; i++) {
      indices.push(0, i + 2, i + 3);
    }

    // 바닥면 인덱스
    for (let i = 0; i < this.segments - 1; i++) {
      indices.push(1, i + 3, i + 2);
    }
    indices.push(1, 2, this.segments + 2);

    this.buffers = {
      position: this.createBuffer(positions),
      color: this.createBuffer(colors),
      indices: this.createIndexBuffer(indices),
    };

    this.bufferInfo = {
      vertexCount: indices.length,
    };
  }

  private createBuffer(data: number[]): WebGLBuffer {
    const buffer = this.gl.createBuffer();
    if (!buffer) {
      throw new Error("Failed to create buffer");
    }
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW);
    return buffer;
  }

  private createIndexBuffer(data: number[]): WebGLBuffer {
    const buffer = this.gl.createBuffer();
    if (!buffer) {
      throw new Error("Failed to create index buffer");
    }
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), this.gl.STATIC_DRAW);
    return buffer;
  }

  public render(gl: WebGL2RenderingContext, programInfo: ProgramInfo): void {
    this.updateMatrix();

    // modelMatrix uniform에 오브젝트의 변환 행렬을 전달
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, false, this.matrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.position);
    gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.color);
    gl.vertexAttribPointer(programInfo.attribLocations.vertexColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);
    gl.drawElements(gl.TRIANGLES, this.bufferInfo.vertexCount, gl.UNSIGNED_SHORT, 0);
  }
}
