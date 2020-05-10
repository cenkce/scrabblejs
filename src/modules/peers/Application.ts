import { PeerApplication } from "modules/router/PeerApplication";
import { PeerjsClient } from "modules/router/PeerjsAdapter";

export const [Controller] = PeerApplication(new PeerjsClient());

