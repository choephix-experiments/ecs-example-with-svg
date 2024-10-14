import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSnapshot } from "valtio";
import { EntityInspector } from "./components/gui/EntityInspector";
import { PromptBar } from "./components/gui/PromptBar";
import { Grid } from "./components/svg/Grid";
import { RenderedEntity } from "./components/svg/RenderedEntity";
import { SelectionBox } from "./components/svg/SelectionBox";
import { EntityResolver } from "./services/EntityResolver";
import { ideStateActions, useGetSelectedEntity } from "./stores/ideStore";
import { worldDataState } from "./stores/worldDataState";
import { ReadonlyDeep, StageEntityProps } from "./types/data-types";

export default function GameSandbox() {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  const onEnterFrame = useCallback((time: number) => {
    if (previousTimeRef.current != undefined) {
      const deltaTime = (time - previousTimeRef.current) / 1000;
      for (const entity of worldDataState.entities) {
        EntityResolver.update(entity, deltaTime);
      }
    }

    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(onEnterFrame);
  }, []);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(onEnterFrame);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [onEnterFrame]);

  return (
    <div className="w-full h-screen relative overflow-hidden">
      <StageLayer />
      <GUILayer />
    </div>
  );
}

const StageLayer = () => {
  const { entities, stage } = useSnapshot(worldDataState);

  const handleEntityClick = useCallback(
    (entity: ReadonlyDeep<StageEntityProps>, event: React.MouseEvent) => {
      event.stopPropagation();
      ideStateActions.setSelectedEntityId(entity.id);
    },
    []
  );

  const handleBackgroundClick = useCallback(() => {
    ideStateActions.setSelectedEntityId(null);
  }, []);

  const [viewBox, setViewBox] = useState("0 0 1000 1000");

  useEffect(() => {
    const updateViewBox = () => {
      const { innerWidth, innerHeight } = window;
      const scale =
        Math.min(innerWidth / stage.width, innerHeight / stage.height) * 0.9;
      const viewBoxWidth = innerWidth / scale;
      const viewBoxHeight = innerHeight / scale;
      setViewBox(
        `${-viewBoxWidth / 2} ${
          -viewBoxHeight / 2
        } ${viewBoxWidth} ${viewBoxHeight}`
      );
    };

    updateViewBox();
    window.addEventListener("resize", updateViewBox);
    return () => window.removeEventListener("resize", updateViewBox);
  }, [stage.width, stage.height]);

  return (
    <svg
      className="w-full h-full"
      viewBox={viewBox}
      onClick={handleBackgroundClick}
    >
      <Grid />
      <rect
        x={-stage.width / 2}
        y={-stage.height / 2}
        width={stage.width}
        height={stage.height}
        fill="none"
        stroke="gray"
        strokeWidth="1"
        strokeDasharray="18,4,18,0"
      />
      <g fill="#ddd" stroke="black" strokeWidth={2.5}>
        {entities.map((entity) => (
          <g className="with-shadow">
            <RenderedEntity
              key={entity.id}
              entity={entity}
              onClick={handleEntityClick}
            />
          </g>
        ))}
      </g>
      <SelectionBoxes />
    </svg>
  );
};

const SelectionBoxes = () => {
  const selectedEntity = useGetSelectedEntity();
  if (!selectedEntity) return null;

  return <SelectionBox entity={selectedEntity} />;
};

const GUILayer = () => {
  const selectedEntity = useGetSelectedEntity();

  return (
    <>
      {selectedEntity && <EntityInspector entity={selectedEntity} />}

      <PromptBar />
    </>
  );
};
