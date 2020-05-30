import { NetworkStatus } from "./NetworkStatus";
export type PeerClientState = {
  peerStatus: NetworkStatus;
  networkStatus: NetworkStatus;
  peerCount: number;
  peers: any[];
  peerId: string;
};

export function createInitialPeerClientState(){
  return {
    peerStatus: NetworkStatus.IDLE,
    networkStatus: NetworkStatus.IDLE,
    peerCount: 0,
    peers: [],
    peerId: ""
  }
}