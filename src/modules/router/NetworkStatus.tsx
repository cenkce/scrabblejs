export enum NetworkStatus {
    CONNECTING = 0,
    CONNECTED = 2,
    IDLE = 8,
    DISCONNECTED = 16
}
export const NetworkStatusTexts = {
    [NetworkStatus.IDLE]: "Idle",
    [NetworkStatus.CONNECTED]: "Connected",
    [NetworkStatus.CONNECTING]: "Connecting",
    [NetworkStatus.DISCONNECTED]: "Dısconnected",
}