import { vec3 } from "gl-matrix";
import { Object3D, Object3DProps } from "../core/Object3D";

export interface PrimitiveProps extends Object3DProps {
  type: "Primitive";
  vertices: Float32Array;
  normals: Float32Array;
}

export class Primitive extends Object3D<PrimitiveProps> {
  vertices: Float32Array;
  normals: Float32Array;

  constructor(props: PrimitiveProps) {
    super(props);
    this.vertices = props.vertices;
    this.normals = props.normals;
    this.scale = vec3.fromValues(1, 1, 1); // 기본 스케일 통일
    this.initBuffers();
  }

  override initBuffers(): void {
    const indices: Uint16Array = new Uint16Array(this.vertices.length / 3);
    const colors: Float32Array = new Float32Array(this.vertices.length).fill(1);

    for (let i = 0; i < this.vertices.length / 3; i++) {
      indices[i] = i;
    }

    this.buffers = {
      vertices: this.createBuffer(this.vertices),
      normals: this.createBuffer(this.normals),
      color: this.createBuffer(colors),
      indices: this.createIndexBuffer(indices),
    };

    this.bufferInfo = {
      vertexCount: indices.length,
    };
  }
}
