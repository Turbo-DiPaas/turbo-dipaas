import {useCallback, useEffect, useRef, useState} from 'react';
import ReactFlow, {
   addEdge,
   Background,
   BackgroundVariant,
   useEdgesState,
   useNodesState,
   useReactFlow
} from 'react-flow-renderer';
import {useDispatch, useSelector} from 'react-redux'
import {setActivityCatalog, setSelectedNodeData, setResourceCatalog, setWorkflow} from '../redux/reducers/workspaceNode'
import TextUpdaterNode from './TextUpdaterNode';
import {getActivities} from "../service/designer/Activity";
import {AppStateReducer} from "../types/interface/AppState";
import PropertiesTab from "../component/properties-panel/PropertiesTab";
import ConnectionLine from './ConnectionLine';
import {Activity} from "turbo-dipaas-common/src/types/api/workflow/Activity";
import {ResourceEnum} from "../types/enums/DesignStructEnum";
import {getResources} from "../service/designer/Resource";
import {ActivityEnum} from "../types/enums/DesignStructEnum";

const rfStyle = {
  // backgroundColor: '#EFEFEF',
};

const onPaneClick = (event) => console.log('onPaneClick', event);

const initialNodes = [
  {
    id: '0',
    type: 'input',
    data: {
      label: 'Node',
      id: '0'
    },
    position: { x: 20, y: -5 },
  },
];

let id = 1;
const getId = () => `${id++}`;

// we define the nodeTypes outside of the component to prevent re-renderings
// you could also use useMemo inside the component
const nodeTypes = { textUpdater: TextUpdaterNode };

const fitViewOptions = {
  padding: 7,
};

function Workspace( data :any) {
  const [captureElementClick, setCaptureElementClick] = useState(true);
  const selectedActivityNode = useSelector((state: AppStateReducer) => state.app.selectedActivityNode);
  const workflow = useSelector((state: AppStateReducer) => state.app.workflow);
  const { nodes, setNodes, onNodesChange } = data;


  const onEdgeClick = (event, edge) => {
    console.log(edge)
  }

  const dispatch = useDispatch()
  const onNodeClick = (event, node) => {
    dispatch(setSelectedNodeData(node.data));
  }

  // initialize app on first render
  useEffect(() => {
    getActivities()
       .then((v) => {
         dispatch(setActivityCatalog(v.data?.activities ?? []))
       })
     getResources()
        .then((v) => {
           dispatch(setResourceCatalog(v.data?.resources ?? []))
        })
  }, [])

  // const onNodesChange = useCallback(
  //   (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
  //   [setNodes]
  // );

  ////////////////////
  const reactFlowWrapper = useRef<any>(null);
  const connectingNodeId = useRef(null);
  // const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
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
          eds.concat({ id,type: 'smoothstep', source: connectingNodeId.current as any, target: id })
        );

        const updatedWorkflow = JSON.parse(JSON.stringify(workflow))

        updatedWorkflow.structure.transitions.push({
          id: `${edges.length + 1}`,
          from: `${connectingNodeId.current}`,
          to: id
        })

        dispatch(setWorkflow(updatedWorkflow))
      }
    },
    [project, workflow]
  );

  return (
    <div className="wrapper"  style={{height: '100%',width: '100%', float:'left'}}  ref={reactFlowWrapper}>
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
              onNodeDrag={onNodeClick}
              connectionLineComponent={ConnectionLine as any}
              // nodeTypes={nodeTypes}
              style={rfStyle}
              >
              <Background variant={BackgroundVariant.Lines} />
      </ReactFlow>
    </div>
  );
}

export default Workspace;
