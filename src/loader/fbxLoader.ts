import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";

// 로드할 파일 유형에 따라 로더 선택
const loader = new OBJLoader(); // FBX 로더 사용 (OBJ의 경우 OBJLoader 사용)

export const objLoad = () => {
  loader.load("/tree.obj", (object: any) => {
    // GLTFExporter로 변환
    const exporter = new GLTFExporter();
    exporter.parse(
      object,
      (result: any) => {
        const output = JSON.stringify(result);
        console.log(output); // 변환된 GLTF 데이터를 출력

        // 다운로드 기능 추가
        const blob = new Blob([output], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "model.gltf";
        link.click();
      },
      { binary: false } // GLTF(JSON) 형식으로 내보냄 (true로 설정 시 GLB 형식)
    );
  });
};
