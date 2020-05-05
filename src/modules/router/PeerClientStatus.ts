export enum PeerClientStatus {
  CONNECTING = 0,
  CONNECTED = 2,
  CONNECTED_AS_PEER = 4,
  IDLE = 8,
  DISCONNECTED = 16
}
export const PeerClientStatusTexts = {
  [PeerClientStatus.IDLE]: "Idle",
  [PeerClientStatus.CONNECTED]: "Connected",
  [PeerClientStatus.CONNECTED_AS_PEER]: "Connected as Peer",
  [PeerClientStatus.CONNECTING]: "Connecting",
  [PeerClientStatus.DISCONNECTED]: "Dısconnected",
}