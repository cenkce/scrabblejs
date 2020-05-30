import { GameBoard } from "./GameBoard";
import React, { useCallback, useEffect, useState, ComponentProps } from "react";
import { TileRack } from "./TileRack";
import { useLetters } from "../letters/useLetters";
import { Letter } from "../letters";

export function Game() {
  const DragTileHander = useCallback(() => {}, []);
  const letters = useLetters();
  const [userLetters, setUserLetters] = useState<Letter[]>(() => []);

  useEffect(() => {
    const randomLetters = letters && Array(7).fill(null).map(letters.shift);
    randomLetters && setUserLetters(randomLetters);
  }, [letters]);

  const onDropHandler = useCallback<ComponentProps<typeof GameBoard>["onDrop"]>(
    (index) => {
      console.log(index);
      userLetters.splice(index, 1);
      setUserLetters(userLetters.slice());
    },
    [userLetters]
  );

  return (
    <GameBoard onDrop={onDropHandler}>
      <TileRack
        onDragTile={DragTileHander}
        tiles={userLetters}
        isValid={true}
        onTurnDone={() => {}}
      ></TileRack>
    </GameBoard>
  );
}
