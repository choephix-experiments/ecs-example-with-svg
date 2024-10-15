import React, { useCallback, useEffect, useState } from "react";
import { useSnapshot } from "valtio";
import { EntityInspector } from "./components/gui/EntityInspector";
import { PromptBar } from "./components/gui/PromptBar";
import { Grid } from "./components/svg/Grid";
import { RenderedEntity } from "./components/svg/RenderedEntity";
import { SelectionBox } from "./components/svg/SelectionBox";
import { EntityResolver } from "./services/EntityResolver";
import { ideStateActions, useGetSelectedEntities } from "./stores/ideStore";
import { worldDataState } from "./stores/worldDataState";
import { ReadonlyDeep, StageEntityProps } from "./types/data-types";
import { useAnimationFrame } from "./utils/hooks/useAnimationFrame";

export default function GameSandbox() {
  useAnimationFrame((deltaTime, totalTime) => {
    for (const entity of worldDataState.entities) {
      EntityResolver.update(entity, deltaTime, totalTime);
    }
  });

  return (
    <div className="w-full h-screen relative overflow-hidden">
      <StageLayer />
      <GUILayer />
    </div>
  );
}

const StageLayer = () => {
  const { stage } = useSnapshot(worldDataState);

  const [viewBox, setViewBox] = useState("0 0 1000 1000");
  const anchor = [0.5, 0.38196601125]; // [x, y] where each value is between 0 and 1

  const handleBackgroundClick = useCallback(() => {
    ideStateActions.clearSelection();
  }, []);

  useEffect(() => {
    const updateViewBox = () => {
      const { innerWidth, innerHeight } = window;
      const scale =
        Math.min(innerWidth / stage.width, innerHeight / stage.height) * 0.8;
      const viewBoxWidth = innerWidth / scale;
      const viewBoxHeight = innerHeight / scale;

      // Calculate offsets based on anchor points
      const offsetX =
        -viewBoxWidth * anchor[0] + stage.width * (anchor[0] - 0.5);
      const offsetY =
        -viewBoxHeight * anchor[1] + stage.height * (anchor[1] - 0.5);

      setViewBox(`${offsetX} ${offsetY} ${viewBoxWidth} ${viewBoxHeight}`);
      console.log(
        "🔍 Updated viewBox:",
        `${offsetX} ${offsetY} ${viewBoxWidth} ${viewBoxHeight}`
      );
    };

    updateViewBox();
    window.addEventListener("resize", updateViewBox);
    return () => window.removeEventListener("resize", updateViewBox);
  }, [stage.width, stage.height, anchor]);

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
      <EntitiesGroup />
      <SelectionBoxes />
    </svg>
  );
};

export const EntitiesGroup: React.FC = () => {
  const { entities } = useSnapshot(worldDataState);

  const handleEntityClick = useCallback(
    (entity: ReadonlyDeep<StageEntityProps>, event: React.MouseEvent) => {
      event.stopPropagation();
      ideStateActions.toggleEntitySelection(entity.uuid, event.ctrlKey);
      console.log("🖱️ Entity clicked:", entity.uuid);
    },
    []
  );

  return (
    <g fill="#ddd" stroke="black" strokeWidth={1}>
      {entities.map((entity) => (
        <g className="with-shadow" key={entity.uuid}>
          <RenderedEntity entity={entity} onClick={handleEntityClick} />
        </g>
      ))}
    </g>
  );
};

const SelectionBoxes = () => {
  const selectedEntities = useGetSelectedEntities();
  return (
    <>
      {selectedEntities.map((entity) => (
        <SelectionBox key={entity.uuid} entity={entity} />
      ))}
    </>
  );
};

const GUILayer = () => {
  const selectedEntities = useGetSelectedEntities();

  return (
    <>
      {selectedEntities.map((entity) => (
        <EntityInspector entity={entity} key={"selection-" + entity.uuid} />
      ))}
      <PromptBar />
    </>
  );
};
