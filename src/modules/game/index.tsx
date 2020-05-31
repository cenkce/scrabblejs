import React from "react";
import { Game } from "./Game";
import { LettersProvider } from "../letters/useLetters";
import { GameProvider } from "./GameContext";

export function GameModule(props: {}) {
  return (
    <LettersProvider>
        <GameProvider>
          <Game />
        </GameProvider>
    </LettersProvider>
  );
}
