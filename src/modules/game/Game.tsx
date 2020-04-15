import { GameBoard } from "./GameBoard";
import React, { useCallback } from "react";
import { TileRack } from "./TileRack";

export function Game(){
  const DragTileHander = useCallback(() => {
        
  }, [])

  return <GameBoard>
    <TileRack onDragTile={DragTileHander} tiles={[{text: "A", worth: 1}, {text: "E", worth: 1}, {text: "C", worth: 3}]}></TileRack>
  </GameBoard>
}