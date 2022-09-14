import chai, { expect } from 'chai'
import WorkflowContext from "../../../../src/app/WorkflowContext";
import {ActivityResult} from "turbo-dipaas-common/src/types/activity/ActivityResult";
import {evaluateProps, getPlaceholders} from "../../../../src/app/utils/context/contextResolver";

describe('ContextResolver', () => {
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

   it('correctly matches string placeholders', async () => {
      const placeholders = ['xyz.a', 'test.somevalue', '1234.xyz']
      const textToMatch = 'this is ${' + placeholders[0] + '}' + ' just ${' + placeholders[1]
         + '} a ${' + placeholders[2] + '} test. This will not be matched {sdfsd.sdf}'
         + 'This neither ${asdf}, as there is no dot in the middle'
      const result = getPlaceholders(textToMatch)

      expect(result.length).to.be.equal(3)
      expect(result[0]).to.be.equal(placeholders[0])
      expect(result[1]).to.be.equal(placeholders[1])
      expect(result[2]).to.be.equal(placeholders[2])
   })

   it('does nothing when empty props map is passed', async () => {
      const result = evaluateProps(propsToEvaluate, workflowContext)
      expect(result.size).to.be.equal(0)
   })

   it('does nothing to props when no placeholders are passed', async () => {
      propsToEvaluate.set('name', 'xyz')
      propsToEvaluate.set('value', true)
      propsToEvaluate.set('arr', [1,2,3])
      propsToEvaluate.set('test', {})

      const result = evaluateProps(propsToEvaluate, workflowContext)
      expect(result.size).to.be.equal(4)
      expect(result.get('name')).to.be.equal('xyz')
      expect(result.get('value')).to.be.equal(true)
      expect(result.get('arr')).to.eql([1,2,3])
      expect(result.get('test')).to.be.eql({})
   })

   it('properly evaluates passed string props for single activity result', async () => {
      propsToEvaluate.set('name', 'My name is ${a.name} ${a.surname}. My age is ${a.age} yo')
      const result = evaluateProps(propsToEvaluate, workflowContext)
      expect(result.size).to.be.equal(1)
      expect(result.get('name')).to.be.equal('My name is John Wick. My age is 18 yo')
   })

   it('properly evaluates passed string props for multiple activity results', async () => {
      propsToEvaluate.set('name', 'x ${b.isUsed} y ${b.volume}, ${a.name}')
      propsToEvaluate.set('main', 'x ${b.isUsed} y ${a.age}, ${a.surname}')
      const result = evaluateProps(propsToEvaluate, workflowContext)
      expect(result.size).to.be.equal(2)
      expect(result.get('name')).to.be.equal('x true y 1234.5, John')
      expect(result.get('main')).to.be.equal('x true y 18, Wick')
   })

   it('skips nonexisting props', async () => {
      propsToEvaluate.set('name', 'test of ${c.errorresult}, ${b.nonexisting} and ${a.xyz}.')
      const result = evaluateProps(propsToEvaluate, workflowContext)
      expect(result.size).to.be.equal(1)
      expect(result.get('name')).to.be.equal('test of ,  and .')
   })
})