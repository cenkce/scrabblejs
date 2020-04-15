import React, { DragEventHandler } from "react";
import { Tile } from "./TileModel";

export function TileView(props: Tile & {onDrag?: DragEventHandler}){
  return <div onDrag={props.onDrag} className="TileView">{props.text} {props.worth}</div>
}