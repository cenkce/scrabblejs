import { Tile } from "./TileModel";
import React from "react";
import { TileView } from "./TileView";

export function DragTileView(props: Tile){
  return <TileView {...props}></TileView>
};
