import ResponseContent from "../../types/interface/ResponseContent";
import {callService} from "../ServiceBase";
import {Workflow} from "turbo-dipaas-common/src/types/api/workflow/Workflow";

export type CreateWorkflowResponse = {
   id: string
}

const createWorkflow = async (workflow: Workflow): Promise<ResponseContent<CreateWorkflowResponse>> => {
   const requestOptions: RequestInit = {
      method: "POST",
      body: JSON.stringify(workflow),
      headers: {
         "Content-Type": 'application/json'
      }
   }

   return callService<CreateWorkflowResponse>('runner/workflows', requestOptions)
}

const runWorkflow = async (id: string): Promise<ResponseContent<any>> => {
   const requestOptions: RequestInit = {
      method: "POST",
   }

   return callService<any>(`runner/workflows/${id}/start`, requestOptions)
}

const stopWorkflow = async (id: string): Promise<ResponseContent<any>> => {
   const requestOptions: RequestInit = {
      method: "POST",
   }

   return callService<any>(`runner/workflows/${id}/stop`, requestOptions)
}
const getWorkflowLogs = async (id: string): Promise<ResponseContent<any>> => {
   const requestOptions: RequestInit = {
      method: "GET",
   }

   return callService<any>(`runner/workflows/${id}/logs`, requestOptions)
}

export { createWorkflow, runWorkflow, stopWorkflow, getWorkflowLogs }
