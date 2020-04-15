import React from "react";
import { GameProvider } from "./GameContext";

export function Game(props: {}){
  return <GameProvider>
    <Game />
  </GameProvider>
};
