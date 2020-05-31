import { useEffect } from "react";
import { Controller } from "modules/peers/Application";
import { useLetters } from "modules/letters/useLetters";
import { Get } from "modules/router/createControllerFactory";

export function useGameController(){
  const letters = useLetters();
  useEffect(() => {
    Controller()(
      Get("game/letters/:player", (req, res, next) => {
        const playerLetters = letters ? [...letters.iterateable(3)] : [];
        console.log("Request : ", req);
        res.payload.data = {
          letters: playerLetters
        }
      }));
  }, [])
}