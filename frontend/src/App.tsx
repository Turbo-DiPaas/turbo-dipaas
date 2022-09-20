import React from 'react';
import { ReactFlowProvider } from 'react-flow-renderer';
import './App.css';
import Workspace from './workspace/Workspace';

function App() {
  return (
    <>
      <div style={{height: '500px',width: '1000px', float:'left', minHeight: '160px',maxHeight: '2000px'}}  className="App">
        <ReactFlowProvider>
          <Workspace></Workspace>
        </ReactFlowProvider>
      </div>
      <div>

      </div>
    </>
  );
}

export default App;
