import React, { createContext, useMemo, PropsWithChildren, useContext } from "react"
import { LettersQueue } from "./LettersQueue";
import { Langs } from ".";

const LettersContext = createContext<ReturnType<typeof LettersQueue> | null>(null);

export function LettersProvider({ lang = 'tr', children }: PropsWithChildren<{ lang?: Langs }>) {
  const value = useMemo(() => LettersQueue(lang), [lang])
  return <LettersContext.Provider value={value}>{children}</LettersContext.Provider>
}

export function useLetters() {
  const letters = useContext(LettersContext);

  return letters;
}