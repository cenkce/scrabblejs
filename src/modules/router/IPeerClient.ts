import { Observable } from "rxjs/internal/Observable";
import { PeerEvent, PeerRequest } from "./PeerSignal";

export interface IPeerClient {
  connectPeer(id: string):void;
  sink(): {
    events$: Observable<PeerEvent>,
    requests$: Observable<PeerRequest>
  }
}
