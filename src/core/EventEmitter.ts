type EventCallback = (data: any) => void;

export class EventEmitter {
  private events: { [key: string]: EventCallback[] };

  constructor() {
    this.events = {};
  }

  public on(event: string, callback: EventCallback): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  public emit(event: string, data: any): void {
    if (this.events[event]) {
      this.events[event].forEach((callback) => callback(data));
    }
  }
}
