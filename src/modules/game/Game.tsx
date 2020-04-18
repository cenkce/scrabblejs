import { GameBoard } from "./GameBoard";
import React, { useCallback, useEffect, useState } from "react";
import { TileRack } from "./TileRack";
import { useLetters } from "../letters/useLetters";
import { Letter } from "../letters";

export function Game(){
  const DragTileHander = useCallback(() => {
        
  }, [])
  const letters = useLetters();
  const [userLetters, setUserLetters] = useState<Letter[]>(() => []);

  useEffect(() => {
    const randomLetters = letters && Array(7).fill(null).map(letters.shift);
    randomLetters && setUserLetters(randomLetters);
  }, [letters])

  return <GameBoard>
    <TileRack onDragTile={DragTileHander} tiles={userLetters}></TileRack>
  </GameBoard>
}