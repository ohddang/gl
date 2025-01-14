export const DEFAULT_FOV = 45;
export const DEFAULT_NEAR = 0.1;
export const DEFAULT_FAR = 1000;

export const SHADER_TYPES = {
  VERTEX: "vertex",
  FRAGMENT: "fragment",
} as const;

export type ShaderType = (typeof SHADER_TYPES)[keyof typeof SHADER_TYPES];
