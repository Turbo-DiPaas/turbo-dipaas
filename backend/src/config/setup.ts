import 'reflect-metadata'
import Container from 'typedi'
import constants from './constants'

/**
*  Setup script
*/
const setup = () => {
   // === set injection engine
   // We don't use constructor injection, as we depend on interfaces, not implementation (SOLID :-) ).
   // And because intefaces are just TS syntactic sugar, we cannot inject them, and have to inject real implementation.
   // So we make it in this one place to detach implementation from functionality
   Container.set([
      // { id: constants.ids.model, value: new Model()},
   ])

   // we set container many times to set injection deps properly

   Container.set([
      // { id: constants.ids.service, value: new ServiceImpl()},
   ])

}

export default setup
