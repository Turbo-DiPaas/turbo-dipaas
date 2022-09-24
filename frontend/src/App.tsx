import React from 'react';
import { ReactFlowProvider, useEdgesState, useNodesState } from 'react-flow-renderer';
import './App.css';
import Workspace from './workspace/Workspace';
import ResourcesPanel from './component/resources-panel/ResourcesPanel';
import ControlsPanel from './component/controls-panel/ControlsPanel';
import { ChakraProvider } from '@chakra-ui/react'
import PropertiesTab from "./component/properties-panel/PropertiesTab";
import {createUseStyles} from 'react-jss'
import Tree from './component/properties-tree/PropertiesTab';
import {RecursiveTree} from "./types/struct/RecursiveTree";
import {useSelector} from "react-redux";
import {AppStateReducer} from "./types/interface/AppState";
import {mapActivitiesResponse} from "./lib/activity/activityResponse";
const useStyles = createUseStyles({
   gridContainer: {
      display: 'grid',
      gridTemplateColumns: '305px 1100px 305px',
      columnGap: '24px',
      padding: '24px 72px 24px 72px',
      '& > div': {
      backgroundColor: 'white',
      borderRadius: '8px',
      }
   },
   propertiesTab: {
      display: 'grid',
      gridTemplateColumns: '305px auto',
      gap: '16px',
      borderRadius: '8px',
      background: 'white',
      float: 'left',
      width: '100%',
      marginTop: '16px',
      marginBottom: '24px',
      padding: '16px',
   },
   treeContainer: {
      width: '300px',
      padding: '16px',
      borderRight: '1px solid #eee'
   }
 })

 const padding16 = {padding: '16px'}

const treeState: {tree: RecursiveTree} = {
   tree: {
     name: "Activities outputs",
     data: [
       {name: "one", data: [{name: "two", data: [{name: "three", data: [{name: "four", data: null}]}]}]},
       {name: "one", data: [{name: "two", data: [{name: "three", data: [{name: "four", data: null}]}]}]},
       {name: "one", data: [{name: "two", data: [{name: "three", data: [{name: "four", data: null}]}]}]}
     ]
   }
 }

const initialNodes = [
   {
     id: 'a0',
     type: 'input',
     data: {
       label: 'Starter node',
       id: 'a0'
     },
     position: { x: -2020, y: -5 },
   },
 ];

 const initailEdges = []


function App() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initailEdges)
    const classes = useStyles();
    const activities = useSelector((state: AppStateReducer) => state.app.workflow.structure.activities);
    const resources = useSelector((state: AppStateReducer) => state.app.workflow.structure.resources);


  return (
     <div>
        <ChakraProvider>
            <div className={classes.gridContainer}>
               <div style={padding16}>
                  <ResourcesPanel/>
               </div>
               <div style={{height: '500px',width: '100%', float:'left'}}>
                  <ReactFlowProvider>
                     <Workspace nodes={nodes} setNodes={setNodes} setEdges={setEdges} edges={edges} onEdgesChange={onEdgesChange} onNodesChange={onNodesChange}></Workspace>
                  </ReactFlowProvider>
               </div>
               <div style={padding16}>
                  <ControlsPanel setNodes={setNodes} setEdges={setEdges} />
               </div>
               <div style={{visibility: 'hidden'}}></div>
               <div className={classes.propertiesTab}>
                     <div className={classes.treeContainer}>
                        <Tree name={treeState.tree.name} data={mapActivitiesResponse(activities, resources)} level={0} />
                     </div>
                     <PropertiesTab setNodes={setNodes} />
               </div>
               <div style={{visibility: 'hidden'}}></div>
            </div>
        </ChakraProvider>
     </div>
  );
}

export default App;
