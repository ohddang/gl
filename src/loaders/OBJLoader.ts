import { OBJLoader as Loader } from "three/examples/jsm/loaders/OBJLoader";

const loader = new Loader();

export const objLoad = () => {
  loader.load("/tree.obj", (object: any) => {
    console.log("tree", object);
  });
};

export class OBJLoader {
  #loader: Loader;
  #progress: number;

  constructor() {
    this.#loader = new Loader();
    this.#progress = 0;
  }

  load(url: string, onLoad: (data: any) => void, onProgress?: (progress: number) => void) {
    this.#loader.load(
      url,
      (object: any) => {
        onLoad(object);
      },
      (e: ProgressEvent) => this.handleProgress(e, onProgress ?? (() => {}))
    );
  }

  handleProgress(e: ProgressEvent, callback: (progress: number) => void) {
    this.#progress = e.loaded / e.total;
    callback(this.#progress);
  }

  getProgress() {
    return this.#progress;
  }
}
