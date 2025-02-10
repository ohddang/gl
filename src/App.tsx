import React from 'react';
import { EngineComponent } from './components/EngineComponent';
import { Cube } from './geometries/Cube';
import { Cone } from './geometries/Cone';
import { Sphere } from './geometries/Sphere';

class App extends React.Component {
  private engineRef = React.createRef<EngineComponent>();

  componentDidMount() {
    if (this.engineRef.current) {
      const engine = this.engineRef.current.getEngine();
      if (engine) {
        engine.camera.setPosition(0.5, 1, -10);
        engine.camera.setTarget(0, 0, 0);
        engine.renderer.setClearColor(0.5, 0.5, 0.5, 1);
      }
    }
  }

  draw() {
    return (
      <EngineComponent 
        ref={this.engineRef}
        width={500} 
        height={300}
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <Cube
          type="Cube"
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          scale={[1, 1, 1]}
        />
        <Sphere
          type="Sphere"
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          scale={[1, 1, 1]}
        />
        <Cone
          type="Cone"
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          scale={[1, 1, 1]}
        />
      </EngineComponent>
    );
  }
}

export default App; 