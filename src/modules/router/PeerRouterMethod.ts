import { PeerRequestMethod } from "./PeerRequestMethod";
import { match, MatchFunction, Match } from "path-to-regexp";
import { PeerRequest } from "./PeerRequest";
import { PeerResponse } from "./PeerResponse";

export type PeerRequestHandler<TBody = any> = (
  request: PeerRequest<TBody>,
  resp: PeerResponse,
  next: () => void
) => unknown;

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
  private _match: MatchFunction<any>[];

  constructor(
    private rootPath: string | string[],
    private handler: PeerRequestHandler,
    private method: PeerRequestMethod = "GET"
  ) {
    this._match = Array.isArray(this.rootPath)
      ? this.rootPath.map((path) => match(path, { end: true }))
      : [match(this.rootPath)];
  }

  handle: PeerRequestHandler = (req, res, next) => {
    return this.handler(req, res, next);
  };

  match<T extends object=any>(request: PeerRequest): Match<T> {
    let res: Match<T> = false;
    this._match.some((match) => (res = match(request.payload.path)));

    return res;
  }
}
