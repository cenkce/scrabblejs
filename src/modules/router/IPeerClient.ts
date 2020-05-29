import { Observable } from "rxjs/internal/Observable";
import { PeerEvent, PeerRequest } from "./PeerSignal";
import { PeerClientState } from "./PeerClientState";

export interface IPeerClient {
  sink(): {
    events$: Observable<PeerEvent>,
    requests$: Observable<PeerRequest>,
    open$: Observable<any>,
    changeState$: Observable<PeerClientState>
  };
  connect: (id:string) => (() => void) | undefined;
  emit(req: PeerRequest): void;
}
