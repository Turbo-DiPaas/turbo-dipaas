import { URL } from "url";
import { ResourceTypeEnum } from 'turbo-dipaas-common/src/enums/ResourceTypeEnum'
import ResourceBase from "./ResourceBase";

export default class HTTPConnectionResource extends ResourceBase {
   constructor(id: string, name: string, type: ResourceTypeEnum, params: Map<string, any>) {
      super(id, name, type, params)
   }

   getUrl(): URL {
      return this.getProperty('url')
   }
}
