import {ActivityDetailsStruct} from "turbo-dipaas-common/src/types/api/design/ActivityStruct";
import {ResourceDetailsStruct} from "turbo-dipaas-common/src/types/api/design/ResourceStruct";
import {Workflow} from "turbo-dipaas-common/src/types/api/workflow/Workflow";

//this is wrapped type used by app reducer only. Please note that it's called "app", hence the name here
export interface AppStateReducer {
   app: AppState
}

export type NodeData = {
   id: string,
   label: string,
   position?: {
      x: number,
      y: number,
   }
}

export type EdgeData = NodeData & {
   fromId: string,
   toId: string,
}

export interface AppState {
   selectedActivityNode?: NodeData,
   activityCatalog: ActivityDetailsStruct[],
   resourcesCatalog: ResourceDetailsStruct[],
   workflow: Workflow
}
