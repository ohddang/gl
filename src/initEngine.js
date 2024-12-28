import { mat4 } from "gl-matrix";

class RenderEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.gl = this.canvas.getContext("webgl2");

    if (!this.gl) {
      throw new Error("WebGL을 초기화할 수 없습니다.");
    }

    this.objects = [];
    this.camera = {
      position: [0, 0, -5],
      rotation: [0, 0, 0],
      fov: 45,
      aspect: this.canvas.width / this.canvas.height,
      near: 0.1,
      far: 1000.0,
    };

    this.initShaders();
    this.initMatrices();
  }

  initShaders() {
    // 버텍스 셰이더
    const vsSource = `
            attribute vec4 aVertexPosition;
            attribute vec4 aVertexColor;
            
            uniform mat4 uModelViewMatrix;
            uniform mat4 uProjectionMatrix;
            
            varying lowp vec4 vColor;
            
            void main() {
                gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
                vColor = aVertexColor;
            }
        `;

    // 프래그먼트 셰이더
    const fsSource = `
            varying lowp vec4 vColor;
            
            void main() {
                gl_FragColor = vColor;
            }
        `;

    const vertexShader = this.compileShader(vsSource, this.gl.VERTEX_SHADER);
    const fragmentShader = this.compileShader(fsSource, this.gl.FRAGMENT_SHADER);

    // 셰이더 프로그램 생성
    this.shaderProgram = this.gl.createProgram();
    this.gl.attachShader(this.shaderProgram, vertexShader);
    this.gl.attachShader(this.shaderProgram, fragmentShader);
    this.gl.linkProgram(this.shaderProgram);

    if (!this.gl.getProgramParameter(this.shaderProgram, this.gl.LINK_STATUS)) {
      throw new Error("셰이더 프로그램을 초기화할 수 없습니다.");
    }

    // 셰이더 프로그램의 속성 위치 가져오기
    this.programInfo = {
      program: this.shaderProgram,
      attribLocations: {
        vertexPosition: this.gl.getAttribLocation(this.shaderProgram, "aVertexPosition"),
        vertexColor: this.gl.getAttribLocation(this.shaderProgram, "aVertexColor"),
      },
      uniformLocations: {
        projectionMatrix: this.gl.getUniformLocation(this.shaderProgram, "uProjectionMatrix"),
        modelViewMatrix: this.gl.getUniformLocation(this.shaderProgram, "uModelViewMatrix"),
      },
    };
  }

  compileShader(source, type) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      const info = this.gl.getShaderInfoLog(shader);
      this.gl.deleteShader(shader);
      throw new Error("셰이더 컴파일 오류: " + info);
    }

    return shader;
  }

  initMatrices() {
    this.projectionMatrix = mat4.create();
    this.modelViewMatrix = mat4.create();

    // 투영 행렬 설정
    mat4.perspective(this.projectionMatrix, (this.camera.fov * Math.PI) / 180, this.camera.aspect, this.camera.near, this.camera.far);
  }

  setCanvasSize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.gl.viewport(0, 0, width, height);
    this.camera.aspect = width / height;
    this.initMatrices();
  }

  addObject(object) {
    this.objects.push(object);
  }

  setCameraPosition(x, y, z) {
    this.camera.position = [x, y, z];
  }

  clear() {
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clearDepth(1.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

  render() {
    this.clear();

    // 카메라 뷰 행렬 설정
    mat4.identity(this.modelViewMatrix);
    mat4.lookAt(this.modelViewMatrix, this.camera.position, [0, 0, 0], [0, 1, 0]);

    this.gl.useProgram(this.programInfo.program);

    // 투영 행렬 설정
    this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.projectionMatrix, false, this.projectionMatrix);

    // modelViewMatrix를 각 오브젝트에서 접근할 수 있도록 저장
    this.gl.programInfo = {
      ...this.programInfo,
      modelViewMatrix: this.modelViewMatrix,
    };

    // 각 오브젝트 렌더링
    for (const obj of this.objects) {
      if (obj.render) {
        obj.render(this.gl, this.programInfo);
      }
    }
  }
}

// 3D 큐브 클래스 예제
class Cube {
  constructor(gl, x = 0, y = 0, z = 0) {
    this.gl = gl;
    this.position = [x, y, z];
    this.rotation = [0, 0, 0];
    this.scale = 0.1;
    this.initBuffers();
  }

  initBuffers() {
    const positions = [
      // 앞면
      -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
      // 뒷면
      -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,
    ];

    const colors = [
      1.0,
      0.0,
      0.0,
      1.0, // 빨강
      0.0,
      1.0,
      0.0,
      1.0, // 초록
      0.0,
      0.0,
      1.0,
      1.0, // 파랑
      1.0,
      1.0,
      0.0,
      1.0, // 노랑
      1.0,
      0.0,
      1.0,
      1.0, // 보라
      0.0,
      1.0,
      1.0,
      1.0, // 청록
      0.5,
      0.5,
      0.5,
      1.0, // 회색
      1.0,
      1.0,
      1.0,
      1.0, // 흰색
    ];

    const indices = [
      0,
      1,
      2,
      0,
      2,
      3, // 앞면
      4,
      5,
      6,
      4,
      6,
      7, // 뒷면
      0,
      4,
      7,
      0,
      7,
      1, // 윗면
      1,
      7,
      6,
      1,
      6,
      2, // 오른쪽
      2,
      6,
      5,
      2,
      5,
      3, // 윗면
      4,
      0,
      3,
      4,
      3,
      5, // 왼쪽
    ];

    this.buffers = {
      position: createBuffer(this.gl, positions),
      color: createBuffer(this.gl, colors),
      indices: createIndexBuffer(this.gl, indices),
    };

    this.bufferInfo = {
      vertexCount: indices.length,
    };
  }

  render(gl, programInfo) {
    // 월드 변환 행렬 생성
    const modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, this.position);
    mat4.rotateX(modelMatrix, modelMatrix, this.rotation[0]);
    mat4.rotateY(modelMatrix, modelMatrix, this.rotation[1]);
    mat4.rotateZ(modelMatrix, modelMatrix, this.rotation[2]);
    mat4.scale(modelMatrix, modelMatrix, [this.scale, this.scale, this.scale]);

    // 카메라의 modelViewMatrix와 현재 오브젝트의 modelMatrix를 결합
    const mvMatrix = mat4.create();
    mat4.multiply(mvMatrix, this.gl.programInfo.modelViewMatrix, modelMatrix);

    // 결합된 행렬을 셰이더에 전달
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, mvMatrix);

    // 버퍼 바인딩 및 렌더링
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.position);
    gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.color);
    gl.vertexAttribPointer(programInfo.attribLocations.vertexColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);
    gl.drawElements(gl.TRIANGLES, this.bufferInfo.vertexCount, gl.UNSIGNED_SHORT, 0);
  }
}

// 버퍼 생성 헬퍼 함수
function createBuffer(gl, data) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
  return buffer;
}

function createIndexBuffer(gl, data) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW);
  return buffer;
}

// 사용 예제:
/*
const engine = new RenderEngine('gameCanvas');
engine.setCanvasSize(800, 600);

const cube = new Cube(0, 0, 0);
engine.addObject(cube);

function gameLoop() {
    engine.render();
    requestAnimationFrame(gameLoop);
}

gameLoop();
*/

export { RenderEngine, Cube };
