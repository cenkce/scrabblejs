export function createListenDecorator(register: (eventName: string, cb: Function) => void){
  return function Listen(rootPath: string): MethodDecorator {
    return function MethodDecorator(target, propertyKey, descriptor) {
    }
  }
}
