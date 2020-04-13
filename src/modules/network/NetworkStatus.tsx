export enum NetworkStatus {
    CONNECTING = 0,
    CONNECTED = 2,
    CONNECTED_AS_PEER = 4,
    IDLE = 8,
    DISCONNECTED = 16
}
export const NetworkStatusTexts = {
    [NetworkStatus.IDLE]: "Idle",
    [NetworkStatus.CONNECTED]: "Connected",
    [NetworkStatus.CONNECTED_AS_PEER]: "Connected as Peer",
    [NetworkStatus.CONNECTING]: "Connecting",
    [NetworkStatus.DISCONNECTED]: "Dısconnected",
}