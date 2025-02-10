import { Component } from 'react';

interface Object3DComponentProps {
}

export class Object3DComponent extends Component<Object3DComponentProps> {
  componentDidMount() {}

  draw() {
    return null; // 실제 DOM 렌더링은 필요 없음
  }
}

export class Cone extends Object3DComponent {
  constructor(props: Object3DComponentProps) {
    super(props);
  }
}

export class Sphere extends Object3DComponent {
  constructor(props: Object3DComponentProps) {
    super(props);
  }
}

export class Cube extends Object3DComponent {
  constructor(props: Object3DComponentProps) {
    super(props);
  } 
}
