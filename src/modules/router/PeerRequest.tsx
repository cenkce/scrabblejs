import { PeerRequestMethod } from "./PeerRequestMethod";

export class PeerRequest {
  constructor(public readonly path: string, public readonly body: any, public readonly method: PeerRequestMethod) { }
}
