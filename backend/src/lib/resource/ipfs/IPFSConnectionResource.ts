import ResourceBase from "../ResourceBase";
import {create, IPFSHTTPClient} from "ipfs-http-client";
import { ResourceTypeEnum } from 'turbo-dipaas-common/src/enums/ResourceTypeEnum'

export default class IPFSConnectionResource extends ResourceBase {
    constructor(id: string, name: string, type: ResourceTypeEnum, params: Map<string, any>) {
        super(id, name, type, params);
    }

    getClient(): IPFSHTTPClient {
        return create({
            url: this.params.get('url')
        })
    }

}