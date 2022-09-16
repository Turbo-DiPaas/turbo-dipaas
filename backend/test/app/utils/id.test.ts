import chai, { expect } from 'chai'
import {generateId} from "../../../src/app/utils/id";

describe('ID', () => {
   it('correctly generates random id', async () => {
      const idsSet = new Set()
      const idsToGenerate = 10000

      for(let i = 0; i < idsToGenerate; i++) {
         const generatedId = generateId()
         idsSet.add(generatedId)

         expect(generatedId.length).to.be.equal(20)
      }

      // expect all values to be unique
      expect(idsSet.size).to.be.equal(idsToGenerate)
   })

   it('allows to override length', async () => {
      const generatedIds = [
         generateId(200),
         generateId(2),
         generateId(59),
         generateId(48),
         generateId(2300),
      ]

      expect(generatedIds[0].length).to.be.equal(200)
      expect(generatedIds[1].length).to.be.equal(2)
      expect(generatedIds[2].length).to.be.equal(59)
      expect(generatedIds[3].length).to.be.equal(48)
      expect(generatedIds[4].length).to.be.equal(2300)
   })
})
