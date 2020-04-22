import { Letters } from "./Letters";

export const LettersCollection = {
  tr: new Letters(
    "A|B|C|Ç|D|E|F|G|Ğ|H|I|İ|J|K|L|M|N|O|Ö|P|R|S|Ş|T|U|Ü|V|Y|Z".split("|"),
    "12|2|2|2|2|8|1|1|1|1|4|7|1|7|7|4|5|3|1|1|6|3|2|5|3|2|1|2|2".split("|"),
    "1|3|4|4|3|1|7|5|8|5|2|1|10|1|1|2|1|2|7|5|1|2|4|1|2|3|7|3|4".split("|")
  ),
  en: new Letters(
    "A|B|C|D|E|F|G|H|I|J|K|L|M|N|O|P|Q|R|S|T|U|V|W|X|Y|Z".split("|"),
    "12|2|2|2|2|8|1|1|1|1|4|7|1|7|7|4|5|3|1|1|6|3|2|5|3|2|1|2|2".split("|"),
    "1|3|4|4|3|1|7|5|8|5|2|1|10|1|1|2|1|2|7|5|1|2|4|1|2|3|7|3|4".split("|")
  ),
};

export type Langs = keyof typeof LettersCollection;
export type Letter = {
  letter: string;
  worth: number;
}

export function arrayShuffle(array: any[]) {
  return array.sort(() => 0.5 - Math.random());
}

