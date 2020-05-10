import { PeerRouter } from "../PeerRouter"

export function createControllerDecorator(register: (path: string, controller: Object) => void){
  return function Controller(rootPath: string){
    return function ClassDecorator<T extends {new(...args:any[]):{}}>(constructor:T) {
      const Controller = class extends constructor {
          private router: PeerRouter = new PeerRouter(rootPath);
      }

      register(rootPath, Controller);
    }
  }
}

