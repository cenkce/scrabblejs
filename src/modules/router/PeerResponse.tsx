import { JSONElement, JSONValue } from "./JSONElement";

export type PeerResponse = {
  ok: boolean;
  status: number;
  statusText: string;
  payload: {[key: string]: JSONValue | JSONElement };
};
