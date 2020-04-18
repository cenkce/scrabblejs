import { LettersCollection, arrayShuffle, Letter } from "./index";

export function LettersQueue(lang: keyof typeof LettersCollection = 'tr') {
  const letters = LettersCollection[lang];
  const indexes = arrayShuffle(letters.chars
    .reduce<number[]>((acc, curr, index) => {
      const letterIndexes = Array(parseInt(letters.counts[index])).fill(index);
      acc = acc.concat(letterIndexes);
      return acc;
    }, []));
  const service = {
    [Symbol.iterator]: () => ({
      next: () => ({
        value: service.shift(),
        done: !service.has()
      })
    }),
    shift(): Letter {
      if (!service.has()) {
        throw new Error('Empty queue');
      }
      const index = indexes.shift();
      return {
        letter: letters.chars[index],
        worth: parseInt(letters.worths[index])
      };
    },
    has() {
      return indexes.length > 0;
    },
    get size() {
      return indexes.length;
    }
  };
  return service;
}
