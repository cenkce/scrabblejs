import { IPeerClient } from "./IPeerClient";
import {
  controllerFactory,
} from "./decorator/createControllerDecorator";
import { createListenerDecorator } from "./decorator/createListenerDecorator";
import { share } from "rxjs/operators";
/**
 * Returns Controller and EventListener decorators
 *
 * @param client
 */
export function PeerApplication(client: IPeerClient) {
  const sink = client.sink();
  const Controller = controllerFactory(sink.requests$.pipe(share()));
  return [Controller, createListenerDecorator(sink.events$)] as const;
}
