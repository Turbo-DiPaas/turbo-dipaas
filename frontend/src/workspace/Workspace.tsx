import {useCallback, useEffect, useRef, useState} from 'react';
import ReactFlow, {addEdge, useEdgesState, useNodesState, useReactFlow} from 'react-flow-renderer';
import {useDispatch, useSelector} from 'react-redux'
import {setActivityCatalog, setBlockData, setWorkflow} from '../redux/reducers/workspaceNode'

import TextUpdaterNode from './TextUpdaterNode';
import {getActivities} from "../service/designer/Activity";
import {AppStateReducer} from "../types/interface/AppState";
import PropertiesTab from "../component/properties-panel/PropertiesTab";
import {Activity} from "turbo-dipaas-common/src/types/api/workflow/Activity";
import {ResourceEnum} from "../types/enums/DesignStructEnum";

const rfStyle = {
  backgroundColor: '#EFEFEF',
};

const onPaneClick = (event) => console.log('onPaneClick', event);

const initialNodes = [
  {
    id: '0',
    type: 'input',
    data: {
      label: 'Node',
      id: 'xyz'
    },
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
  const [captureElementClick, setCaptureElementClick] = useState(true);
  const selectedActivityNode = useSelector((state: AppStateReducer) => state.app.selectedActivityNode);
  const workflow = useSelector((state: AppStateReducer) => state.app.workflow);

  const onEdgeClick = (event, edge) => {
    console.log(edge)
  }

  const dispatch = useDispatch()
  const onNodeClick = (event, node) => {
    dispatch(setBlockData(node.data));
  }

  // initialize app on first render
  useEffect(() => {
    getActivities()
       .then((v) => {
         dispatch(setActivityCatalog(v.data?.activities ?? []))
       })
  }, [])

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
        const newNodePosition = project({ x: event.clientX - left - 75, y: event.clientY - top })
        const newNode = {
          id,
          // we are removing the half of the node width (75) to center the new node
          position: newNodePosition,
          data: {
            label: `Node ${id}`,
            id: id
          },
        };

        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) =>
          eds.concat({ id, source: connectingNodeId.current as any, target: id })
        );

        //TODO: add possibility to select the activity
        const updatedWorkflow = JSON.parse(JSON.stringify(workflow))
        updatedWorkflow.structure.activities!.push({
            id: id,
            name: "name",
            type: "LogActivity",
            position: {
              x: newNodePosition.x,
              y: newNodePosition.y
            },
            params: [
              {
                name: 'message',
                value: `"Logging ${id}"`
              }
            ]
          } as Activity)

        updatedWorkflow.structure.transitions!.push({
          id: `${edges.length + 1}`,
          from: `${connectingNodeId.current}`,
          to: id
        })

        //TODO: delete after testing
        if (updatedWorkflow.structure.resources?.length === 0) {
          updatedWorkflow.structure.resources!.push({
               id: 'resttest',
               type: ResourceEnum.EVM_CONNECTION,
               name: 'test res',
               params: []
             },
             {
               id: 'resttest 2',
               type: ResourceEnum.EVM_CONNECTION,
               name: 'test res 2',
               params: []
             }
             )
        }

         console.log(updatedWorkflow.structure)
        dispatch(setWorkflow(updatedWorkflow))
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
              onEdgeClick={captureElementClick ? onEdgeClick : undefined}
              onNodeClick={captureElementClick ? onNodeClick : undefined}
              // nodeTypes={nodeTypes}
              style={rfStyle}
      />
      <PropertiesTab />
    </div>
  );
}

export default Workspace;
