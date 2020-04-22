export const CellColors = {
    "W3": 0xFF3333,
    "W2": 0xFFFF99,
    "L3": 0x0099FF,
    "L2": 0x66CCFF,
    "EM": 0x009900,
    "C": 0xFFFF99,
};
export type CellColors = keyof typeof CellColors;
const BoardCenter: CellColors[] = ["W3", "EM", "EM", "L2", "EM", "EM", "EM"];
const BoardMapQuarter: CellColors[][] = [
    ["W3", "EM", "EM", "L2", "EM", "EM", "EM"],
    ["EM", "W2", "EM", "EM", "EM", "L3", "EM"],
    ["EM", "EM", "W2", "EM", "EM", "EM", "L2"],
    ["L2", "EM", "EM", "W2", "EM", "EM", "EM"],
    ["EM", "EM", "EM", "EM", "W2", "EM", "EM"],
    ["EM", "L3", "EM", "EM", "EM", "L3", "EM"],
    ["EM", "EM", "L2", "EM", "EM", "EM", "L2"],
];
const BoardMapHalf: CellColors[][] = BoardMapQuarter.map((row, index) => [...row, BoardCenter[index], ...row.slice().reverse()]);
export const BoardMap: CellColors[][] = [
    ...BoardMapHalf,
    [...BoardCenter, "C", ...BoardCenter.slice().reverse()],
    ...BoardMapHalf.slice().reverse()
];
