type Fn<T> = (data: T) => void;
type EventTypes<T> = { [K in keyof T]: Fn<T[K]>[] | undefined };

export default abstract class Observer<T> {
  private observers: EventTypes<T> = {} as EventTypes<T>;

  public on<K extends keyof T>(eventType: K, fn: Fn<T[K]>) {
    if (!this.observers[eventType]) {
      this.observers[eventType] = [];
    }

    this.observers[eventType]?.push(fn);
  }

  public off<K extends keyof T>(eventType: K, fn: Fn<T[K]>) {
    this.observers[eventType] = this.observers[eventType]?.filter(
      (subscriber) => subscriber !== fn
    );
  }

  protected dispatch<K extends keyof T>(eventType: K, data: T[K]) {
    this.observers[eventType]?.forEach((fn) => fn(data));
  }

  protected removeObservers<K extends keyof T>(...eventTypes: K[]) {
    eventTypes.forEach((eventType) => {
      this.observers[eventType] = [];
    });
  }
}
