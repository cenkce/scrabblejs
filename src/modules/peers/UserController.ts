import { Controller } from "./Application";
import { Post, Get, Delete } from "modules/router/decorator/createControllerDecorator";

export const UserController$ = Controller("user")(
  Post("", () => {}),
  Get("/", (req, res, next) => {
    res.payload.data = "data 1";
    console.log("Get 1");
  }),
  Get("/", (req, res, next) => {
    console.log("Get 2", res.payload.data);
  }),
  Delete("", () => {}),
  Get(":id", () => {})
);
