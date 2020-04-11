import { useScene } from "../../core/scene/SceneProvider";
import { useRef, useEffect, useCallback, useState } from "react";
import React from "react";
import { Sprite, utils, IPoint } from "pixi.js";
import {Subject, fromEvent} from "rxjs"
import {mergeMap, switchMap, takeUntil} from "rxjs/operators"

function useGlobalKeyboarEvents(cb: (this: HTMLElement, ev: KeyboardEvent) => any){
    useEffect(() => {
        let fn = cb;
        document.body.addEventListener('keydown', fn);
        return () => {
            document.body.removeEventListener('keydown', fn);
        }
    }, [cb]);
}

export function Game(){
    const pixi = useScene();
    const root = useRef<HTMLDivElement | null>(null);
    const bgSprite = useRef<Sprite | null>(null);
    const boardSprite = useRef<Sprite | null>(null);
    const [loaded, setLoaded] = useState<boolean>(false);

    useGlobalKeyboarEvents(useCallback((e) => {
        if(!e.ctrlKey || !bgSprite.current)
            return false;
        let zoomRatio = bgSprite.current.scale.x;
        switch (e.key) {
            case 'z':
                zoomRatio = zoomRatio <= 0 ? 0.1 : zoomRatio - 0.1;
                e.preventDefault();
                break;
            case 'x':
                zoomRatio = zoomRatio <= 0 ? 0.1 : zoomRatio + 0.1;
                e.preventDefault();
                break;
            default:
                break;
        }
        bgSprite.current.scale.set(zoomRatio, zoomRatio);
    }, []));

    useEffect(() => {
        if(pixi && pixi.view && root.current && !boardSprite.current){
            const stage = pixi.stage;
            root.current.appendChild(pixi.view);
            boardSprite.current = new Sprite();
            stage.addChild(boardSprite.current);

            pixi.loader.load()
                .add("bg", '/assets/Scrabbleboard.svg')
                .load((loader, resource) => {
                    setLoaded(true);
                });
        }
    }, [pixi]);

    useEffect(() => {
        if(loaded && pixi && boardSprite.current){
            const subject = new Subject();
            const sprite = new Sprite(utils.TextureCache.bg);
            const board = boardSprite.current;
            sprite.pivot.set(sprite.width/2, sprite.height/2);
            boardSprite.current?.pivot.set(-pixi.screen.width/2, -pixi.screen.height/2);
            bgSprite.current = sprite;
            boardSprite.current?.addChild(sprite);
            const pos = {x: 0, y: 0};

            const subscription = fromEvent<MouseEvent>(pixi.view, "mousedown").pipe(
                switchMap((e) => {
                    pos.x = e.x;
                    pos.y = e.y;
                    return fromEvent<MouseEvent>(pixi.view, "mousemove").pipe(takeUntil(fromEvent(pixi.view, "mouseup")));
                })
            ).subscribe((e) => {
                const delta = {x: pos.x - e.x, y: pos.y - e.y};
                board.position.set(board.x - delta.x, board.y - delta.y);
                pos.x = e.x;
                pos.y = e.y;
            });

            return () => {
                subscription.unsubscribe();
            }
        }
    }, [loaded])

    return <div className="Game" ref={root}></div>;
}
