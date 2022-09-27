import { ActivityResult } from 'turbo-dipaas-common/src/types/activity/ActivityResult'
import WorkflowActivity from "../../WorkflowActivity";
import IPFSConnectionResource from "../../../../resource/ipfs/IPFSConnectionResource";

export default class IPFSAddFileActivity extends WorkflowActivity {
    constructor(id: string, name: string, params: Map<string, any> = new Map(), resourceIds: string[] = []) {
        super(id, name, params, resourceIds);
    }

    protected run(params: Map<string, any> = this.params): Promise<ActivityResult> {
        const ipfsConnectionResource = this.getResource(IPFSConnectionResource)
        const fileContent = this.params.get('data')
        const filePath = this.params.get('filePath')
        const activityResult = {
            status: 200,
            returnData: new Map()
        } as ActivityResult

        const file = {
            path: filePath,
            content: Buffer.from(fileContent)
        }

        return ipfsConnectionResource!.getClient().add(file).then(response => {
            console.log(response)
            activityResult.returnData.set('response', response.cid)
            return activityResult
        }).catch(err => {
            activityResult.status = 500
            activityResult.error = err
            return activityResult
        })
    }

}