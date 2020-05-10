import { PeerResponse } from "./PeerResponse";
import { PeerRequest } from "./PeerSignal";
import { PeerRouteMethod } from "./PeerRouterMethod";

type RouteCallback = (request: PeerRequest) => PeerResponse;
type RouterMethod =
  | ((cb: RouteCallback) => PeerRouter)
  | ((path: string, cb: RouteCallback) => PeerRouter);

export class PeerRouter {
  private routes: PeerRouteMethod[] = [];

  constructor(private rootPath: string) {}

  get(path: string) {
    this.routes.push(new PeerRouteMethod(this.rootPath+path, "GET"));

    return this;
  }

  post(path: string) {
    this.routes.push(new PeerRouteMethod(this.rootPath+path, "POST"));
    return this;
  }

  patch(path: string) {
    this.routes.push(new PeerRouteMethod(this.rootPath+path, "PATCH"));
    return this;
  }

  delete(path: string) {
    this.routes.push(new PeerRouteMethod(this.rootPath+path, "DELETE"));
    return this;
  }

  resolve(request: PeerRequest) {
    const route = this.routes.find(route => route.match(request));

    return route;
  }
}
