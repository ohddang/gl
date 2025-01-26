export interface ProgramInfo {
  program: WebGLProgram;
  attribLocations: {
    vertexPosition: number;
    vertexColor: number;
  };
  uniformLocations: {
    viewProjectMatrix: WebGLUniformLocation | null;
    modelMatrix: WebGLUniformLocation | null;
  };
}
