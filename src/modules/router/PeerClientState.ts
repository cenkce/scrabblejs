import { PeerClientStatus } from "./PeerClientStatus";
export type PeerClientState = {
  status: PeerClientStatus;
  peerCount: number;
  peers: any[];
};
