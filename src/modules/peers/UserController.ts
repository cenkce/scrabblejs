import { Controller } from "./Application";
import { Post, Get, Delete } from "modules/router/decorator/createControllerDecorator";

export const UserController$ = Controller("user").pipe(
  Post("", () => {}),
  Get("", () => {}),
  Delete("", () => {}),
  Get(":id", () => {})
);

UserController$.subscribe((response) => {
  console.log(response);
}, );
