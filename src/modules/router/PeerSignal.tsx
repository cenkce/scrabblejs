import { PeerRequestMethod } from "./PeerRequestMethod";

export enum PeerSignalType {
  "REQUEST" = "REQUEST",
  "EVENT" = "EVENT",
}

export function instacenOfPeerRequest(data: any): data is PeerRequest {
  if (data.type && data.type === PeerSignalType.REQUEST) {
    return true;
  }

  return false;
}

export function instacenOfPeerEvent(data: any): data is PeerRequest {
  if (data.type && data.type === PeerSignalType.EVENT) {
    return true;
  }

  return false;
}

export type PeerEvent<TBody = any> = {
  type: PeerSignalType.EVENT;
  payload: { eventName: string; body: TBody; targetPeerId: string };
};

export type PeerRequest<TBody = any> = {
  type: PeerSignalType.REQUEST;
  payload: { path: string; body: TBody; method: PeerRequestMethod };
};

export type PeerSignal = PeerEvent | PeerRequest;
