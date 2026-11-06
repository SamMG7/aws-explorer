import { Handle, Position } from '@xyflow/react';
import type { Side } from '../../types/scenario';

const SIDES: Array<{ side: Side; position: Position }> = [
  { side: 'top', position: Position.Top },
  { side: 'right', position: Position.Right },
  { side: 'bottom', position: Position.Bottom },
  { side: 'left', position: Position.Left },
];

/** Un handle de origen y uno de destino por lado; invisibles, solo anclan conexiones. */
export function NodeHandles() {
  return (
    <>
      {SIDES.map(({ side, position }) => (
        <Handle key={`s-${side}`} id={`s-${side}`} type="source" position={position} className="aws-handle" isConnectable={false} />
      ))}
      {SIDES.map(({ side, position }) => (
        <Handle key={`t-${side}`} id={`t-${side}`} type="target" position={position} className="aws-handle" isConnectable={false} />
      ))}
    </>
  );
}
