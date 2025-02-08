import { Engine } from "../src/core/Engine";
import { Cube } from "../src/geometries/Cube";
import { Sphere } from "../src/geometries/Sphere";
import { Cone } from "../src/geometries/Cone";
import { objLoad } from "../src/loaders/OBJLoader";
const canvas = document.getElementById("canvas");

const engine = new Engine({ canvas, width: 1920, height: 1080 });

const cube = new Cube(engine.useEngine().renderer.getContext(), 0, 0, -1);
const sphere = new Sphere(engine.useEngine().renderer.getContext(), 1, 0, -1);
const cone = new Cone(engine.useEngine().renderer.getContext(), -1, 0, -1);

engine.addObject(cube);
engine.addObject(sphere);
engine.addObject(cone);
engine.useEngine().renderer.setClearColor(0.5, 0.5, 0.5, 1);

engine.useEngine().camera.setTarget(0, 0, 0);
engine.useEngine().camera.setPosition(0.5, 1, -3);

engine.render();

objLoad();
