import React, { Component } from "react";
import { Engine, EngineOptions } from "../../core/Engine";
import { Cube, Cone, Sphere, MeshType } from "../geometries";
import { RootState } from "../../store";
import { useDispatch, useSelector, connect, ConnectedProps } from "react-redux";
import { objectSlice } from "../../store/slice/objectSlice";

// mapState와 mapDispatch 정의
const mapStateToProps = (state: RootState) => ({
  objects: state.object
});

const mapDispatchToProps = {
  increment: objectSlice.actions.increment,
};

// connector 생성
const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends EngineOptions, PropsFromRedux {
  width: number;
  height: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

class CanvasComponent extends Component<Props> {
  engine: Engine | null = null;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;

  dispatch = useDispatch();
  state = useSelector((state: RootState) => state.object);

  constructor(props: Props) {
    super(props);
    this.canvasRef = React.createRef<HTMLCanvasElement>();
  }

  componentDidMount() {
    if (this.canvasRef.current) {
      this.engine = new Engine({ width: this.props.width, height: this.props.height, canvasRef: this.canvasRef });
      this.engine.renderer.setCanvasSize(this.canvasRef.current, this.engine.camera, this.props.width, this.props.height);

      // 렌더링 시작
      this.setupScene();
      this.animate();
    }
  }

  componentWillUnmount() {
    // cleanup 필요한 경우 추가
  }

  private setupScene() {
    if (this.engine) {
      this.engine.camera.setTarget(0, 0, 0);
      this.engine.camera.aspect = 1920 / 1080;
      this.engine.camera.near = 0.1;
      this.engine.camera.far = 100;
      this.engine.camera.setPosition(0, 2, -10);
    }

    React.Children.forEach(this.props.children, (child) => {
      if (React.isValidElement(child)) {
        const object3D = this.createObject3D(child.props as MeshType);
        if (object3D) {
          this.engine?.addObject(object3D);
        }
      }
    });
  }

  private createObject3D(props: MeshType) {
    if (!this.engine) return null;

    const gl = this.engine.getContext();
    if (!gl) return null;

    switch (props.type) {
      case "Cube":
        return new Cube({ ...props, gl });
      case "Sphere":
        return new Sphere({ ...props, gl });
      case "Cone":
        return new Cone({ ...props, gl });
      default:
        break;
    }
  }

  animate = () => {
    if (this.engine) {
      this.engine.render();
      requestAnimationFrame(this.animate);
    }
  };

  // Engine 인스턴스에 접근하기 위한 메서드
  getEngine() {
    return this.engine;
  }

  render() {
    return <canvas ref={this.canvasRef} />;
  }
}

export const Canvas = connector(CanvasComponent);