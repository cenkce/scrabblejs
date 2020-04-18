import React, { DragEventHandler } from "react";
import { Tile } from "./TileModel";

export function TileView(props: Tile & { onDrag?: DragEventHandler }) {

  return <div onDragStart={(e) => {
    e.dataTransfer.dropEffect = "move";
    e.dataTransfer.setData("tile", props.letter)
  }}
    draggable={true}
    onDrag={props.onDrag}
    className="TileView"
  >
    {props.letter} {props.worth}
  </div>
}