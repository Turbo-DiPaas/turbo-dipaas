import { ActivityResult } from 'turbo-dipaas-common/src/types/activity/ActivityResult'
import WorkflowActivity from "../../WorkflowActivity";
import IPFSConnectionResource from "../../../../resource/ipfs/IPFSConnectionResource";
import all from 'it-all'

export default class IPFSAddFileActivity extends WorkflowActivity {
    constructor(id: string, name: string, params: Map<string, any> = new Map(), resourceIds: string[] = []) {
        super(id, name, params, resourceIds);
    }

    protected run(params: Map<string, any> = this.params): Promise<ActivityResult> {
        const ipfsConnectionResource = this.getResource(IPFSConnectionResource)
        const cid = this.params.get('cid')
        const activityResult = {
            status: 200,
            returnData: new Map()
        } as ActivityResult

        return all(ipfsConnectionResource!.getClient().ls(cid)).then(response => {
            activityResult.returnData.set('response', response)
            return activityResult
        }).catch(err => {
            activityResult.status = 500
            activityResult.error = err
            return activityResult
        })
    }

}