import { Sprite, Graphics } from "pixi.js";
import { BoardMap, CellColors } from "./BoardMapData";
export class GameBoardShape extends Sprite {
    private graphics: Graphics = new Graphics();
    constructor(cellSize: number) {
        super();
        const colCount = 15;
        const rowCount = 15;
        const cellCount = colCount * rowCount;
        for (let i = 0; i < cellCount; i++) {
            let x = i % colCount;
            let y = Math.floor(i / colCount);
            let color = BoardMap[x][y];
            this.graphics
                .beginFill(CellColors[color])
                .lineStyle(2, 0x000000)
                .drawRect(x * cellSize, y * cellSize, cellSize, cellSize)
                .endFill();
        }
        this.addChild(this.graphics);
    }
}
