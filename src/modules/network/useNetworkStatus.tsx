import { useContext } from "react";
import { NetworkStateContext } from "./Network";
export function useNetworkStatus() {
  return useContext(NetworkStateContext);
}
