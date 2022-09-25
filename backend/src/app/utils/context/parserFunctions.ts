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

   mozjexl.addTransform('stringify', function(val: string) {
      const parsed = JSON.parse(val)
      return parsed ? JSON.stringify(parsed) : val
   });

   mozjexl.addTransform('length', function(val: string) {
      return val.length
   });

   mozjexl.addBinaryOp('<ifabsent>', 20, function(left: string, right: string) {
      if (left === null || typeof left === 'undefined') {
         return left
      }
      return right
   });
}

export {addFunctions}