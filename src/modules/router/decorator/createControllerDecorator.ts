import { PeerRequest } from "../PeerSignal";
import { Observable, OperatorFunction, of } from "rxjs";
import { filter, scan, switchMap, map, concatMap } from "rxjs/operators";
import { PeerRouteMethod } from "../PeerRouterMethod";
import { pipeFromArray } from "rxjs/internal/util/pipe";

export function controllerFactory(request$: Observable<PeerRequest>) {
  return function Controller(
    rootPath: string
  ): {
    pipe: (
      ...args: OperatorFunction<PeerRouteMethod[], PeerRouteMethod[]>[]
    ) => Observable<unknown[]>;
  } {
    const routes$ = of<PeerRouteMethod[]>([]);

    return {
      pipe(...args) {
        return pipeFromArray(args)(routes$).pipe(
          switchMap((routes) => {
            return request$.pipe(
              map(
                (request) =>
                  [
                    request,
                    routes.filter((route) => route.match(request)),
                  ] as const
              ),
              filter(([request, routes]) => {
                return !!routes.length;
              }),
              concatMap(([request, routes]) => {
                return Promise.all(
                  routes.map((route) => route.handle(request))
                );
              })
            );
          })
        );
      },
    };
  };
}

type PeerRequestHandler<TRequest> = (request: PeerRequest<TRequest>, next: (value?: unknown) => void ) => void;

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
