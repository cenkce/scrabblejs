import React, { createContext, PropsWithChildren, useReducer, Reducer, Dispatch } from "react";

type GameState = {
  zoomRatio: number;
};

type GameActions = {}
const InitialGameState: GameState = {
  zoomRatio: 1
};

const GameStateContext = createContext<GameState>(InitialGameState);
const GameDispatchContext = createContext<Dispatch<GameActions>>(() => {});

const GameReducer: Reducer<GameState, GameActions> = (state, action) => {
  return state;
}

export function GameProvider(props:PropsWithChildren<{}>){
  const [state, dispatch] = useReducer(GameReducer, InitialGameState);
  return <GameStateContext.Provider value={state}>
    <GameDispatchContext.Provider value={dispatch}>
      {props.children}
    </GameDispatchContext.Provider>
  </GameStateContext.Provider>
}