import { TouchEventHandler, useEffect, TouchEvent } from "react";

const createHandlers = (cb: (params: any) => void) => {
  let tpCache: any[] = [];

  const pinchHandler = (ev: TouchEvent) => {
      
    },
    startHandler = (ev: TouchEvent) => {
      
      cb(ev);
    },
    moveHandler = (ev: TouchEvent) => {
      // Note: if the user makes more than one "simultaneous" touches, most browsers
      // fire at least one touchmove event and some will fire several touchmoves.
      // Consequently, an application might want to "ignore" some touchmoves.
      //
      // This function sets the target element's border to "dashed" to visually
      // indicate the target received a move event.
      //
      ev.preventDefault();
      // if (logEvents) log("touchMove", ev, false);
      // To avoid too much color flashing many touchmove events are started,
      // don't update the background if two touch points are active
      if (!(ev.touches.length == 2 && ev.targetTouches.length == 2)) cb(ev);

      // Set the target element's border to dashed to give a clear visual
      // indication the element received a move event.
      // ev.target.style.border = "dashed";

      // Check this event for 2-touch Move/Pinch/Zoom gesture
      pinchHandler(ev);
    },
    endHandler = (ev: TouchEvent) => {
      ev.preventDefault();
      // if (logEvents) log(ev.type, ev, false);
      if (ev.targetTouches.length == 0) {
        // Restore background and border to original values
        // ev.target.style.background = "white";
        // ev.target.style.border = "1px solid black";
      }
    };

  document.body.ontouchstart = startHandler as any;
  document.body.ontouchmove = moveHandler as any;
  // Use same handler for touchcancel and touchend
  document.body.ontouchcancel = endHandler as any;
  document.body.ontouchend = endHandler as any;

  return () => {
    document.body.removeEventListener("touchstart", startHandler as any);
    document.body.removeEventListener("touchmove", moveHandler as any);
    document.body.removeEventListener("touchcancel", endHandler as any);
    document.body.removeEventListener("touchend", endHandler as any);
  };
};
export function usePinchEvent() {
  useEffect(() => {
    return createHandlers(() => {});
  }, []);
}
