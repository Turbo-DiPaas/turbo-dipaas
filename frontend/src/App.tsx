import React from 'react';
import { ReactFlowProvider } from 'react-flow-renderer';
import './App.css';
import Workspace from './workspace/Workspace';
import ResourcesPanel from './component/resources-panel/ResourcesPanel';
import ControlsPanel from './component/controls-panel/ControlsPanel';
import { ChakraProvider } from '@chakra-ui/react'
import PropertiesTab from "./component/properties-panel/PropertiesTab";

function App() {
  return (
     <>
        <ChakraProvider>
           <ResourcesPanel/>
           <div style={{height: '500px',width: '1000px', float:'left', minHeight: '160px',maxHeight: '2000px'}}  className="App">
              <ReactFlowProvider>
                 <Workspace></Workspace>
              </ReactFlowProvider>
           </div>
           <ControlsPanel/>
           <PropertiesTab />
        </ChakraProvider>
     </>
  );
}

export default App;
