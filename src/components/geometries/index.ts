import { CubeProps } from "./Cube";
import { SphereProps } from "./Sphere";
import { ConeProps } from "./Cone";
import { PrimitiveProps } from "./Primitive";

export { Primitive, type PrimitiveProps } from "./Primitive";
export { Cube, type CubeProps } from "./Cube";
export { Sphere, type SphereProps } from "./Sphere";
export { Cone, type ConeProps } from "./Cone";

export type MeshType = CubeProps | SphereProps | ConeProps | PrimitiveProps;
