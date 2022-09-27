import EVMABIResource from "./evm/EVMABIResource";
import GenericEVMConnectionResource from "./evm/GenericEVMConnectionResource";
import HTTPConnectionResource from "./http/HTTPConnectionResource";
import IPFSConnectionResource from "./ipfs/IPFSConnectionResource";

export const ResourceList: any = {
    EVMABIResource,
    GenericEVMConnectionResource,
    HTTPConnectionResource,
    IPFSConnectionResource
}