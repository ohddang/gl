import { vec3 } from "gl-matrix";
import { Object3D, Object3DProps } from "../core/Object3D";

export interface SphereProps extends Object3DProps {
  type: "Sphere";
  radius: number;
  segments: number;
}

export class Sphere extends Object3D<SphereProps> {
  private radius: number;
  private segments: number;

  constructor(props: SphereProps) {
    super(props);
    this.radius = props.radius;
    this.segments = props.segments;
    this.position = vec3.fromValues(props.position[0], props.position[1], props.position[2]);
    this.scale = vec3.fromValues(1, 1, 1);
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
