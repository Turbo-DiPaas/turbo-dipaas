import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './redux/reducers/workspaceNode';

const initialState = { counter: {value: 0, blockData: {label: 'example'} }};

export default configureStore({
  preloadedState: initialState as any,
  reducer: {
    counter: counterReducer,
  },
})