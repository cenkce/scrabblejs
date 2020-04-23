import React, { PropsWithChildren, MouseEventHandler } from "react";

export function Button(props: PropsWithChildren<{onClick: MouseEventHandler, type: "warn"}>){
  return <button className={"Button Button-"+props.type}>{props.children}</button>
}