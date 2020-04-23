import React, { PropsWithChildren, MouseEventHandler } from "react";
import { Tile } from "./TileModel";
import { TileView } from "./TileView";
import { Button } from "shared/Button";

export function TileRack(
  props: PropsWithChildren<{ tiles: Tile[]; onDragTile: () => void; isValid: boolean }>
) {
  return (
    <div className="TileRack" onDrop={(e) => {e.preventDefault(); e.stopPropagation()}}>
      <div className="TileRack_tiles">
        {props.tiles.map((tile, index) => (
          <TileView
            key={index + "-" + tile.letter}
            index={index}
            onDrag={props.onDragTile}
            {...tile}
          ></TileView>
        ))}
      </div>
      <div>
        <Button type={"warn"} onClick={() => {}}>
          Turn
        </Button>
      </div>
    </div>
  );
}
