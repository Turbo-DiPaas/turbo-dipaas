import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import {AppState, NodeData} from "../../types/interface/AppState";
import {ActivityDetailsStruct} from "turbo-dipaas-common/src/types/api/design/ActivityStruct";
import {ResourceDetailsStruct} from "turbo-dipaas-common/src/types/api/design/ResourceStruct";
import {Workflow} from "turbo-dipaas-common/src/types/api/workflow/Workflow";

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

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setBlockData: (state, action: PayloadAction<NodeData>) => {
      state.selectedActivityNode = action.payload
    },

    setActivityCatalog: (state, action: PayloadAction<ActivityDetailsStruct[]>) => {
      state.activityCatalog = action.payload
    },

    setResourceCatalog: (state, action: PayloadAction<ResourceDetailsStruct[]>) => {
      state.resourcesCatalog = action.payload
    },

    setWorkflow: (state, action: PayloadAction<Workflow>) => {
      state.workflow = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  setBlockData,
  setResourceCatalog,
  setActivityCatalog,
   setWorkflow
} = appSlice.actions

export default appSlice.reducer
  