import React, { Component } from 'react';
import { Engine, EngineOptions } from '../core/Engine';
import { Cube, CubeProps } from '../geometries/Cube';
import { Cone, ConeProps } from '../geometries/Cone';
import { Sphere, SphereProps } from '../geometries/Sphere';
type MeshProps = CubeProps | ConeProps | SphereProps;

interface EngineComponentProps extends EngineOptions {
    width: number;
    height: number;
    children: React.ReactNode;
    style?: React.CSSProperties;
}

export class EngineComponent extends Component<EngineComponentProps> {
  engine: Engine | null = null;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;  

  constructor(props: EngineComponentProps) {
    super(props);
    this.canvasRef = React.createRef<HTMLCanvasElement>();
  }

  componentDidMount() {
    if (this.canvasRef.current) {
      this.engine = new Engine({ width: this.props.width, height: this.props.height, canvasRef: this.canvasRef });

      // 렌더링 시작
      this.setupScene();
      this.animate();
    }
  }

  componentWillUnmount() {
    // cleanup 필요한 경우 추가
  }

  private createObject3D(props: MeshProps) {
    if (!this.engine) return null;

    const gl = this.engine.getContext();
    if (!gl) return null;

    switch (props.type) {
        case 'Cube':
            return new Cube({...props, gl});
        case 'Sphere':
            return new Sphere({...props, gl});
        case 'Cone':
            return new Cone({...props, gl});
        default:
            break;
    }
  }

  private setupScene() {
    if (this.engine) {
        this.engine.camera.setTarget(-3, 3, 0);
        this.engine.camera.setPosition(0, 1, -10);
    }

    React.Children.forEach(this.props.children, (child) => {
        if (React.isValidElement(child)) {
            const object3D = this.createObject3D(child.props as MeshProps);
            if (object3D) {
                this.engine?.addObject(object3D);
            }
        }
    });
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