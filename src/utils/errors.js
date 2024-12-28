export class WebGLError extends Error {
  constructor(message) {
    super(message);
    this.name = "WebGLError";
  }
}

export class ShaderError extends Error {
  constructor(message, shaderInfo) {
    super(message);
    this.name = "ShaderError";
    this.shaderInfo = shaderInfo;
  }
}
