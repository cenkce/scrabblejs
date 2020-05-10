import { PeerRequestMethod } from "./PeerRequestMethod";
import { match, MatchFunction } from "path-to-regexp";
import { PeerContext } from "./PeerContext";
import { PeerRequest } from "./PeerSignal";

export type PeerRequestHandler = (ctx: PeerContext, next: () => void) => void;

function handlersCharger(
  handlersCall: (() => PeerRequestHandler)[] = []
): [
  () => Generator<undefined, void, PeerRequestHandler>,
  () => Generator<() => PeerRequestHandler, void, unknown>
] {
  const handlersMap: WeakMap<{}, PeerRequestHandler> = new WeakMap();
  let size = 0;
  
  const write = function* () {
    let handler: PeerRequestHandler;
    while ((handler = yield)) {
      const key = {};
      handlersMap.set(key, handler);

      handlersCall.push(() => {
        return handlersMap.get(key) as PeerRequestHandler;
      });
      size++;
    }
  };

  const read = function* () {
      // let callers: PeerRequestHandler[] = handlersCall.slice();
      let i = 0;
      while (i++ < size) {
        yield handlersCall[i];
      }
    };
  return [write, read];
}

export class PeerRouteMethod {
  private _match: MatchFunction<any>;
  private addHandler: Generator<undefined, void, PeerRequestHandler>;
  private handlersIterator: () => Generator<() => PeerRequestHandler, void, unknown>;

  constructor(
    private rootPath: string,
    private method: PeerRequestMethod = "GET",
    [addHandler, iterateHandlers] = handlersCharger()
  ) {
    this._match = match(this.rootPath);
    this.addHandler = addHandler();
    this.handlersIterator = iterateHandlers;
  }

  handle(path: string, fn: PeerRequestHandler){
    this.addHandler.next(fn);
  }

  match(request: PeerRequest) {
    if (request.payload.method === this.method && this._match(request.payload.path)) {
      return this.handlersIterator();
    }

    return false;
  }
}
