import { vec3 } from "gl-matrix";
import { Object3D } from "./Object3D";

export class Cone extends Object3D {
  constructor(gl: WebGL2RenderingContext, x = 0, y = 0, z = 0, private radius = 1, private height = 2, private segments = 32) {
    super(gl);
    this.position = vec3.fromValues(x, y, z);
    this.scale = vec3.fromValues(0.1, 0.1, 0.1);
    this.initBuffers();
  }

  override initBuffers(): void {
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
      vertices: this.createBuffer(positions),
      color: this.createBuffer(colors),
      indices: this.createIndexBuffer(indices),
    };

    this.bufferInfo = {
      vertexCount: indices.length,
    };
  }
}
