import { Group } from "three";
import { OBJLoader as Loader } from "three/examples/jsm/loaders/OBJLoader";

export class OBJLoader {
  #loader: Loader;
  #progress: number;

  constructor() {
    this.#loader = new Loader();
    this.#progress = 0;
  }

  load(url: string, onLoad: (data: Group) => void, onProgress?: (progress: number) => void) {
    this.#loader.load(
      url,
      (object: Group) => {
        onLoad(object);
      },
      (e: ProgressEvent) => this.handleProgress(e, onProgress ?? (() => {}))
    );
  }

  handleProgress(e: ProgressEvent, callback: (progress: number) => void) {
    this.#progress = (e.loaded / e.total) * 100;
    callback(this.#progress);
  }

  getProgress() {
    return this.#progress;
  }
}
