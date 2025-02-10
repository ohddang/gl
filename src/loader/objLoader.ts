import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import { Component } from 'react';

interface ObjLoaderProps {
  url: string;
}

export class ObjLoaderComponent extends Component<ObjLoaderProps> {
  private loader = new OBJLoader();

  componentDidMount() {
    this.loadObject();
  }

  loadObject() {
    const { url } = this.props;

    this.loader.load(url, (object: any) => {
      // GLTFExporter로 변환
      const exporter = new GLTFExporter();
      exporter.parse(
        object,
        (result: any) => {
          const output = JSON.stringify(result);
          console.log(output);

          const blob = new Blob([output], { type: "application/json" });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = "model.gltf";
          link.click();
        },
        {
          binary: false,
          embedImages: true,
          includeCustomExtensions: true
        }
      );
    });
  }

  draw() {
    return null; // 실제 DOM 렌더링은 필요 없음
  }
}
