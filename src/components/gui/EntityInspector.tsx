import { ReadonlyDeep, StageEntityProps } from "../../types/data-types";
import YAML from 'yaml';

interface EntityInspectorProps {
  entity: ReadonlyDeep<StageEntityProps>;
}

export function EntityInspector({ entity }: EntityInspectorProps) {
  const yamlString = YAML.stringify(entity);

  return (
    <div className="absolute top-4 right-4 bg-white p-4 rounded-lg border border-gray-300 shadow-md">
      <h2 className="text-lg font-bold mb-2">Selected Entity</h2>
      <pre className="text-xs whitespace-pre-wrap">{yamlString}</pre>
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
