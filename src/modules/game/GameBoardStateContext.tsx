import React, { createContext, PropsWithChildren, useReducer, Reducer, Dispatch } from "react";
import { GameBoardState, GameBoardActions } from "./GameContext";

const InitialGameBoardState: GameBoardState = {
  zoomRatio: 1,
};
const GameBoardStateContext = createContext<GameBoardState>(InitialGameBoardState);
const GameBoardDispatchContext = createContext<Dispatch<GameBoardActions>>(() => { });

const GameBoardReducer: Reducer<GameBoardState, GameBoardActions> = (state, action) => {
  return state;
};
export function GameBoardProvider(props: PropsWithChildren<{}>) {
  const [state, dispatch] = useReducer(GameBoardReducer, InitialGameBoardState);
  return (<GameBoardStateContext.Provider value={state}>
    <GameBoardDispatchContext.Provider value={dispatch}>
      {props.children}
    </GameBoardDispatchContext.Provider>
  </GameBoardStateContext.Provider>);
}
