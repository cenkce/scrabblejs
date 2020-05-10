import { IPeerClient } from "./IPeerClient";
import { createControllerDecorator } from "./decorator/createControllerDecorator";
export function PeerApplication(client: IPeerClient) {
  const controllersRegistery: {[key: string]: Object} = {};
  const register = (path: string, controller: Object) => {
    controllersRegistery[path] = controller;
  }
  const sink = client.sink();
  return [createControllerDecorator(register)];
}
