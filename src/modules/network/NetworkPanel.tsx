import React, { useRef, useCallback } from "react";
import { useNetworkStatus } from "./useNetworkStatus";
import { PeerService } from "modules/peers/Application";
import { useNetworkState } from "./Network";
import { NetworkStatus, NetworkStatusTexts } from "modules/router/NetworkStatus";

export function NetworkPanel() {
  const status = useNetworkStatus();
  // const networkService = useNetworkConnect();
  const idtextRef = useRef<HTMLInputElement | null>(null);
  const networkState = useNetworkState();
  // const gameService = useRef<MasterConnectionService | null>(null);

  const clientConnectHandler = useCallback(() => {
    if (!idtextRef.current || !idtextRef.current.value) return;
    PeerService.connect(idtextRef.current.value);
  }, []);

  return (
    <div className="NetworkPanel">
      <div className="NetworkPanel_nav">
        {/* Client Connect */}
        <div
          className={"NetworkPanel_connectGame hide--false"}
        >
          <button onClick={clientConnectHandler}>
            {networkState.peerStatus !== NetworkStatus.CONNECTED
              ? "Connect Game"
              : "Disconnect"}
          </button>{" "}
          <input ref={idtextRef} type="text" />
        </div>
      </div>
      <div>
        <div className="NetworkPanel_status">
          Network Status : {NetworkStatusTexts[networkState.networkStatus]}
        </div>
        <div className="NetworkPanel_status">
          Peer Network Status : {NetworkStatusTexts[networkState.peerStatus]}
        </div>
        <div className="NetworkPanel_status">Peer : {networkState.peerCount}</div>
        <div className="NetworkPanel_networkId">
          {networkState.peerId} (Share with your peers)
        </div>
      </div>
    </div>
  );
}
