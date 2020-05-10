import { IPeerClient } from "./IPeerClient";
import Peer, { DataConnection } from "peerjs";
import { PeerClientStatus } from "./PeerClientStatus";
import { Subject, fromEvent, Observable, BehaviorSubject, of } from "rxjs";
import { PeerClientState } from "./PeerClientState";
import { scan, map, mergeMap, filter } from "rxjs/operators";
import { PeerEvent, PeerSignalType, instacenOfPeerEvent, PeerRequest, instacenOfPeerRequest } from "./PeerSignal";

interface IStreamable<T = any> {
  sink(): Observable<T>;
}

interface IPeerConnection<T = any> extends IStreamable<T> {}

type IPeerConnectionState = {
  status: PeerClientStatus;
};

class PeerjsConnection implements IPeerConnection {
  private state$ = new BehaviorSubject<IPeerConnectionState>({
    status: PeerClientStatus.IDLE,
  });
  private updater$ = this.state$.pipe(
    scan((state, update, index) => {
      return { ...state, ...update };
    })
  );
  constructor(conn: Peer.DataConnection) {
    conn.on("data", () => {
      // tunnel$.next({ peerCount });
      this.state$.next({ status: PeerClientStatus.CONNECTED });
    });
    // when a peer connection is opened
    conn.on("open", function () {
      // connection count exceeds then immediately disconnect it
      // if (peerCount >= maxPeer) {
      //   setTimeout(function () {
      //     conn.close();
      //   }, 500);
      //   conn.send("Exceed client count");
      //   return;
      // } else {
      //   peerCount++;
      //   tunnel$.next({ peerCount });
      //   conn.send("Hi peer.");
      // }
    });
    conn.on("close", function () {
      console.log("peer disconnected");
      // peerCount--;
      // tunnel$.next({ peerCount });
    });
    console.log("peer connecting");
  }

  sink() {
    return of();
  }
}

function fromPeerEvent<T>(peer: Peer, event: string) {
  return fromEvent<T>(
    {
      on: (event: string, cb) => {
        peer.on(event, cb as any);
      },
      off: (event: string, cb: Function) => {
        peer.off(event, cb);
      },
    },
    event
  );
}

function fromConnectionEvent(conn: Peer.DataConnection, event: string): Observable<string> {
  return fromEvent<string>(
    {
      on: (event: string, cb) => {
        conn.on(event, cb as any);
      },
      off: (event: string, cb: Function) => {
        conn.off(event, cb);
      },
    },
    event
  );
}

function createEvent(
  eventName: string,
  body: any,
  targetPeerId: string
): PeerEvent {
  return {
    type: PeerSignalType.EVENT,
    payload: { eventName, body, targetPeerId}
  };
}

export class PeerjsClient implements IPeerClient {
  private peer = new Peer({ debug: 2 });
  private peerId: string = "";
  private sink$ = new Subject<PeerClientState>();
  private handlers$ = new Subject();
  private connect$ = fromPeerEvent(this.peer, "open");
  private disconnect$ = fromPeerEvent(this.peer, "disconnected");
  private peerConnect$ = fromPeerEvent<DataConnection>(this.peer, "connection");
  private peerDisconnect$ = fromPeerEvent<DataConnection>(this.peer, "close");
  private peerSignals$ = this.peerConnect$.pipe(
    mergeMap((conn) => fromConnectionEvent(conn, "data"))
  );
  private events$ = this.peerSignals$.pipe(map<string, PeerEvent>((data) => JSON.parse(data)), filter(data => instacenOfPeerEvent(data)));
  private requests$ = this.peerSignals$.pipe(map<string, PeerRequest>((data) => JSON.parse(data)), filter(data => instacenOfPeerRequest(data)));


  private state: PeerClientState = {
    status: PeerClientStatus.IDLE,
    peerCount: 0,
    peers: [],
  };

  constructor() {
    const connections$ = this.peerConnect$.pipe(map((conn) => {}));
  }

  private changeState(state: Partial<PeerClientState>) {
    Object.assign(this.state, state);
  }

  sink() {
    return { 
      events$: this.events$.pipe(),
      requests$: this.requests$.pipe()
    };
  }

  public connectPeer(id: string) {
    this.peer.connect(id);
  }
}
