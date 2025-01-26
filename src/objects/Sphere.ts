import { vec3 } from "gl-matrix";
import { Object3D } from "./Object3D";

export class Sphere extends Object3D {
  constructor(gl: WebGL2RenderingContext, x = 0, y = 0, z = 0, private radius = 1, private segments = 32) {
    super(gl);
    this.position = vec3.fromValues(x, y, z);
    this.scale = vec3.fromValues(0.1, 0.1, 0.1);
    this.initBuffers();
  }

  override initBuffers(): void {
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
      vertices: this.createBuffer(positions),
      color: this.createBuffer(colors),
      indices: this.createIndexBuffer(indices),
    };

    this.bufferInfo = {
      vertexCount: indices.length,
    };
  }
}
