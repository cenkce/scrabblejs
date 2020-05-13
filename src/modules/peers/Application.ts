import { PeerApplication } from "modules/router/PeerApplication";
import { PeerjsClient } from "modules/router/PeerjsAdapter";

const [Controller, Listener] = PeerApplication(new PeerjsClient());

export {Controller, Listener};

