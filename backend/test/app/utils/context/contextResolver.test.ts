import chai, { expect } from 'chai'
import WorkflowContext from "../../../../src/app/WorkflowContext";
import {ActivityResult} from "turbo-dipaas-common/src/types/activity/ActivityResult";
import {evaluateProps} from "../../../../src/app/utils/context/contextResolver";
import setup from '../../../../src/config/setup'

describe('ContextResolver', () => {
   setup()
   let workflowContext: WorkflowContext
   let propsToEvaluate: Map<string, any>
   beforeEach(() => {
      workflowContext = new WorkflowContext()
      propsToEvaluate = new Map()

      const resultMapA: Map<string, any> = new Map()
      resultMapA.set('name', 'John')
      resultMapA.set('surname', 'Wick')
      resultMapA.set('age', 18)

      const resultMapB: Map<string, any> = new Map()
      resultMapB.set('volume', 1234.5)
      resultMapB.set('isUsed', true)
      resultMapB.set('test', ['a', 'b', 'c'])
      resultMapB.set('props', {engine: true, wheels: 4})

      workflowContext.addActivityResult('a', {status: 200, returnData: resultMapA} as ActivityResult)
      workflowContext.addActivityResult('b', {status: 200, returnData: resultMapB} as ActivityResult)
      workflowContext.addActivityResult('c', {status: 500, returnData: new Map<string, any>(), error: new Error('activity invocation was not successful')} as ActivityResult)
   })

   it('does nothing when empty props map is passed', async () => {
      const result = await evaluateProps(propsToEvaluate, workflowContext)
      expect(result.size).to.be.equal(0)
   })

   it('does nothing to props when no placeholders are passed', async () => {
      propsToEvaluate.set('name', '"xyz"')
      propsToEvaluate.set('value', true)
      propsToEvaluate.set('arr', [1,2,3])
      propsToEvaluate.set('test', {})

      const result = await evaluateProps(propsToEvaluate, workflowContext)
      expect(result.size).to.be.equal(4)
      expect(result.get('name')).to.be.equal('xyz')
      expect(result.get('value')).to.be.equal(true)
      expect(result.get('arr')).to.eql([1,2,3])
      expect(result.get('test')).to.be.eql({})
   })

   it('properly evaluates passed string props for single activity result', async () => {
      propsToEvaluate.set('name', '"My name is " + a.name + " " + a.surname + ". My age is " + a.age + " yo"')
      const result = await evaluateProps(propsToEvaluate, workflowContext)
      expect(result.size).to.be.equal(1)
      expect(result.get('name')).to.be.equal('My name is John Wick. My age is 18 yo')
   })

   it('properly evaluates passed string props for multiple activity results', async () => {
      propsToEvaluate.set('name', '"x " + b.isUsed + " y " + b.volume + ", " + a.name')
      propsToEvaluate.set('main', '"x " + b.isUsed + " y " + a.age + ", " + a.surname')
      const result = await evaluateProps(propsToEvaluate, workflowContext)
      expect(result.size).to.be.equal(2)
      expect(result.get('name')).to.be.equal('x true y 1234.5, John')
      expect(result.get('main')).to.be.equal('x true y 18, Wick')
   })

   it('skips nonexisting props', async () => {
      propsToEvaluate.set('name', '"test of " + c.errorresult|optional + ", " + b.nonexisting|optional + " and " + a.xyz|optional + "."')
      const result = await evaluateProps(propsToEvaluate, workflowContext)
      expect(result.size).to.be.equal(1)
      expect(result.get('name')).to.be.equal('test of ,  and .')
   })

   it('invokes self defined function', async () => {
      propsToEvaluate.set('name', '"" + c.errorresult <ifabsent> 20 + ", " + b.nonexisting|optional + " and " + a.xyz|optional + "."')
      propsToEvaluate.set('value', '("" + c.errorresult <ifabsent> 50) + 3')
      propsToEvaluate.set('value2', '(("" + a1.counter <ifabsent> 1) + 2)')

      const result = await evaluateProps(propsToEvaluate, workflowContext)
      expect(result.size).to.be.equal(3)
      expect(result.get('name')).to.be.equal('20,  and .')
      expect(result.get('value')).to.be.equal(53)
      expect(result.get('value2')).to.be.equal(3)
   })
})
