import { useCallback, useState } from 'react';
import ReactFlow, { addEdge, applyEdgeChanges, applyNodeChanges, Node, Position } from 'react-flow-renderer';
import { useSelector, useDispatch } from 'react-redux'
import { incrementByAmount, setBlockData } from '../redux/reducers/workspaceNode'

import TextUpdaterNode from './TextUpdaterNode';

const rfStyle = {
  backgroundColor: '#B8CEFF',
};

const onPaneClick = (event) => console.log('onPaneClick', event);

const initialNodes: Node[] = [
  { id: 'node-1', type: 'textUpdater', position: { x: 0, y: -400 }, data: { value: 123 } },
  {
    id: 'node-2',
    type: 'output',
    targetPosition: Position.Top,
    position: { x: 0, y: -300 },
    data: { label: 'node 2' },
  },
  {
    id: 'node-3',
    type: 'output',
    targetPosition: Position.Top,
    position: { x: 200, y: -300 },
    data: { label: 'node 3' },
  },
];

const initialEdges = [
  { id: 'edge-1', source: 'node-1', target: 'node-2', sourceHandle: 'a' },
  { id: 'edge-2', source: 'node-1', target: 'node-3', sourceHandle: 'b' },
];

// we define the nodeTypes outside of the component to prevent re-renderings
// you could also use useMemo inside the component
const nodeTypes = { textUpdater: TextUpdaterNode };

function Workspace() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [captureZoomClick, setCaptureZoomClick] = useState(true);
  const [captureElementClick, setCaptureElementClick] = useState(true);
  const dispatch = useDispatch()
  const count = useSelector((state: any) => state.counter.value);
  const blockData = useSelector((state: any) => state.counter.blockData);
  const onNodeClick = (event, node) => {
    dispatch(incrementByAmount(2));
    dispatch(setBlockData(node.data.label));
  } 

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  // const onEdgesChange = useCallback(
  //   (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
  //   [setEdges]
  // );
  // const onConnect = useCallback(
  //   (connection) => setEdges((eds) => addEdge(connection, eds)),
  //   [setEdges]
  // );

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onNodeClick={captureElementClick ? onNodeClick : undefined}
        onPaneClick={captureZoomClick ? onPaneClick : undefined}
        // onEdgesChange={onEdgesChange}
        // onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        style={rfStyle}
      />
      <span>{count}</span>
      <br/>
      <span>{blockData?.label}</span>
    </>
  );
}

export default Workspace;
