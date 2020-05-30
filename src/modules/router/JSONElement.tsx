export type JSONValue = string | number | null | boolean | JSONValue[];
export type JSONElement = {
  [key: string]: JSONValue | JSONElement | JSONElement[];
};
