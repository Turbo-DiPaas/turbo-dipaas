import React from 'react';
import { ReactFlowProvider } from 'react-flow-renderer';
import './App.css';
import Workspace from './workspace/Workspace';

function App() {
  return (
    <>
      <div className="App">
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
