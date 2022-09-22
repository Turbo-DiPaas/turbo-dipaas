import React from 'react';
import { ReactFlowProvider } from 'react-flow-renderer';
import './App.css';
import Workspace from './workspace/Workspace';
import ResourcesPanel from './component/resources-panel/ResourcesPanel';
import ControlsPanel from './component/controls-panel/ControlsPanel';
import { ChakraProvider } from '@chakra-ui/react'
import PropertiesTab from "./component/properties-panel/PropertiesTab";
import {createUseStyles} from 'react-jss'
const useStyles = createUseStyles({
   gridContainer: {
      display: 'grid',
      gridTemplateColumns: '305px 1100px 305px',
      gap: '24px',
      padding: '24px 72px 24px 72px',
      '& > div': {
      backgroundColor: 'white',
      borderRadius: '8px',
      }
   },
   propertiesTab: {
      borderRadius: '8px',
      background: 'white',
      float: 'left',
      width: '100%',
      marginTop: '16px',
      padding: '16px',
   },
 })

 const padding16 = {padding: '16px'}

function App() {
   const classes = useStyles()
  return (
     <div>
        <ChakraProvider>
            <div className={classes.gridContainer}>
               <div style={padding16}>
                  <ResourcesPanel/>
               </div>
               <div style={{height: '500px',width: '100%', float:'left'}}>
                  <ReactFlowProvider>
                     <Workspace></Workspace>
                  </ReactFlowProvider>
                  <div className={classes.propertiesTab}>
                     <PropertiesTab />
                  </div>
               </div>
               <div style={padding16}>
                  <ControlsPanel/>
               </div>
            </div>
        </ChakraProvider>
     </div>
  );
}

export default App;
