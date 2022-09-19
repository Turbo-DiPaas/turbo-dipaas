import { useCallback, useRef, useState } from 'react';
import ReactFlow, { addEdge, applyEdgeChanges, applyNodeChanges, Node, Position, useEdgesState, useNodesState, useReactFlow } from 'react-flow-renderer';
import { useSelector, useDispatch } from 'react-redux'
import { incrementByAmount, setBlockData } from '../redux/reducers/workspaceNode'

const rfStyle = {
  backgroundColor: '#EFEFEF',
};

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


const fitViewOptions = {
  padding: 10,
};

function Workspace() {
  const [captureElementClick, setCaptureElementClick] = useState(true);
  const count = useSelector((state: any) => state.counter.value);
  const blockData = useSelector((state: any) => state.counter.blockData);
  const dispatch = useDispatch()
  const onNodeClick = (event, node) => {
    dispatch(incrementByAmount(2));
    dispatch(setBlockData(node.data.label));
  }

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
        onNodeClick={captureElementClick ? onNodeClick : undefined}
        style={rfStyle}
      />
      <span>{count}</span>
      <br/>
      <span>{blockData?.label}</span>
    </div>
  );
}

export default Workspace;
