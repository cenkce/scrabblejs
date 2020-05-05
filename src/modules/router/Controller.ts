import { PeerRouter } from "./PeerRouter"

export function Controller(rootPath: string){
  return function ClassDecorator<T extends {new(...args:any[]):{}}>(constructor:T) {
    return class extends constructor {
        private router: PeerRouter = new PeerRouter(rootPath);
    }
  }
}