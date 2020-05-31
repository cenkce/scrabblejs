import { IPeerClient } from "./IPeerClient";
import { controllerFactory } from "./createControllerFactory";
import { createListenerDecorator } from "./decorator/createListenerDecorator";
import { PeerRequest } from "./PeerRequest";
import { OperatorFunction, Observable, of, Subject } from "rxjs";
import { PeerRouteMethod } from "./PeerRouterMethod";
import { switchMap } from "rxjs/operators";
import { pipeFromArray } from "rxjs/internal/util/pipe";
import { PeerResponse } from "./PeerResponse";

/**
 * Event listener test
 * Network'te client state dinle ve ona gore ui guncelle
 * Tum bagli peerlara event emit
 * Response'u client'a gonder
 * 
 * Controller request path match
 * 
 * Returns Controller and EventListener decorators
 *
 * @param client
 * Application();
 * Controller("user").pipe(Post());
 */
export function PeerApplication(client: IPeerClient) {
  const sink = client.sink();
  const controllers$ = new Subject<Observable<PeerResponse>>();
  let controllersSink = controllers$.pipe(switchMap((routes) => {
    return routes;
  }));

  controllersSink.subscribe((val) => {
    console.log("controllersSink : ", val);
  })
  const Controller = controllerFactory(sink.requests$);
  let routes:OperatorFunction<PeerRouteMethod[], PeerRouteMethod[]>[] = [];

  return [{
      sink(){
        return {
          ...sink,
          request$: controllersSink
        }
      },
      emit: (req: PeerRequest) => client.emit(req),
      connect: (id: string) => client.connect(id),
      createEvent: (payload) => client.createEvent(payload),
      createRequest: (payload) => client.createRequest(payload),
    } as IPeerClient,
    // Controller factory
    () => {
      const ControllerOperator = Controller();
      return (...args: OperatorFunction<PeerRouteMethod[], PeerRouteMethod[]>[]) => {
        routes = routes.concat(args);
        const routes$ = pipeFromArray(routes)(of([])).pipe(ControllerOperator)
        controllers$.next(routes$);
        return controllers$.asObservable();
      };
    },
    createListenerDecorator(sink.events$),
  ] as const;
}
