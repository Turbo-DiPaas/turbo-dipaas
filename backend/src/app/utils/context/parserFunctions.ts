// @ts-ignore
import mozjexl from 'mozjexl';
import xml2json from 'xml2json'

const addFunctions = () => {
   mozjexl.addTransform('optional', function(val: string) {
      if (val === null || typeof val === 'undefined') {
         return ''
      }
      return val
   });

   mozjexl.addTransform('xml', function(val: string) {
      return xml2json.toJson(val, {object: true});
   });

   mozjexl.addTransform('parseint', function(val: string) {
      return parseInt(val, 10)
   });

   mozjexl.addTransform('parsejson', function(val: string) {
      return JSON.parse(val)
   });

   mozjexl.addTransform('length', function(val: string) {
      return val.length
   });
}

export {addFunctions}