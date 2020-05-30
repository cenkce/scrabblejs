import { IPeerClient } from "./IPeerClient";
import Peer, { DataConnection } from "peerjs";
import { Subject, fromEvent, Observable, BehaviorSubject, from, merge, of } from "rxjs";
import { PeerClientState, createInitialPeerClientState } from "./PeerClientState";
import {
  map,
  mergeMap,
  filter,
  share,
  scan,
  tap,
  throttleTime,
  takeUntil,
  mergeScan,
} from "rxjs/operators";
import {
  PeerEvent,
  PeerSignalType,
  instacenOfPeerEvent,
  PeerRequest,
  instacenOfPeerRequest,
} from "./PeerSignal";
import { NetworkStatus } from "modules/router/NetworkStatus";

interface IStreamable<T = any> {
  sink(): Observable<T>;
}

interface IPeerConnection<T = any> extends IStreamable<T> {}

type IPeerConnectionState = {
  status: NetworkStatus;
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

function fromConnectionEvent(
  conn: Peer.DataConnection,
  event: string
): Observable<string> {
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
    payload: { eventName, body, targetPeerId },
  };
}

export class PeerjsClient implements IPeerClient {
  private peerClient = new Peer({ path: "app", host: "localhost", port:9000, debug: 2 });
  private peerId: string = "";
  private state$ = new BehaviorSubject<Partial<PeerClientState>>(createInitialPeerClientState());
  private updateState$ = this.state$.pipe(
    scan<Partial<PeerClientState>, PeerClientState>((acc, curr) => {
      return Object.assign({}, acc, curr);
    }),
    throttleTime(10)
  );
  private handlers$ = new Subject();
  // Peers
  private serverConnect$ = fromPeerEvent<string>(this.peerClient, "open").pipe(
    tap((id) => {
      this.state$.next({ peerId: id, networkStatus: NetworkStatus.CONNECTED });
    })
  );
  private serverDisconnect$ = fromPeerEvent(this.peerClient, "disconnected").pipe(
    tap(() => {
      this.state$.next({ networkStatus: NetworkStatus.DISCONNECTED });
    })
  );
  private serverError$ = fromPeerEvent(this.peerClient, "error").pipe(
    tap(() => {
      this.state$.next({ networkStatus: NetworkStatus.DISCONNECTED });
    })
  );
  private incomingConnection$ = fromPeerEvent<DataConnection>(
    this.peerClient,
    "connection"
  ).pipe(
    mergeMap((conn) => {
      return fromConnectionEvent(conn, "open").pipe(mergeMap((id) => {
        this.state$.next({ peerStatus: NetworkStatus.CONNECTED });
        return fromConnectionEvent(conn, "data");
      }),
      takeUntil(fromConnectionEvent(conn, "close").pipe(tap(() => {
        this.state$.next({ peerStatus: NetworkStatus.DISCONNECTED });
      })))
      );
    })
  );;

  // private incomingConnectionOpen$ = this.incomingConnection$
  // private incomingConnectionClose$ = this.incomingConnection$.pipe(
  //   mergeMap((conn) => {
  //     return ;
  //   })
  // );
  // private peerSignals$ = this.incomingConnection$.pipe(
    // mergeMap((conn) => )
  // );
  // private masterEmitter$ = (() => {
  //   let conn: Peer.DataConnection | null;
  //   this.incomingConnection$.subscribe((cn) => {
  //     this.state$.next({
  //       peerCount: Object.keys(this.peerClient.connections).length,
  //     });
  //     console.log("Connected", this.peerClient.connections);
  //     conn = cn;
  //   });
  //   this.incomingConnectionClose$.subscribe(() => {
  //     console.log("Disconnected");
  //     conn = null;
  //   });
  //   this.serverError$.subscribe(() => {
  //     console.log("Connection Error");
  //     conn = null;
  //     this.peerClient.reconnect();
  //   });
  //   return (req: PeerRequest | PeerEvent) => {
  //     if (!conn) throw new Error("Not Connected");
  //     conn.send(JSON.stringify(req));
  //   };
  // })();
  private events$ = this.incomingConnection$.pipe(
    map<string, PeerEvent>((data) => JSON.parse(data)),
    filter((data) => instacenOfPeerEvent(data))
  );
  private requests$ = this.incomingConnection$.pipe(
    map<string, PeerRequest>((data) => JSON.parse(data)),
    filter((data) => instacenOfPeerRequest(data))
  );

  private status = NetworkStatus.IDLE;
  private outcomingConnection?: DataConnection;

  constructor() {
    this.peerClient.on('connection', (data) =>{})
    merge(this.serverConnect$, this.serverError$, this.serverDisconnect$).subscribe(() => {

    })
  }

  close() {
    this.outcomingConnection?.close();
  }
  createRequest(
    payload: Omit<PeerRequest["payload"], "targetPeerId">
  ): PeerRequest {
    return {
      type: PeerSignalType.REQUEST,
      payload: {
        ...payload,
        targetPeerId: this.peerId,
      },
    };
  }
  createEvent(payload: Omit<PeerEvent["payload"], "targetPeerId">): PeerEvent {
    return {
      type: PeerSignalType.EVENT,
      payload: {
        ...payload,
        targetPeerId: this.peerId,
      },
    };
  }

  connect(id: string) {
    // if (this.status !== NetworkStatus.CONNECTED) return;
    this.outcomingConnection = this.peerClient.connect(id, { reliable: true });
    this.state$.next({
      peerStatus: NetworkStatus.CONNECTING
    });
    this.outcomingConnection.on("open", () => {
      console.log("opened : ", this.peerClient.connections);
      this.state$.next({
        peerStatus: NetworkStatus.CONNECTED,
        peerCount: Object.keys(this.peerClient.connections).length,
      });
      this.outcomingConnection?.send(
        JSON.stringify({
          type: PeerSignalType.REQUEST,
          payload: { path: "user", body: { message: "Hello" }, method: "GET" },
        })
      );
    });
    this.outcomingConnection.on("data", (data) => {
      console.log("on data ;", data);
    });
    this.outcomingConnection.on("close", () => {
      this.state$.next({
        peerStatus: NetworkStatus.DISCONNECTED,
        peerCount: Object.keys(this.peerClient.connections).length,
      });
    });

    return () => {
      this.peerClient.disconnect();
      this.peerClient.destroy();
    };
  }

  sink() {
    return {
      events$: this.events$.pipe(share()),
      requests$: this.requests$.pipe(share()),
      open$: this.serverConnect$.pipe(share()),
      changeState$: this.updateState$,
    };
  }

  private getConnections(): {[key: string]: DataConnection[]}{
    return this.peerClient.connections;
  }

  emit(signal: PeerRequest | PeerEvent) {
    const connections = this.getConnections()
    this.peerClient.listAllPeers((ids) => {
      ids.forEach((id) => {
        if(connections[id])
          connections[id].forEach(conn => {
            conn.send(signal);
          })
      });
    })
    // this.masterEmitter$(request);
  }
}
