import { useCallback, useEffect, useRef } from "react";
import { useSnapshot } from "valtio";
import { worldDataState } from "../../stores/worldDataState";

export const useAnimationFrame = (callback: (deltaTime: number, totalTime: number) => void) => {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const { global } = useSnapshot(worldDataState);

  const animate = useCallback((time: number) => {
    if (!startTimeRef.current) startTimeRef.current = time;
    if (previousTimeRef.current !== undefined) {
      const deltaTime = ((time - previousTimeRef.current) / 1000) * global.timeScale;
      const totalTime = ((time - startTimeRef.current) / 1000) * global.timeScale;
      
      callback(deltaTime, totalTime);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }, [callback, global.timeScale]);

  useEffect(() => {
    console.log("🚀 Starting animation frame loop with timeScale:", global.timeScale);
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      console.log("🛑 Stopping animation frame loop");
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate]);
};
