import React, {
  createContext,
  useEffect,
  PropsWithChildren,
  useState,
  useContext,
} from "react";
import { PeerService } from "modules/peers/Application";
import {
  PeerClientState,
  createInitialPeerClientState,
} from "modules/router/PeerClientState";
const initialState = createInitialPeerClientState();
export const NetworkStateContext = createContext<PeerClientState>(
  initialState
);

export function NetworkStateProvider(props: PropsWithChildren<{}>) {
  const [state, setState] = useState<PeerClientState>(initialState);
  useEffect(() => {
    const sink = PeerService.sink();
    const subscription = sink.changeState$.subscribe((state) => {
      setState(state);
    });
    
    return () => subscription.unsubscribe();
  }, []);
  return <NetworkStateContext.Provider value={state}>{props.children}</NetworkStateContext.Provider>;
}

export function useNetworkState(){
  return useContext(NetworkStateContext);
}
