import { useEffect } from "react";

export function useHotkey(handler, key, isCtrl=false, isAlt=false, isShift=false, ) {
  useEffect(() => {
    function onKeyDown(e) {
      if (
        (!!e.ctrlKey === isCtrl) &&
        (!!e.altKey === isAlt) &&
        (!!e.shiftKey === isShift) &&
        e.key.toLowerCase() === key.toLowerCase()
      ) {
        handler(e);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handler, key, isCtrl, isAlt, isShift]);
}
