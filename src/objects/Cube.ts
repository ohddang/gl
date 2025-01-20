import { vec3 } from "gl-matrix";
import { Object3D } from "./Object3D";
import { ProgramInfo } from "../types/webgl";

export class Cube extends Object3D {
  private gl: WebGL2RenderingContext;
  private buffers!: {
    position: WebGLBuffer;
    color: WebGLBuffer;
    indices: WebGLBuffer;
  };
  private bufferInfo!: {
    vertexCount: number;
  };

  constructor(gl: WebGL2RenderingContext, x = 0, y = 0, z = 0) {
    super();
    this.gl = gl;
    this.position = vec3.fromValues(x, y, z);
    this.scale = vec3.fromValues(0.1, 0.1, 0.1);
    this.initBuffers();
  }

  private initBuffers(): void {
    const positions = [
      // 앞면
      -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
      // 뒷면
      -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,
    ];

    const colors = [
      1.0,
      0.0,
      0.0,
      1.0, // 빨강
      0.0,
      1.0,
      0.0,
      1.0, // 초록
      0.0,
      0.0,
      1.0,
      1.0, // 파랑
      1.0,
      1.0,
      0.0,
      1.0, // 노랑
      1.0,
      0.0,
      1.0,
      1.0, // 보라
      0.0,
      1.0,
      1.0,
      1.0, // 청록
      0.5,
      0.5,
      0.5,
      1.0, // 회색
      1.0,
      1.0,
      1.0,
      1.0, // 흰색
    ];

    const indices = [
      0,
      1,
      2,
      0,
      2,
      3, // 앞면
      4,
      5,
      6,
      4,
      6,
      7, // 뒷면
      0,
      4,
      7,
      0,
      7,
      1, // 윗면
      1,
      7,
      6,
      1,
      6,
      2, // 오른쪽
      2,
      6,
      5,
      2,
      5,
      3, // 윗면
      4,
      0,
      3,
      4,
      3,
      5, // 왼쪽
    ];

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

    gl.clearColor(1, 1, 1, 1);
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, this.matrix);

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
