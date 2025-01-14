export class WebGLError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WebGLError";
  }
}

export class ShaderError extends Error {
  public shaderInfo: string;

  constructor(message: string, shaderInfo: string) {
    super(message);
    this.name = "ShaderError";
    this.shaderInfo = shaderInfo;
  }
}
