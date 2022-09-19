import { ResourceTypeEnum } from 'turbo-dipaas-common/src/enums/ResourceTypeEnum'
import ResourceBase from "../ResourceBase";
import {AxiosRequestHeaders} from "axios";
import * as url from "url";
import {UrlWithStringQuery} from "url";

export default class HTTPConnectionResource extends ResourceBase {
   constructor(id: string, name: string, type: ResourceTypeEnum, params: Map<string, any>) {
      super(id, name, type, params)
   }

   protected parsedUrl(): UrlWithStringQuery {
      return url.parse(this.getProperty('url'))
   }

   getUrl(): string {
      return `${this.getProtocol()}://${this.getHost()}:${this.getPort()}${this.getPath()}`
         + (this.getQuery().length > 0 ? '?' + this.getQuery() : '')
   }

   getProtocol(): string {
      let parsedProto = this.parsedUrl().protocol
      if (parsedProto?.endsWith(':')) {
         parsedProto = parsedProto?.substring(0, parsedProto?.length - 2)
      }

      return this.getProperty('protocol') ?? parsedProto ?? ''
   }

   getHost(): string {
      return this.getProperty('host') ?? this.parsedUrl().hostname
   }

   getPort(): number {
      const protocol = this.getProtocol() ?? this.parsedUrl().protocol
      return this.getProperty('port') ?? this.parsedUrl().port ?? protocol === 'http' ? 80 : 443
   }

   getPath(): string {
      return this.getProperty('path') ?? this.parsedUrl().path ?? ''
   }

   getQuery(): string {
      return this.getProperty('query') ?? this.parsedUrl().query ?? ''
   }

   getMethod(): string {
      return this.getProperty('method') ?? 'GET'
   }

   getTimeoutInMillis(): number {
      return this.getProperty('timeout') ?? 60000
   }

   getHeaders(): AxiosRequestHeaders {
      return this.getProperty('headers') ?? {}
   }
}
