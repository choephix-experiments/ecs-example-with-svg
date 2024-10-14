import { useCallback, useEffect, useRef } from "react";

export const useAnimationFrame = (callback: (deltaTime: number) => void) => {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  const animate = useCallback((time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = (time - previousTimeRef.current) / 1000;
      callback(deltaTime);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }, [callback]);

  useEffect(() => {
    console.log("🚀 Starting animation frame loop");
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      console.log("🛑 Stopping animation frame loop");
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate]);
};