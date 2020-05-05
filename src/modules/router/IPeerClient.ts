import { PeerClientState } from "./PeerClientState";
import { Observable } from "rxjs/internal/Observable";

export interface IPeerClient {
  connectPeer(id: string):void;
  sink(): Observable<PeerClientState>
}
