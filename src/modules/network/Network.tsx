import React, {
  createContext,
  useEffect,
  PropsWithChildren,
  useState,
  useContext,
} from "react";
import { Observable } from "rxjs";
import { NetworkStatus } from "./NetworkStatus";
import { PeerRequest } from "../router/PeerSignal";
import { PeerService } from "modules/peers/Application";

export const NetworkSetIDContext = createContext<(id: string) => void>(
  () => {}
);
export const NetworkIdContext = createContext<string | null>(null);
export const NetworkStatusContext = createContext<NetworkStatus>(
  NetworkStatus.IDLE
);
export const NetworkChangeStatusContext = createContext<
  (status: NetworkStatus) => void
>(() => {});

export function NetworkProvider(props: PropsWithChildren<{}>) {
  const [id, setId] = useState<string | null>(null);
  useEffect(() => {
    PeerService.sink().open$.subscribe((id) => {
      console.log("connect sink ", id);
      setId(id);
    })
  }, [])
  return (
    <NetworkSetIDContext.Provider value={setId}>
      <NetworkIdContext.Provider value={id}>
        <NetworkStatusProvider>{props.children}</NetworkStatusProvider>
      </NetworkIdContext.Provider>
    </NetworkSetIDContext.Provider>
  );
}

function NetworkStatusProvider(props: PropsWithChildren<{}>) {
  const [status, setStatus] = useState<NetworkStatus>(NetworkStatus.IDLE);

  return (
    <NetworkStatusContext.Provider value={status}>
      <NetworkChangeStatusContext.Provider value={setStatus}>
        {props.children}
      </NetworkChangeStatusContext.Provider>
    </NetworkStatusContext.Provider>
  );
}

export function useNetworkId() {
  return useContext(NetworkIdContext);
}

export type MasterConnectionService = {
  disconnect: () => void;
  observable$: Observable<{
    peerCount: number;
  }>;
};

type streams =
  | { type: "peer/create"; connId: string; peerCount: number; username: string }
  | { type: "peer/delete"; connId: string }
  | { type: "peer/request"; request: PeerRequest };
export function useNetworkConnect() {
  const networkId = useContext(NetworkIdContext);
  const status = useContext(NetworkStatusContext);

  useEffect(() => {

  }, [])
}
// export function useNetworkConnect() {
//   const networkId = useContext(NetworkIdContext);
//   const setNetworkId = useContext(NetworkSetIDContext);
//   const setStatus = useContext(NetworkChangeStatusContext);
//   const status = useContext(NetworkStatusContext);
//   const peerRef = useRef<Peer | null>(null);
//   const tunnel$ = useMemo(() => new Subject<{ peerCount: number }>(), []);

//   useEffect(() => {
//     if (status >= NetworkStatus.IDLE) {
//       if (peerRef.current) {
//         peerRef.current?.disconnect();
//         peerRef.current?.destroy();
//         peerRef.current = null;
//       }

//       peerRef.current = new Peer({ debug: 2 });
//       let peerCount = 0;
//       let peer = peerRef.current;
//       let masterId: string;
//       const maxPeer = 4;

//       setStatus(NetworkStatus.CONNECTING);
//       peer.on("open", function (id) {
//         setNetworkId(id);
//         masterId = id;
//         setStatus(NetworkStatus.CONNECTED);
//       });
//       // a new peer on connected
//       peer.on("connection", function (conn) {
//         const connectionId = shortid.generate();

//         conn.on("data", () => {
//           tunnel$.next({ peerCount });
//         });
//         // when a peer connection is opened
//         conn.on("open", function () {
//           // connection count exceeds then immediately disconnect it
//           if (peerCount >= maxPeer) {
//             setTimeout(function () {
//               conn.close();
//             }, 500);
//             conn.send("Exceed client count");
//             return;
//           } else {
//             peerCount++;
//             tunnel$.next({ peerCount });
//             conn.send("Hi peer.");
//           }
//         });
//         conn.on("close", function () {
//           console.log("peer disconnected");
//           peerCount--;
//           tunnel$.next({ peerCount });
//         });
//         console.log("peer connecting");
//       });

//       peer.on("disconnected", function () {
//         console.log("Connection lost. Please reconnect");

//         if (peerRef.current) {
//           peerRef.current.reconnect();
//           setStatus(NetworkStatus.CONNECTING);
//         } else {
//           setStatus(NetworkStatus.DISCONNECTED);
//         }
//       });
//     }
//   }, [setNetworkId, setStatus, status]);

//   useEffect(() => {
//     return () => {
//       peerRef.current?.disconnect();
//       peerRef.current?.destroy();
//       peerRef.current = null;
//     };
//   }, []);

//   return useMemo(
//     () => ({
//       observable$: tunnel$.asObservable(),
//       disconnect: () => {
//         peerRef.current?.disconnect();
//         peerRef.current?.destroy();
//         peerRef.current = null;
//       },
//       connectasClient(targetId: string) {
//         if (status !== NetworkStatus.CONNECTED || !peerRef.current) return null;
//         const peer = peerRef.current;
//         const conn = peer.connect(targetId, { reliable: true });
//         conn.on("open", () => {
//           setStatus(NetworkStatus.CONNECTED_AS_PEER);
//         });
//         conn.on("data", (data) => {
//           console.log("on data ;", data);
//         });
//         conn.on("close", function () {
//           console.log("peer connect closed");
//           setStatus(NetworkStatus.DISCONNECTED);
//         });

//         return {
//           disconnect() {
//             peer.disconnect();
//             peer.destroy();
//           },
//         };
//       },
//       diconnect() {},
//     }),
//     [setNetworkId, setStatus, status]
//   );
// }

// peer.on('close', function() {
//     conn = null;
//     status.innerHTML = "Connection destroyed. Please refresh";
//     console.log('Connection destroyed');
// });
// peer.on('error', function (err) {
//     console.log(err);
//     alert('' + err);
// });
