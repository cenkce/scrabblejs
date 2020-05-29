import React, { useRef, useCallback, useEffect, useState } from "react";
import {
  useNetworkConnect,
  useNetworkId,
  MasterConnectionService,
} from "./Network";
import { useNetworkStatus } from "./useNetworkStatus";
import { NetworkStatusTexts, NetworkStatus } from "./NetworkStatus";
import { PeerService } from "modules/peers/Application";
import { PeerSignalType } from "modules/router/PeerSignal";
import { Subscription } from "rxjs";

export function NetworkPanel() {
  const status = useNetworkStatus();
  const networkService = useNetworkConnect();
  const gameService = useRef<MasterConnectionService | null>(null);
  const networkId = useNetworkId();
  const idtextRef = useRef<HTMLInputElement | null>(null);
  const [peerCount, setPeerCount] = useState(0);

  useEffect(() => {
    // let subscription = networkService.observable$.subscribe(({peerCount}) => {
    //   setPeerCount(peerCount);
    // });
    const unloads: Subscription[] = []
    unloads.push(PeerService.sink().requests$.subscribe((value) => {
      console.log("requests sink", value);
    }));
    unloads.push(PeerService.sink().events$.subscribe(() => {
      console.log("events sink");
    }));
    unloads.push(PeerService.sink().changeState$.subscribe((state) => {
      setPeerCount(state.peerCount);
    }));

    return () => {
      unloads.forEach(subs => subs.unsubscribe());
      // subscription.unsubscribe();
    };
  }, [networkService]);

  const clientConnectHandler = useCallback(() => {
    if (!idtextRef.current || !idtextRef.current.value) return;
    PeerService.connect(idtextRef.current.value);
  }, [networkService]);

  return (
    <div className="NetworkPanel">
      <div className="NetworkPanel_nav">
        {/* Client Connect */}
        <div
          className={"NetworkPanel_connectGame hide--" + !!gameService.current}
        >
          <button onClick={clientConnectHandler}>
            {status !== NetworkStatus.CONNECTED_AS_PEER
              ? "Connect Game"
              : "Disconnect"}
          </button>{" "}
          <input ref={idtextRef} type="text" />
        </div>
      </div>
      <div>
        <div className="NetworkPanel_status">
          Status : {NetworkStatusTexts[status]}
        </div>
        <div className="NetworkPanel_status">Peer : {peerCount}</div>
        <div className="NetworkPanel_networkId">
          {!networkId ? "" : `${networkId} (Share with your peers)`}
        </div>
      </div>
    </div>
  );
}
