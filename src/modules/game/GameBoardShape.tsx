import { Sprite, Graphics } from "pixi.js";
import { BoardMap, CellColors } from "./BoardMapData";
export class GameBoardShape extends Sprite {
    private graphics: Graphics = new Graphics();
    constructor(cellSize: number, borderSize: number, colCount = 15, rowCount = 15) {
        super();
        const cellCount = colCount * rowCount;
        for (let i = 0; i < cellCount; i++) {
            let x = i % colCount;
            let y = Math.floor(i / colCount);
            let color = BoardMap[x][y];
            this.graphics
                .beginFill(CellColors[color])
                .lineStyle(borderSize, 0x000000)
                .drawRect(x * cellSize, y * cellSize, cellSize, cellSize)
                .endFill();
            this.graphics.x = -this.graphics.width/2
            this.graphics.y = -this.graphics.height/2
        }

        this.addChild(this.graphics);
    }

    get width() {
        return this.graphics.width;
    }

    get height() {
        return this.graphics.height;
    }
}
