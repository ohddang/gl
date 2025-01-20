// import { Cube, Engine } from "garo";
import { Engine } from "../src/core/Engine";
import { Cube } from "../src/objects/Cube";

const canvas = document.getElementById("canvas");

const engine = new Engine({ canvas, width: 400, height: 300 });
engine.setCanvasSize(400, 300);

const cube = new Cube(engine.getContext(), 0, 0, -1);

engine.addObject(cube);

engine.render();
