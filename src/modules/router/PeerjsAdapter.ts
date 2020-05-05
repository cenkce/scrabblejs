import { IPeerClient } from "./IPeerClient";
import Peer from "peerjs";
import { PeerClientStatus } from "./PeerClientStatus";
import { Subject, fromEvent, Observable } from "rxjs";
import { PeerClientState } from "./PeerClientState";

export class PeerjsAdapter implements IPeerClient {
  private peer = new Peer({ debug: 2 });
  private peerId: string = "";
  private sink$ = new Subject<PeerClientState>();
  private handlers$ = new Subject();
  private connectedToPeer$ = fromEvent<string>({
    on: (event: string, cb) => {
      this.peer.on(event, cb as () => void);
    },
    off: (event: string, cb: Function) => {
      this.peer.off(event, cb);
    }
  }, "open");

  private peerConnected$ = fromEvent<string>({
    on: (event: string, cb) => {
      this.peer.on(event, cb as () => void);
    },
    off: (event: string, cb: Function) => {
      this.peer.off(event, cb);
    }
  }, "open");

  private state: PeerClientState = {
    status: PeerClientStatus.IDLE,
    peerCount: 0,
    peers: []
  };

  constructor(){
    this.peer.on("open", (id) => {
      this.peerId = id;
      this.changeState({status: PeerClientStatus.CONNECTED});
    });
  }

  private changeState(state: Partial<PeerClientState>){
    Object.assign(this.state, state);
  }

  sink(){
    return this.sink$.asObservable();
  }

  public connectPeer(id: string) {
    this.peer.connect(id);
    
  }
}