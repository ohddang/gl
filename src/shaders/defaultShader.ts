const vs_default = `
attribute vec4 aVertexPosition;
attribute vec4 aVertexColor;

uniform mat4 uModelMatrix;
uniform mat4 uViewProjectMatrix;

varying lowp vec4 vColor;

void main() {
  gl_Position = uViewProjectMatrix * uModelMatrix * aVertexPosition;
  vColor = aVertexColor;
}
`;

const fs_default = `
varying lowp vec4 vColor;

void main() {
  gl_FragColor = vColor;
}
`;

export { vs_default, fs_default };
