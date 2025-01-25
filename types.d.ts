declare module "three/examples/jsm/loaders/OBJLoader" {
  import { Loader } from "three";
  export class OBJLoader extends Loader {
    load(url: string, onLoad: (object: any) => void, onProgress?: (event: ProgressEvent) => void, onError?: (event: ErrorEvent) => void): void;
  }
}

declare module "three/examples/jsm/exporters/GLTFExporter" {
  export class GLTFExporter {
    parse(input: any, onParse: (result: any) => void, options?: any): void;
  }
}
