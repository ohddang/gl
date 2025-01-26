import { vec3 } from "gl-matrix";
import { Object3D } from "./Object3D";
import { ProgramInfo } from "../types/webgl";

export class Sphere extends Object3D {
  private gl: WebGL2RenderingContext;
  private buffers!: {
    position: WebGLBuffer;
    color: WebGLBuffer;
    indices: WebGLBuffer;
  };
  private bufferInfo!: {
    vertexCount: number;
  };

  constructor(gl: WebGL2RenderingContext, x = 0, y = 0, z = 0, private radius = 1, private segments = 32) {
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

    // 구 정점 생성
    for (let lat = 0; lat <= this.segments; lat++) {
      const theta = (lat * Math.PI) / this.segments;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      for (let lon = 0; lon <= this.segments; lon++) {
        const phi = (lon * 2 * Math.PI) / this.segments;
        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);

        const x = cosPhi * sinTheta;
        const y = cosTheta;
        const z = sinPhi * sinTheta;

        positions.push(this.radius * x, this.radius * y, this.radius * z);

        // 각 정점마다 다른 색상 지정
        colors.push(Math.abs(x), Math.abs(y), Math.abs(z), 1.0);
      }
    }

    // 인덱스 생성
    for (let lat = 0; lat < this.segments; lat++) {
      for (let lon = 0; lon < this.segments; lon++) {
        const first = lat * (this.segments + 1) + lon;
        const second = first + this.segments + 1;

        indices.push(first, second, first + 1);
        indices.push(second, second + 1, first + 1);
      }
    }

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
