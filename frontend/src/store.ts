import { configureStore } from '@reduxjs/toolkit';
import appReducer from './redux/reducers/workspaceNode';
import {AppState} from "./types/interface/AppState";

const initialState: AppState = {
  selectedActivityNode: {label: 'example', id: 'xyz'},
  resourcesCatalog: [],
  activityCatalog: [],
  workflow: {
    id: "xyz",
    name: "New workflow",
    updated: new Date().toDateString(),
    description: "New workflow",
    structure: {}
  }
}

// @ts-ignore
window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()

export default configureStore({
  preloadedState: initialState as any,
  reducer: {
    app: appReducer,
  },
})