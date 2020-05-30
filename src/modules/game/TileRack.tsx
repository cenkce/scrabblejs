import React, { PropsWithChildren, MouseEventHandler } from "react";
import { Tile } from "./TileModel";
import { TileView } from "./TileView";
import { Button } from "shared/Button";
import { PeerService } from "modules/peers/Application";
import { PeerSignalType } from "modules/router/PeerSignal";

export function TileRack(
  props: PropsWithChildren<{
    tiles: Tile[];
    onDragTile: () => void;
    isValid: boolean;
    onTurnDone: () => void;
  }>
) {
  return (
    <div className="TileRack">
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
        <Button
          type={"warn"}
          onClick={() => {
            PeerService.emit(
              PeerService.createRequest({
                body: {
                  name: "cenk",
                },
                method: "GET",
                path: "users",
              })
            );
          }}
        >
          Turn
        </Button>
      </div>
    </div>
  );
}
