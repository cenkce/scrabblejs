import React, { createContext, useLayoutEffect, useRef, Context, PropsWithChildren, useContext, useState } from "react";
import { Application } from "pixi.js";

const SceneContext = createContext<Application | null>(null);

export function SceneProvider(props: PropsWithChildren<{ width: number, height: number }>) {
    const element = useRef<HTMLCanvasElement | null>(null);
    const [pixi, setPixi] = useState<Application | null>(null);

    useLayoutEffect(() => {
        element.current = document.createElement('canvas');
        setPixi(new Application({ width: props.width, height: props.height, view: element.current }));
    }, []);

    return <SceneContext.Provider value={pixi}>
        {props.children}
    </SceneContext.Provider>;
}

export function useScene() {
    const pixi = useContext(SceneContext);

    return pixi;
}
