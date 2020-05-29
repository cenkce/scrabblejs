import { PeerRequest } from "../PeerSignal";
import { Observable, OperatorFunction, of, from, empty } from "rxjs";
import {
  switchMap,
  map,
  mergeScan,
  mergeMap,
} from "rxjs/operators";
import { PeerRouteMethod, PeerRequestHandler } from "../PeerRouterMethod";
import { PeerResponse } from "../PeerResponse";

export function controllerFactory(request$: Observable<PeerRequest>) {
  return function Controller(
    rootPath: string
  ): OperatorFunction<PeerRouteMethod[], PeerResponse> {
    const operator = switchMap<PeerRouteMethod[], Observable<PeerResponse>>((routes) => {
      return request$.pipe(
        mergeMap((request) => {
          let hasNext = true;
          const response: PeerResponse = {ok: true, status: 200, statusText: "", payload: {}};
          const iterator = (function* getRoute(){
            for(let route of routes){
              if(route.match(request)){
                hasNext = false;
                yield route.handle(request, response, () => {hasNext = true});
              }
            }
          })();

          return from(iterator).pipe(
            mergeScan(
              (response, current) => {
                console.log(response, current);
                if(!hasNext){
                  iterator.return();
                }
                if(!!current &&  typeof current === "object" && current !== null && !Array.isArray(current)){
                  Object.assign(response.payload, current);
                }

                return of(response);
              },
              response,
              1
            )
          );
        })
      );
    });

    return operator;
  };
}


export function Post<TRequest = unknown>(
  path: string,
  handler: PeerRequestHandler<TRequest>
) {
  return map<PeerRouteMethod[], PeerRouteMethod[]>((acc, index) => {
    acc.push(new PeerRouteMethod(path, handler, "POST"));

    return acc;
  });
}

export function Get<TRequest = unknown>(
  path: string,
  handler: PeerRequestHandler<TRequest>
) {
  return map<PeerRouteMethod[], PeerRouteMethod[]>((acc, index) => {
    acc.push(new PeerRouteMethod(path, handler, "GET"));

    return acc;
  });
}

export function Delete<TRequest = unknown>(
  path: string,
  handler: PeerRequestHandler<TRequest>
) {
  return map<PeerRouteMethod[], PeerRouteMethod[]>((acc, index) => {
    acc.push(new PeerRouteMethod(path, handler, "DELETE"));

    return acc;
  });
}

export function Patch<TRequest = unknown>(
  path: string,
  handler: PeerRequestHandler<TRequest>
) {
  return map<PeerRouteMethod[], PeerRouteMethod[]>((acc, index) => {
    acc.push(new PeerRouteMethod(path, handler, "PATCH"));

    return acc;
  });
}
