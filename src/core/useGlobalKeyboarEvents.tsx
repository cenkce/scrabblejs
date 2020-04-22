import { useEffect } from "react";
export function useGlobalKeyboarEvents(cb: (this: HTMLElement, ev: KeyboardEvent) => any) {
    useEffect(() => {
        let fn = cb;
        document.body.addEventListener('keydown', fn);
        return () => {
            document.body.removeEventListener('keydown', fn);
        };
    }, [cb]);
}
