import { vec3 } from "gl-matrix";
import { Object3D, Object3DProps } from "../core/Object3D";

export interface ConeProps extends Object3DProps {
  type: "Cone";
  radius: number;
  height: number;
  segments: number;
}

export class Cone extends Object3D<ConeProps> {
  radius: number;
  height: number;
  segments: number;

  constructor(props: ConeProps) {
    super(props);
    this.radius = props.radius;
    this.height = props.height;
    this.segments = props.segments;
    this.position = vec3.fromValues(props.position[0], props.position[1], props.position[2]);
    this.scale = vec3.fromValues(1, 1, 1); // 기본 스케일 통일
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
      vertices: this.createBuffer(new Float32Array(positions)),
      color: this.createBuffer(new Float32Array(colors)),
      indices: this.createIndexBuffer(new Uint16Array(indices)),
    };

    this.bufferInfo = {
      vertexCount: indices.length,
    };
  }
}
