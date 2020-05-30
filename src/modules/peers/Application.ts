import { PeerApplication } from "modules/router/PeerApplication";
import { PeerjsClient } from "modules/router/PeerjsAdapter";
import { UserController$ } from "./UserController";

const [PeerService, Controller, Listener] = PeerApplication(new PeerjsClient());

export {PeerService, Controller, Listener};
