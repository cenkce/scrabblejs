import React, {
  createContext,
  PropsWithChildren,
  useReducer,
  Reducer,
  useContext,
} from "react";
import { GameBoardProvider } from "./GameBoardStateContext";
import { useGameController } from "./GameController";

export type GameBoardState = {
  zoomRatio: number;
};

type GameState = {
  players: Player[];
};

type Player = {
  id: string;
  name?: string;
};

export type GameBoardActions = {};
type GameActions = {};

const InitialGameState: GameState = {
  players: [],
};

const GameStateContext = createContext<GameState>(InitialGameState);
const GameDispatchContext = createContext<GameActions>(() => {});
const GameReducer: Reducer<GameState, GameActions> = (state, action) => {

  return state;
};

export function useGameService(){
  const state = useContext(GameStateContext);

  return state;
}

export function useGameDispatch(){
  return useContext(GameDispatchContext);
}

export function GameProvider(props: PropsWithChildren<{}>) {
  const [state, dispatch] = useReducer(GameReducer, InitialGameState);
  useGameController();

  return (
    <GameStateContext.Provider value={state}>
      <GameDispatchContext.Provider value={dispatch}>
        <GameBoardProvider>{props.children}</GameBoardProvider>
      </GameDispatchContext.Provider>
    </GameStateContext.Provider>
  );
}