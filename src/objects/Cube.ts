import { vec3 } from "gl-matrix";
import { Object3D } from "../core/Object3D";

export class Cube extends Object3D {
  constructor(gl: WebGL2RenderingContext, x = 0, y = 0, z = 0) {
    super(gl);
    this.position = vec3.fromValues(x, y, z);
    this.scale = vec3.fromValues(0.1, 0.1, 0.1);
    this.initBuffers();
  }

  override initBuffers(): void {
    const vertices = [
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
      vertices: this.createBuffer(vertices),
      color: this.createBuffer(colors),
      indices: this.createIndexBuffer(indices),
    };

    this.bufferInfo = {
      vertexCount: indices.length,
    };
  }
}
