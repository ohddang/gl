import { RenderEngine, Cube } from "../src/index.js";

const engine = new RenderEngine("gameCanvas");
engine.setCanvasSize(800, 600);

engine.setCameraPosition(2, 2, -5);

const cube = new Cube(engine.gl, 0, 0, 0);
cube.rotation = [Math.PI / 4, Math.PI / 4, 0];
engine.addObject(cube);

let rotation = Math.PI / 4;
let cameraPosition = 5;

function rotateCube() {
  rotation += Math.PI / 4;
  cube.rotation = [Math.PI / 4, rotation, 0];
}

function changeCameraPosition() {
  cameraPosition = cameraPosition === -2 ? -4 : -2;
  engine.setCameraPosition(1, 1, cameraPosition);
}

function gameLoop() {
  engine.render();
  requestAnimationFrame(gameLoop);
}

gameLoop();

window.rotateCube = rotateCube;
window.changeCameraPosition = changeCameraPosition;
