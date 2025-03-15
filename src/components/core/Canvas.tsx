import * as React from "react";
import { Component, createRef } from "react";
import { Engine } from "../../core/Engine";
import { Cube, Sphere, Cone, Primitive, MeshType } from "../geometries";

interface Props {
  width: number;
  height: number;
  children?: React.ReactNode;
  forwardedRef?: React.RefObject<CanvasRef>;
}

export interface CanvasRef {
  getEngine: () => Engine | null;
}

// 내부 클래스 컴포넌트
class CanvasClass extends Component<Props> {
  private engineRef: Engine | null = null;
  private canvasRef = createRef<HTMLCanvasElement>();

  componentDidMount() {
    if (this.canvasRef.current) {
      this.engineRef = new Engine({
        width: this.props.width,
        height: this.props.height,
        canvasRef: this.canvasRef,
      });

      this.engineRef.renderer.setCanvasSize(this.canvasRef.current, this.engineRef.camera, this.props.width, this.props.height);

      this.setupScene();
      this.animate();

      // forwardedRef를 통해 메서드 노출
      if (this.props.forwardedRef) {
        (this.props.forwardedRef as any).current = {
          getEngine: this.getEngine,
        };
      }
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.width !== this.props.width || prevProps.height !== this.props.height) {
      if (this.canvasRef.current && this.engineRef) {
        this.engineRef.renderer.setCanvasSize(this.canvasRef.current, this.engineRef.camera, this.props.width, this.props.height);
      }
    }
  }

  componentWillUnmount() {
    // cleanup 로직
    this.engineRef = null;
  }

  setupScene = () => {
    if (!this.engineRef || !this.canvasRef.current) return;

    this.engineRef.camera.setTarget(0, 0, 0);
    this.engineRef.camera.aspect = 1920 / 1080;
    this.engineRef.camera.near = 0.1;
    this.engineRef.camera.far = 100;
    this.engineRef.camera.setPosition(0, 2, -10);

    React.Children.forEach(this.props.children, (child) => {
      if (React.isValidElement(child)) {
        const object3D = this.createObject3D(child.props as MeshType);
        if (object3D) {
          this.engineRef?.addObject(object3D);
        }
      }
    });
  };

  createObject3D = (props: MeshType) => {
    if (!this.engineRef) return null;

    const gl = this.engineRef.getContext();
    if (!gl) return null;

    switch (props.type) {
      case "Cube":
        return new Cube({ ...props, gl });
      case "Sphere":
        return new Sphere({ ...props, gl });
      case "Cone":
        return new Cone({ ...props, gl });
      case "Primitive":
        return new Primitive({ ...props, gl });
      default:
        return null;
    }
  };

  animate = () => {
    if (this.engineRef) {
      this.engineRef.render();
      requestAnimationFrame(this.animate);
    }
  };

  getEngine = () => {
    return this.engineRef;
  };

  render() {
    return <canvas ref={this.canvasRef} />;
  }
}

// forwardRef 래퍼 함수
export const Canvas = React.forwardRef<CanvasRef, Omit<Props, "forwardedRef">>((props, ref) => {
  return <CanvasClass {...props} forwardedRef={ref as React.RefObject<CanvasRef>} />;
});

Canvas.displayName = "Canvas";
