// import "reflect-metadata";
import { PeerEvent } from "../PeerSignal";
import { Observable } from "rxjs";
import { filter } from "rxjs/operators";

export function createListenerDecorator(stream$: Observable<PeerEvent>){
  return function Listen(eventName: string) {
    return function ListenDecorator(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<Function>) {
      const method = descriptor.value;
      method && method(stream$.pipe(filter((e) => e.payload.eventName === "eventName")));
    }
  }
}
