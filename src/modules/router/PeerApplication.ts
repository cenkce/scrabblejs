import { IPeerClient } from "./IPeerClient";
import { controllerFactory } from "./decorator/createControllerDecorator";
import { createListenerDecorator } from "./decorator/createListenerDecorator";
import { PeerRequest } from "./PeerSignal";
import { Subject, OperatorFunction, Observable, of, BehaviorSubject } from "rxjs";
import { PeerRouteMethod } from "./PeerRouterMethod";
import { scan, mergeAll } from "rxjs/operators";
import { pipeFromArray } from "rxjs/internal/util/pipe";
import { PeerResponse } from "./PeerResponse";

/**
 * Event listener test
 * Network'te client state dinle ve ona gore ui guncelle
 * Tum bagli peerlara event emit
 * Request master varsa kabul et
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
  const controllersSink = controllers$.pipe(scan<Observable<PeerResponse>, Observable<PeerResponse>[]>((acc, curr) => {
    acc.push(curr)
    return acc;
  }, []), mergeAll());

  controllersSink.subscribe((val) => {
    console.log(val);
  })
  const Controller = controllerFactory(sink.requests$);

  return [{
      sink(){
        return {
          ...sink,
          request$: controllersSink
        }
      },
      emit(request: PeerRequest) {
        debugger;
        client.emit(request);
      },
      connect: (id: string) => client.connect(id),
    } as IPeerClient,
    (rootPath: string,) => {
      const ControllerOperator = Controller(rootPath);
      return (...args: OperatorFunction<PeerRouteMethod[], PeerRouteMethod[]>[]) => {
        const routes$ = pipeFromArray(args)(of([])).pipe(ControllerOperator)
        controllers$.next(routes$);
        return routes$;
      };
    },
    createListenerDecorator(sink.events$),
  ] as const;
}
