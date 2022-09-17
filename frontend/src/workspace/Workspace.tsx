import { useCallback, useRef, useState } from 'react';
import ReactFlow, { addEdge, applyEdgeChanges, applyNodeChanges, Node, Position, useEdgesState, useNodesState, useReactFlow } from 'react-flow-renderer';
import { useSelector, useDispatch } from 'react-redux'
import { incrementByAmount, setBlockData } from '../redux/reducers/workspaceNode'

import TextUpdaterNode from './TextUpdaterNode';

const rfStyle = {
  backgroundColor: '#EFEFEF',
};

const onPaneClick = (event) => console.log('onPaneClick', event);

const initialNodes = [
  {
    id: '0',
    type: 'input',
    data: { label: 'Node' },
    position: { x: 0, y: -4001 },
  },
];

let id = 1;
const getId = () => `${id++}`;

// const initialNodes: Node[] = [
//   { id: 'node-1', type: 'textUpdater', position: { x: 0, y: -400 }, data: { value: 123 } },
//   {
//     id: 'node-2',
//     type: 'output',
//     targetPosition: Position.Top,
//     position: { x: 0, y: -300 },
//     data: { label: 'node 2' },
//   },
//   {
//     id: 'node-3',
//     type: 'output',
//     targetPosition: Position.Top,
//     position: { x: 200, y: -300 },
//     data: { label: 'node 3' },
//   },
// ];

// const initialEdges = [
//   { id: 'edge-1', source: 'node-1', target: 'node-2', sourceHandle: 'a' },
//   { id: 'edge-2', source: 'node-1', target: 'node-3', sourceHandle: 'b' },
// ];

// we define the nodeTypes outside of the component to prevent re-renderings
// you could also use useMemo inside the component
const nodeTypes = { textUpdater: TextUpdaterNode };

const fitViewOptions = {
  padding: 10,
};

function Workspace() {
  // const [nodes, setNodes] = useState(initialNodes);
  // const [edges, setEdges] = useState(initialEdges);
  const [captureElementClick, setCaptureElementClick] = useState(true);
  const count = useSelector((state: any) => state.counter.value);
  const blockData = useSelector((state: any) => state.counter.blockData);
  const dispatch = useDispatch()
  const onNodeClick = (event, node) => {
    dispatch(incrementByAmount(2));
    dispatch(setBlockData(node.data.label));
  } 

  // const onNodesChange = useCallback(
  //   (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
  //   [setNodes]
  // );

  ////////////////////
  const reactFlowWrapper = useRef<any>(null);
  const connectingNodeId = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { project } = useReactFlow();
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  const onConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);

  const onConnectStop = useCallback(
    (event) => {
      const targetIsPane = event.target.classList.contains('react-flow__pane');

      if (targetIsPane) {
        // we need to remove the wrapper bounds, in order to get the correct position
        const { top, left } = reactFlowWrapper.current.getBoundingClientRect();
        const id = getId();
        const newNode = {
          id,
          // we are removing the half of the node width (75) to center the new node
          position: project({ x: event.clientX - left - 75, y: event.clientY - top }),
          data: { label: `Node ${id}` },
        };

        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) =>
          eds.concat({ id, source: connectingNodeId.current as any, target: id })
        );
      }
    },
    [project]
  );
  

  return (
    <div className="wrapper"  style={{height: '500px',width: '1300px'}}  ref={reactFlowWrapper}>
      <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onConnectStart={onConnectStart}
              onConnectStop={onConnectStop}
              fitView
              fitViewOptions={fitViewOptions}
        // nodes={nodes}
        // edges={edges}
        // onNodesChange={onNodesChange}
        onNodeClick={captureElementClick ? onNodeClick : undefined}
        // nodeTypes={nodeTypes}
        style={rfStyle}
      />
      <span>{count}</span>
      <br/>
      <span>{blockData?.label}</span>
    </div>
  );
}

export default Workspace;
