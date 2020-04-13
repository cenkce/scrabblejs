import { useContext } from "react";
import { NetworkStatusContext } from "./Network";
export function useNetworkStatus() {
  return useContext(NetworkStatusContext);
}
