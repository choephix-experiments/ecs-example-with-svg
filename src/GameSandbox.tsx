import React, { useCallback, useEffect, useState } from "react";
import { useSnapshot } from "valtio";

import { EntityInspector } from "./components/gui/EntityInspector";
import { WorldStateInspector } from "./components/gui/WorldStateInspector";
import { PromptBar } from "./components/ide/PromptBar";
import { RenderedEntity } from "./components/svg/RenderedEntity";
import { SelectionBox } from "./components/svg/SelectionBox";
import { StageBounds } from "./components/svg/StageBounds";
import { StageGrid } from "./components/svg/StageGrid";
import { entityResolver } from "./resolvers/entityResolver";
import { ideStateActions, useGetSelectedEntities } from "./stores/ideStore";
import { worldDataState } from "./stores/worldDataState";
import { ReadonlyDeep, StageEntityProps } from "./types/data-types";
import { useAnimationFrame } from "./utils/hooks/useAnimationFrame";
import { DebugDataInspector } from "./components/gui/DebugDataInspector";
import { HoverBox } from "./components/svg/HoverBox";

export default function GameSandbox() {
  useAnimationFrame((deltaTime, totalTime) => {
    for (const entity of worldDataState.entities) {
      entityResolver.onTick(entity, deltaTime, totalTime);
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
      const viewBoxWidth = Math.round(innerWidth / scale);
      const viewBoxHeight = Math.round(innerHeight / scale);

      // Calculate offsets based on anchor points
      const offsetX =
        Math.round(-viewBoxWidth * anchor[0] + stage.width * (anchor[0] - 0.5));
      const offsetY =
        Math.round(-viewBoxHeight * anchor[1] + stage.height * (anchor[1] - 0.5));

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
      <StageGrid />
      <StageBounds />
      <EntitiesGroup />
      <SelectionBoxes />
    </svg>
  );
};

export const EntitiesGroup: React.FC = () => {
  const { entities } = useSnapshot(worldDataState);
  const [hoveredEntityId, setHoveredEntityId] = useState<string | null>(null);

  const handleEntityClick = useCallback(
    (entity: ReadonlyDeep<StageEntityProps>, event: React.MouseEvent) => {
      event.stopPropagation();
      ideStateActions.toggleEntitySelection(entity.uuid, event.ctrlKey);
    },
    []
  );

  const handleEntityMouseEnter = useCallback((entityId: string) => {
    setHoveredEntityId(entityId);
  }, []);

  const handleEntityMouseLeave = useCallback(() => {
    setHoveredEntityId(null);
  }, []);

  return (
    <g fill="#ddd" stroke="black" strokeWidth={1}>
      {entities.map((entity) => (
        <g
          className="with-shadow"
          key={entity.uuid}
          onMouseEnter={() => handleEntityMouseEnter(entity.uuid)}
          onMouseLeave={handleEntityMouseLeave}
        >
          <RenderedEntity entity={entity} onClick={handleEntityClick} />
          {hoveredEntityId === entity.uuid && <HoverBox entity={entity} />}
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
      <WorldStateInspector />
      <DebugDataInspector />
      <div className="absolute top-4 right-4 max-w-md max-h-[calc(100vh-2rem)] overflow-y-auto">
        {selectedEntities.map((entity) => (
          <EntityInspector entity={entity} key={`selection-${entity.uuid}`} />
        ))}
      </div>
      <PromptBar />
    </>
  );
};
