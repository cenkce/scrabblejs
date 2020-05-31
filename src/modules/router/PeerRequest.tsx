import { PeerRequestMethod } from "./PeerRequestMethod";
import { JSONValue } from "./JSONElement";
import { PeerSignalType } from "./PeerSignal";
export type PeerRequest<TBody = any> = {
  type: PeerSignalType.REQUEST;
  payload: {
    path: string;
    body: TBody;
    method: PeerRequestMethod;
    targetPeerId: string;
    params?: JSONValue;
    query?: JSONValue;
  };
};
