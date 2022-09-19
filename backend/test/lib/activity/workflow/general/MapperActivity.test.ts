import chai, { expect } from 'chai'
import WorkflowContext from "../../../../../src/app/WorkflowContext";
import MapperActivity from "../../../../../src/lib/activity/workflow/impl/general/MapperActivity";
import {ActivityResult} from "../../../../../../common/src/types/activity/ActivityResult";

describe('Mapper Activity', () => {
    let mapperActivity: MapperActivity
    const context = new WorkflowContext()
    const returnData: Map<string, any> = new Map()
    const returnData2: Map<string, any> = new Map()

    returnData.set('size', 20)
    returnData.set('arr', [10, 20, 30])
    returnData.set('obj', {
        name: 'testobject',
        data: {
            first: true,
            params: [
               'red',
               'yellow'
            ],
            some: [
                {
                    name: 'someparam'
                },
                {
                    name: 'someparam2'
                }
            ]
        }
    })
    returnData.set('doc', `
    <root>
        <employee>
            <name>John</name>
            <lastname>Wick</lastname>
            <age>25</age>
        </employee>
        <employee>
            <name>Karen</name>
            <lastname>Dough</lastname>
            <age>53</age>
        </employee>
    </root>
    `)

    returnData2.set('weight', 50.1)
    returnData2.set('isUpper', true)
    returnData2.set('arr', [150, 230, 390])

    const activityResult = {
        status: 200,
        returnData
    } as ActivityResult

    const activityResult2 = {
        status: 200,
        returnData: returnData2
    } as ActivityResult

    context.addActivityResult('a', activityResult)
    context.addActivityResult('b', activityResult2)

    beforeEach(() => {
        mapperActivity = new MapperActivity('a', 'mapper activity')
    })

    it('properly runs without an error', async () => {
        mapperActivity.params.set('test', '""')
        mapperActivity.params.set('xyz', 'a.size')
        const result = await mapperActivity.invoke(context)
        expect(result.error).to.be.undefined
        expect(result.status).to.be.equal(200)
        expect(result.returnData.size).to.be.equal(2)
    })

    it('maps xml correctly', async () => {
        mapperActivity.params.set('emp-0-age', 'a.doc|xml.root.employee[0].age|parseint')
        mapperActivity.params.set('emp-0-name', 'a.doc|xml.root.employee[0].name')
        mapperActivity.params.set('emp-1-age', 'a.size + b.weight + a.doc|xml.root.employee[0].age|parseint')
        mapperActivity.params.set('emp-1-name', 'a.doc|xml.root.employee[1].name + " X"')
        mapperActivity.params.set('emp-search-name', 'a.doc|xml.root.employee[.age > 30].lastname')

        const result = await mapperActivity.invoke(context)
        const returnData = result.returnData

        expect(result.status).to.be.equal(200)
        expect(result.error).to.be.undefined

        expect(returnData.size).to.be.equal(5)

        expect(returnData.get('emp-0-age')).to.be.equal(25)
        expect(returnData.get('emp-0-name')).to.be.equal('John')
        expect(returnData.get('emp-1-age')).to.be.equal(95.1)
        expect(returnData.get('emp-1-name')).to.be.equal('Karen X')
        expect(returnData.get('emp-search-name')).to.be.equal('Dough')
    })

    it('evaluates simple json parameters properly', async () => {
        mapperActivity.params.set('a-size', 'a.size')
        mapperActivity.params.set('a-arr', 'a.arr')
        mapperActivity.params.set('a-obj-data-first', 'a.obj.data.first')
        mapperActivity.params.set('b-weight', 'b.weight')
        mapperActivity.params.set('a-obj-data-params', 'a.obj.data.params')
        mapperActivity.params.set('a-obj-data-some-params', 'a.obj.data.some[0].name')

        const result = await mapperActivity.invoke(context)
        const returnData = result.returnData

        expect(result.status).to.be.equal(200)
        expect(result.error).to.be.undefined

        expect(returnData.size).to.be.equal(6)
        expect(returnData.get('a-size')).to.be.equal(20)
        expect(returnData.get('a-arr')).to.be.eql([10,20,30])
        expect(returnData.get('a-obj-data-first')).to.be.true
        expect(returnData.get('b-weight')).to.be.equal(50.1)
        expect(returnData.get('a-obj-data-params')).to.be.eql(['red', 'yellow'])
        expect(returnData.get('a-obj-data-some-params')).to.be.equal('someparam')
    })

    it('evaluates logic for parameters properly', async () => {
        mapperActivity.params.set('a-size', 'a.size > 500')
        mapperActivity.params.set('a-arr', 'a.arr[a.arr|length - 1]')
        mapperActivity.params.set('a-obj-data-first', 'a.obj.data.first == false')
        mapperActivity.params.set('b-weight', 'b.weight + a.size + a.doc|xml.root.employee[0].age|parseint')
        mapperActivity.params.set('a-obj-data-params', 'a.obj.data.params[1] + " " +  a.obj.data.some[0].name')
        mapperActivity.params.set('a-obj-data-some-params', 'a.obj.data.some[0].name|length')

        const result = await mapperActivity.invoke(context)
        const returnData = result.returnData

        expect(result.status).to.be.equal(200)
        expect(result.error).to.be.undefined

        expect(returnData.size).to.be.equal(6)
        expect(returnData.get('a-size')).to.be.equal(false)
        expect(returnData.get('a-arr')).to.be.equal(30)
        expect(returnData.get('a-obj-data-first')).to.be.false
        expect(returnData.get('b-weight')).to.be.equal(95.1)
        expect(returnData.get('a-obj-data-params')).to.be.eql('yellow someparam')
        expect(returnData.get('a-obj-data-some-params')).to.be.equal(9)
    })
})
