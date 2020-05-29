import { IPeerClient } from "./IPeerClient";
import Peer, { DataConnection } from "peerjs";
import { PeerClientStatus } from "./PeerClientStatus";
import { Subject, fromEvent, Observable, BehaviorSubject} from "rxjs";
import { PeerClientState } from "./PeerClientState";
import { map, mergeMap, filter, share, scan } from "rxjs/operators";
import { PeerEvent, PeerSignalType, instacenOfPeerEvent, PeerRequest, instacenOfPeerRequest } from "./PeerSignal";
import { NetworkStatus } from "modules/network/NetworkStatus";

interface IStreamable<T = any> {
  sink(): Observable<T>;
}

interface IPeerConnection<T = any> extends IStreamable<T> {}

type IPeerConnectionState = {
  status: PeerClientStatus;
};

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
  private state$ = new BehaviorSubject<Partial<PeerClientState>>({
    status: PeerClientStatus.IDLE,
    peerCount: 0,
    peers: [],
  });
  private updateState$ = this.state$.pipe(scan<Partial<PeerClientState>, PeerClientState>((acc, curr) => {
    return Object.assign({}, acc, curr);
  }));
  private handlers$ = new Subject();
  // Peers
  private peerConnect$ = fromPeerEvent(this.peer, "open");
  private peerDisconnect$ = fromPeerEvent(this.peer, "disconnected");
  private peerError$ = fromPeerEvent(this.peer, "error");
  // Master Peer
  private onConnection$ = fromPeerEvent<DataConnection>(this.peer, "connection");
  private onClose$ = this.onConnection$.pipe(mergeMap((conn) => {
    return fromConnectionEvent(conn, "close");
  }));
  private peerSignals$ = this.onConnection$.pipe(
    mergeMap((conn) => fromConnectionEvent(conn, "data"))
  );
  private masterEmitter$ = (() => {
    let conn: Peer.DataConnection | null;
    this.onConnection$.subscribe(
      (cn) => {
        this.state$.next({ peerCount: Object.keys(this.peer.connections).length})
        console.log("Connected", this.peer.connections);
        conn = cn;
      }
    );
    this.onClose$.subscribe(() => {
      console.log("Disconnected");
      conn = null;
    })
    this.peerError$.subscribe(() => {
      console.log("Connection Error");
      conn = null;
      this.peer.reconnect();
    })
    return (req: PeerRequest|PeerEvent) => {
      if(!conn)
        throw new Error("Not Connected");
      conn.send(JSON.stringify(req));
    }
  })();
  private events$ = this.peerSignals$.pipe(map<string, PeerEvent>((data) => JSON.parse(data)), filter(data => instacenOfPeerEvent(data)));
  private requests$ = this.peerSignals$.pipe(map<string, PeerRequest>((data) => JSON.parse(data)), filter(data => instacenOfPeerRequest(data)));

  private status = NetworkStatus.IDLE;
  private connection?: DataConnection;

  constructor() {
  }

  close(){
    this.connection?.close();
  }
  connect(id: string) {
      // if (this.status !== NetworkStatus.CONNECTED) return;
      this.connection = this.peer.connect(id, { reliable: true });
      this.connection.on("open", () => {
        console.log("opened : ", this.peer.connections);
        this.state$.next({ peerCount: Object.keys(this.peer.connections).length})
        this.status = NetworkStatus.CONNECTED_AS_PEER;
        this.connection?.send(JSON.stringify({
          type: PeerSignalType.REQUEST,
          payload: { path: "user", body: { message: "Hello" }, method: "GET" },
        }));

      });
      this.connection.on("data", (data) => {
        console.log("on data ;", data);
      });
      this.connection.on("close", () => {
        this.state$.next({ peerCount: Object.keys(this.peer.connections).length})
        this.status = NetworkStatus.DISCONNECTED;
      });

    return () => {
        this.peer.disconnect();
        this.peer.destroy();
      }
  };

  sink() {
    return { 
      events$: this.events$.pipe(share()),
      requests$: this.requests$.pipe(share()),
      open$: this.peerConnect$.pipe(share()),
      changeState$: this.updateState$
    };
  }

  emit(request: PeerRequest|PeerEvent) {
    this.masterEmitter$(request);
  }
}
