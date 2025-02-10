import React from 'react';
import { createRoot } from 'react-dom/client';
import { EngineComponent } from '../src/components/EngineComponent';
import { Cube } from '../src/geometries/Cube';
import { Cone } from '../src/geometries/Cone';
import { Sphere } from '../src/geometries/Sphere';

const TestApp = () => {
  return (
    <div>
      <h1>3D Renderer Test</h1>
      <EngineComponent width={1920} height={1080}>
        <Cube type="Cube" position={[-2, 0, -1]} rotation={[0, 0, 0]} scale={[1, 1, 1]} />
        
        {/* 두 객체가 같은 x 좌표(1)에 있어서 겹칠 수 있음 */}
        <Sphere type="Sphere" position={[0, 0, -1]} rotation={[0, 0, 0]} scale={[1, 1, 1]} radius={1} segments={32} />
        <Cone type="Cone" position={[2, 0, -1]} rotation={[0, 0, 0]} scale={[1, 1, 1]} radius={1} height={1} segments={32} />
      </EngineComponent>
    </div>
  );
};

// React 18의 createRoot API 사용
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<TestApp />);
} 