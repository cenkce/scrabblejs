import React, { PropsWithChildren } from "react";
import { Tile } from "./TileModel";
import { TileView } from "./TileView";

export function TileRack(props: PropsWithChildren<{tiles: Tile[], onDragTile: () => void}>){
  return <div className="TileRack">
    {props.tiles.map((tile, index) => <TileView key={index+"-"+tile.letter} onDrag={props.onDragTile} {...tile}></TileView>)}
  </div>;
}
