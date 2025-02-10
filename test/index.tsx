import React from 'react';
import { createRoot } from 'react-dom/client';
import { EngineComponent } from '../src/components/EngineComponent';
import { Cube } from '../src/objects/Cube';
import { Cone } from '../src/objects/Cone';
import { Sphere } from '../src/objects/Sphere';

const TestApp = () => {
  return (
    <div>
      <h1>3D Renderer Test</h1>
      <EngineComponent width={500} height={500}>
        {/* Cube 추가 */}
        <Cube type="Cube" position={[0, 0, -1]} rotation={[0, 0, 0]} scale={[1, 1, 1]} />
        
        {/* Sphere 추가 */}
        <Sphere type="Sphere" position={[-2, 0, -1]} rotation={[0, 0, 0]} scale={[1, 1, 1]} />
        
        {/* Cone 추가 */}
        <Cone type="Cone" position={[2, 0, -1]} rotation={[0, 0, 0]} scale={[1, 1, 1]} />
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