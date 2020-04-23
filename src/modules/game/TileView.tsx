import React, { DragEventHandler, useCallback } from "react";
import { Tile } from "./TileModel";

export function TileView(props: Tile & { onDrag?: DragEventHandler, index: number }) {

  return <div onDragStart={useCallback((e) => {
    e.dataTransfer.dropEffect = "move";
    e.dataTransfer.setData("tile", props.letter)
    e.dataTransfer.setData("index", props.index)
  }, [props.letter, props.index])}
    draggable={true}
    onDrag={props.onDrag}
    className="TileView"
  >
    {props.letter} {props.worth}
  </div>
}