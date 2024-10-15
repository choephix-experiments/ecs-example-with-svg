import React from 'react';
import { ReadonlyDeep, StageEntityProps } from "../../types/data-types";

interface EntityInspectorProps {
  entity: ReadonlyDeep<StageEntityProps>;
}

const PropertyRow: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="flex justify-between items-center py-1">
    <span className="text-gray-600 text-xs">{label}</span>
    <span className="font-mono text-xs">{value}</span>
  </div>
);

const BehaviorSection: React.FC<{ behavior: ReadonlyDeep<StageEntityProps['behaviors'][0]> }> = ({ behavior }) => (
  <div className="mt-2 border-t border-gray-200 pt-2">
    <div className="flex justify-between items-center">
      <span className="font-semibold text-xs">{behavior.type}</span>
      {behavior.name && <span className="text-xs text-gray-500">{behavior.name}</span>}
    </div>
    {Object.entries(behavior).map(([key, value]) => {
      if (key !== 'type' && key !== 'name' && key !== 'uuid') {
        return <PropertyRow key={key} label={key} value={JSON.stringify(value)} />;
      }
      return null;
    })}
  </div>
);

export function EntityInspector({ entity }: EntityInspectorProps) {
  console.log('🔍 Rendering EntityInspector', { entity });

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-300 shadow-md mb-2 max-w-xs">
      {entity.name && (
        <h2 className="text-lg font-bold mb-2 truncate" title={entity.name}>
          {entity.name}
        </h2>
      )}
      <div className="mb-2">
        {/* <PropertyRow label="" value={entity.uuid} /> */}
        <PropertyRow label="x" value={entity.x.toFixed(2)} />
        <PropertyRow label="y" value={entity.y.toFixed(2)} />
        <PropertyRow label="rotation" value={entity.rotation.toFixed(2)} />
        <PropertyRow label="scale" value={entity.scale.toFixed(2)} />
      </div>
      <div className="mt-3">
        {entity.behaviors.map((behavior, index) => (
          <BehaviorSection key={behavior.uuid || index} behavior={behavior} />
        ))}
      </div>
    </div>
  );
}

// export function EntityInspector({ entity }: EntityInspectorProps) {
//   return (
//     <div className="absolute top-4 right-4 bg-white p-4 rounded-lg border border-gray-300 shadow-md">
//       <h2 className="text-lg font-bold mb-2">Selected Entity</h2>
//       <p>ID: {entity.uuid}</p>
//       <p>X: {entity.x.toFixed(2)}</p>
//       <p>Y: {entity.y.toFixed(2)}</p>
//       <p>Rotation: {entity.rotation.toFixed(2)}</p>
//       <p>Scale: {entity.scale.toFixed(2)}</p>
//       <h3 className="font-bold mt-2">Behaviors:</h3>
//       <ul>
//         {entity.behaviors.map((behavior, index) => (
//           <li key={index}>{behavior.type}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }
