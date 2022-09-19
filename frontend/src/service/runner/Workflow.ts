import ResponseContent from "../../types/interface/ResponseContent";
import {callService} from "../ServiceBase";
import {Workflow} from "turbo-dipaas-common/src/types/api/workflow/Workflow";

const createWorkflow = async (workflow: Workflow): Promise<ResponseContent<Workflow>> => {
   const requestOptions: RequestInit = {
      method: "POST",
      body: JSON.stringify(workflow),
   }

   return callService<Workflow>('runner/workflows', requestOptions)
}

export { createWorkflow }
