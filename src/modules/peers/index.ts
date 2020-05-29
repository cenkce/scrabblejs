import { UserController$ } from "./UserController";

UserController$.subscribe((response) => {
  console.log("UserController$ : ", response);
});