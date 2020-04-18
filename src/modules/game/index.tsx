import React from "react";
import { GameProvider } from "./GameContext";
import { Game } from "./Game";
import { LettersProvider } from "../letters/useLetters";

export function GameModule(props: {}){
  return <GameProvider>
    <LettersProvider>
    <Game />
    </LettersProvider>
  </GameProvider>
};
