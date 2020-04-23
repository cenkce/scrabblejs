import { useScene } from "../../core/scene/SceneProvider";
import { useRef, useEffect, useCallback, useState, PropsWithChildren, DragEventHandler } from "react";
import React from "react";
import { Sprite, Point, Texture, Text, interaction, Container } from "pixi.js";
import { fromEvent } from "rxjs"
import { switchMap, takeUntil } from "rxjs/operators"
import { useGlobalKeyboarEvents } from "core/useGlobalKeyboarEvents";
import { GameBoardShape } from "./GameBoardShape";
import { CELL_SIZE, CELL_CONTENT_SIZE, CELL_BORDER_SIZE } from "./constants";
import { calculateCellPosition } from "./utils/calculateCellPosition";

class Tile extends Sprite {
    private text: Text;
    private bg: Sprite;
    constructor(text: string, scale: number = 1, size: number) {
        super();
        this.text = new Text(text);
        this.bg = new Sprite(Texture.WHITE);
        this.bg.tint = 0xF0EFC2;
        this.bg.width = size * scale;
        this.bg.height = size * scale;
        this.anchor.set(0.5, 0.5);
        this.bg.anchor.set(0.5, 0.5);
        this.text.anchor.set(0.5, 0.5);
        this.addChild(this.bg);
        this.addChild(this.text);
    }
}

export function GameBoard(props: PropsWithChildren<{onDrop: (index: number) => void}>) {
    const pixi = useScene();
    const root = useRef<HTMLDivElement | null>(null);
    const bgSprite = useRef<Sprite | null>(null);
    const boardSprite = useRef<Container | null>(null);
    const [loaded, setLoaded] = useState<boolean>(false);
    const addTile = useRef<((text: string, pos: { x: number, y: number }) => void) | null>()

    useGlobalKeyboarEvents(useCallback((e) => {
        if (!e.ctrlKey || !boardSprite.current)
            return false;
        let zoomRatio = boardSprite.current.scale.x;
        switch (e.key) {
            case 'z':
                zoomRatio = Math.max(0.1, zoomRatio - 0.1);
                e.preventDefault();
                break;
            case 'x':
                zoomRatio = Math.min(1, zoomRatio + 0.1)
                e.preventDefault();
                break;
            default:
                break;
        }
        boardSprite.current.scale.set(zoomRatio, zoomRatio);
    }, []));

    useEffect(() => {
        if (pixi && pixi.view && root.current && !boardSprite.current) {
            const stage = pixi.stage;
            root.current.appendChild(pixi.view);
            pixi.renderer.plugins.interaction.autoPreventDefault = true;

            boardSprite.current = new Container();
            stage.addChild(boardSprite.current);

            pixi.loader.load()
                .add("bg", '/assets/Scrabbleboard.svg')
                .load((loader, resource) => {
                    setLoaded(true);
                });
        }
    }, [pixi]);

    useEffect(() => {
        if (loaded && pixi && boardSprite.current) {
            const sprite = new GameBoardShape(CELL_SIZE, CELL_BORDER_SIZE * 2);
            const board = boardSprite.current;
            board.interactive = true;
            sprite.anchor.set(0.5, 0.5);
            bgSprite.current = sprite;

            board?.addChild(sprite);
            board.position.set( pixi.screen.width/2,  pixi.screen.height/2);
            const pos = { x: 0, y: 0 };
            addTile.current = (text, pos) => {
                const tile = new Tile(text, bgSprite.current?.scale.x, CELL_CONTENT_SIZE);
                tile.position.set(pos.x, pos.y);
                board.addChild(tile);
            }

            const subscription = fromEvent<MouseEvent>(pixi.view, "mousedown").pipe(
                switchMap((e) => {
                    pos.x = e.x;
                    pos.y = e.y;
                    return fromEvent<MouseEvent>(pixi.view, "mousemove").pipe(takeUntil(fromEvent(pixi.view, "mouseup")));
                })
            ).subscribe((e) => {
                const delta = { x: pos.x - e.x, y: pos.y - e.y };
                board.position.set(board.x - delta.x, board.y - delta.y);
                pos.x = e.x;
                pos.y = e.y;
            });

            return () => {
                subscription.unsubscribe();
            }
        }
    }, [loaded])

    const dropHandler: DragEventHandler = (e) => {
        e.preventDefault();
        const text = e.dataTransfer.getData('tile');
        const index = e.dataTransfer.getData('index');
        const data = new interaction.InteractionData();
        if (boardSprite.current && addTile.current) {
            const localPos = data.getLocalPosition(boardSprite.current, undefined, new Point(e.clientX, e.clientY));
            const boardPos = calculateCellPosition({
                cellSize: CELL_SIZE,
                cellBorderSize: CELL_BORDER_SIZE,
                x: localPos.x,
                y: localPos.y
            });

            addTile.current(text, boardPos);
            props.onDrop(parseInt(index));
        }
    }

    const dragOverHandler: DragEventHandler = (e) => {
        e.preventDefault();
        if (typeof e.dataTransfer.getData('tile') === 'string') {
        }
        e.dataTransfer.dropEffect = "move";
    }

    return <div onDragOver={dragOverHandler} onDrop={dropHandler} className="Game" ref={root}>
        {props.children}
    </div>;
}

