import {expect} from 'chai'
import WorkflowContext from "../../../../../src/app/WorkflowContext";
import {ActivityResult} from "../../../../../../common/src/types/activity/ActivityResult";
import HTTPConnectionResource from "../../../../../src/lib/resource/http/HTTPConnectionResource";
import {ResourceTypeEnum} from "../../../../../../common/src/enums/ResourceTypeEnum";
import Container from "typedi";
import HTTPRequestReplyActivity from "../../../../../src/lib/activity/workflow/impl/http/HTTPRequestReplyActivity";
import {testSetup} from "../../../../testSetup";

describe('HTTPRequestReplyActivity', () => {
    testSetup()
    const baseUrl  = 'https://jsonplaceholder.typicode.com/'
    const httpConnResId = 'http-con'
    const httpConnResId2 = 'http-con2'
    let httpRequestReplyActivity: HTTPRequestReplyActivity
    const context = new WorkflowContext()
    const returnData: Map<string, any> = new Map()
    const httpParams: Map<string, any> = new Map()
    const httpParams2: Map<string, any> = new Map()
    httpParams.set('url', baseUrl + 'todos/1')
    httpParams2.set('url', baseUrl + 'todos/2')
    const httpConnection = new HTTPConnectionResource(httpConnResId, 'http connection resource', ResourceTypeEnum.HTTPConnection, httpParams)
    const httpConnection2 = new HTTPConnectionResource(httpConnResId, 'http connection resource', ResourceTypeEnum.HTTPConnection, httpParams2)

    Container.set([{id: httpConnResId, value: httpConnection}])
    Container.set([{id: httpConnResId2, value: httpConnection2}])

    returnData.set('id', 10)
    returnData.set('uri', '"todos"')

    const activityResult = {
        status: 200,
        returnData
    } as ActivityResult

    context.addActivityResult('a', activityResult)

    beforeEach(() => {
        httpRequestReplyActivity = new HTTPRequestReplyActivity('b', 'http activity', new Map(), [httpConnResId2])
    })

    it('properly executes basic http', async () => {
        const response = await httpRequestReplyActivity.invoke(context)
        const responseData = response.returnData
        const responseJson = responseData.get('dataJson')

        expect(response.status).to.be.equal(200)
        expect(response.error).to.be.undefined
        expect(responseJson).to.not.be.undefined
        expect(responseData.get('dataRaw')).to.be.undefined
        expect(responseData.get('headers')).to.not.be.undefined
        expect(responseJson.id).to.be.equal(2)
        expect(responseJson.completed).to.be.false
        expect(responseJson.title.length > 0).to.be.true
    })
})
