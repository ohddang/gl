// import { Cube, Engine } from "garo";
import { Engine } from "../src/core/Engine";
import { Cube } from "../src/objects/Cube";
import { Sphere } from "../src/objects/Sphere";
import { Cone } from "../src/objects/Cone";

const canvas = document.getElementById("canvas");

const engine = new Engine({ canvas, width: 400, height: 300 });
engine.setCanvasSize(400, 300);

const cube = new Cube(engine.getContext(), 0, 0, -1);
const sphere = new Sphere(engine.getContext(), 1, 0, -1);
const cone = new Cone(engine.getContext(), -1, 0, -1);

engine.addObject(cube);
engine.addObject(sphere);
engine.addObject(cone);
engine.setClearColor(0.5, 0.5, 0.5, 1);

engine.camera.setTarget(0, 0, 0);
engine.camera.setPosition(0.5, 1, -3);

engine.render();
