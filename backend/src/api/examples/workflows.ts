import {
    ActivityEnum,
    ResourceEnum,
    TransitionType,
    TriggerActivityEnum
} from 'turbo-dipaas-common/src/enums/DesignStructEnum'
import {Workflow} from 'turbo-dipaas-common/src/types/api/workflow/Workflow'

// @ts-ignore
export const ExampleWorkflows: Workflow[] = [
// @ts-ignore
    { "id": "example-1", "name": "BAYC monitor", "description": "New workflow", "updated": "Sun Sep 25 2022", "structure": { "resources": [ { "type": "EVMABIResource", "name": "(r0) EVM ABI", "id": "r0", "params": [ { "name": "abi", "value": "[ \t{ \t\t\"anonymous\": false, \t\t\"inputs\": [ \t\t\t{ \t\t\t\t\"indexed\": true, \t\t\t\t\"internalType\": \"address\", \t\t\t\t\"name\": \"owner\", \t\t\t\t\"type\": \"address\" \t\t\t}, \t\t\t{ \t\t\t\t\"indexed\": true, \t\t\t\t\"internalType\": \"address\", \t\t\t\t\"name\": \"approved\", \t\t\t\t\"type\": \"address\" \t\t\t}, \t\t\t{ \t\t\t\t\"indexed\": true, \t\t\t\t\"internalType\": \"uint256\", \t\t\t\t\"name\": \"tokenId\", \t\t\t\t\"type\": \"uint256\" \t\t\t} \t\t], \t\t\"name\": \"Approval\", \t\t\"type\": \"event\" \t}, \t{ \t\t\"anonymous\": false, \t\t\"inputs\": [ \t\t\t{ \t\t\t\t\"indexed\": true, \t\t\t\t\"internalType\": \"address\", \t\t\t\t\"name\": \"owner\", \t\t\t\t\"type\": \"address\" \t\t\t}, \t\t\t{ \t\t\t\t\"indexed\": true, \t\t\t\t\"internalType\": \"address\", \t\t\t\t\"name\": \"operator\", \t\t\t\t\"type\": \"address\" \t\t\t}, \t\t\t{ \t\t\t\t\"indexed\": false, \t\t\t\t\"internalType\": \"bool\", \t\t\t\t\"name\": \"approved\", \t\t\t\t\"type\": \"bool\" \t\t\t} \t\t], \t\t\"name\": \"ApprovalForAll\", \t\t\"type\": \"event\" \t}, \t{ \t\t\"anonymous\": false, \t\t\"inputs\": [ \t\t\t{ \t\t\t\t\"indexed\": true, \t\t\t\t\"internalType\": \"address\", \t\t\t\t\"name\": \"from\", \t\t\t\t\"type\": \"address\" \t\t\t}, \t\t\t{ \t\t\t\t\"indexed\": true, \t\t\t\t\"internalType\": \"address\", \t\t\t\t\"name\": \"to\", \t\t\t\t\"type\": \"address\" \t\t\t}, \t\t\t{ \t\t\t\t\"indexed\": true, \t\t\t\t\"internalType\": \"uint256\", \t\t\t\t\"name\": \"tokenId\", \t\t\t\t\"type\": \"uint256\" \t\t\t} \t\t], \t\t\"name\": \"Transfer\", \t\t\"type\": \"event\" \t}, \t{ \t\t\"inputs\": [ \t\t\t{ \t\t\t\t\"internalType\": \"address\", \t\t\t\t\"name\": \"to\", \t\t\t\t\"type\": \"address\" \t\t\t}, \t\t\t{ \t\t\t\t\"internalType\": \"uint256\", \t\t\t\t\"name\": \"tokenId\", \t\t\t\t\"type\": \"uint256\" \t\t\t} \t\t], \t\t\"name\": \"approve\", \t\t\"outputs\": [], \t\t\"stateMutability\": \"nonpayable\", \t\t\"type\": \"function\" \t}, \t{ \t\t\"inputs\": [ \t\t\t{ \t\t\t\t\"internalType\": \"address\", \t\t\t\t\"name\": \"owner\", \t\t\t\t\"type\": \"address\" \t\t\t} \t\t], \t\t\"name\": \"balanceOf\", \t\t\"outputs\": [ \t\t\t{ \t\t\t\t\"internalType\": \"uint256\", \t\t\t\t\"name\": \"balance\", \t\t\t\t\"type\": \"uint256\" \t\t\t} \t\t], \t\t\"stateMutability\": \"view\", \t\t\"type\": \"function\" \t}, \t{ \t\t\"inputs\": [ \t\t\t{ \t\t\t\t\"internalType\": \"uint256\", \t\t\t\t\"name\": \"tokenId\", \t\t\t\t\"type\": \"uint256\" \t\t\t} \t\t], \t\t\"name\": \"getApproved\", \t\t\"outputs\": [ \t\t\t{ \t\t\t\t\"internalType\": \"address\", \t\t\t\t\"name\": \"operator\", \t\t\t\t\"type\": \"address\" \t\t\t} \t\t], \t\t\"stateMutability\": \"view\", \t\t\"type\": \"function\" \t}, \t{ \t\t\"inputs\": [ \t\t\t{ \t\t\t\t\"internalType\": \"address\", \t\t\t\t\"name\": \"owner\", \t\t\t\t\"type\": \"address\" \t\t\t}, \t\t\t{ \t\t\t\t\"internalType\": \"address\", \t\t\t\t\"name\": \"operator\", \t\t\t\t\"type\": \"address\" \t\t\t} \t\t], \t\t\"name\": \"isApprovedForAll\", \t\t\"outputs\": [ \t\t\t{ \t\t\t\t\"internalType\": \"bool\", \t\t\t\t\"name\": \"\", \t\t\t\t\"type\": \"bool\" \t\t\t} \t\t], \t\t\"stateMutability\": \"view\", \t\t\"type\": \"function\" \t}, \t{ \t\t\"inputs\": [ \t\t\t{ \t\t\t\t\"internalType\": \"uint256\", \t\t\t\t\"name\": \"tokenId\", \t\t\t\t\"type\": \"uint256\" \t\t\t} \t\t], \t\t\"name\": \"ownerOf\", \t\t\"outputs\": [ \t\t\t{ \t\t\t\t\"internalType\": \"address\", \t\t\t\t\"name\": \"owner\", \t\t\t\t\"type\": \"address\" \t\t\t} \t\t], \t\t\"stateMutability\": \"view\", \t\t\"type\": \"function\" \t}, \t{ \t\t\"inputs\": [ \t\t\t{ \t\t\t\t\"internalType\": \"address\", \t\t\t\t\"name\": \"from\", \t\t\t\t\"type\": \"address\" \t\t\t}, \t\t\t{ \t\t\t\t\"internalType\": \"address\", \t\t\t\t\"name\": \"to\", \t\t\t\t\"type\": \"address\" \t\t\t}, \t\t\t{ \t\t\t\t\"internalType\": \"uint256\", \t\t\t\t\"name\": \"tokenId\", \t\t\t\t\"type\": \"uint256\" \t\t\t} \t\t], \t\t\"name\": \"safeTransferFrom\", \t\t\"outputs\": [], \t\t\"stateMutability\": \"nonpayable\", \t\t\"type\": \"function\" \t}, \t{ \t\t\"inputs\": [ \t\t\t{ \t\t\t\t\"internalType\": \"address\", \t\t\t\t\"name\": \"from\", \t\t\t\t\"type\": \"address\" \t\t\t}, \t\t\t{ \t\t\t\t\"internalType\": \"address\", \t\t\t\t\"name\": \"to\", \t\t\t\t\"type\": \"address\" \t\t\t}, \t\t\t{ \t\t\t\t\"internalType\": \"uint256\", \t\t\t\t\"name\": \"tokenId\", \t\t\t\t\"type\": \"uint256\" \t\t\t}, \t\t\t{ \t\t\t\t\"internalType\": \"bytes\", \t\t\t\t\"name\": \"data\", \t\t\t\t\"type\": \"bytes\" \t\t\t} \t\t], \t\t\"name\": \"safeTransferFrom\", \t\t\"outputs\": [], \t\t\"stateMutability\": \"nonpayable\", \t\t\"type\": \"function\" \t}, \t{ \t\t\"inputs\": [ \t\t\t{ \t\t\t\t\"internalType\": \"address\", \t\t\t\t\"name\": \"operator\", \t\t\t\t\"type\": \"address\" \t\t\t}, \t\t\t{ \t\t\t\t\"internalType\": \"bool\", \t\t\t\t\"name\": \"_approved\", \t\t\t\t\"type\": \"bool\" \t\t\t} \t\t], \t\t\"name\": \"setApprovalForAll\", \t\t\"outputs\": [], \t\t\"stateMutability\": \"nonpayable\", \t\t\"type\": \"function\" \t}, \t{ \t\t\"inputs\": [ \t\t\t{ \t\t\t\t\"internalType\": \"bytes4\", \t\t\t\t\"name\": \"interfaceId\", \t\t\t\t\"type\": \"bytes4\" \t\t\t} \t\t], \t\t\"name\": \"supportsInterface\", \t\t\"outputs\": [ \t\t\t{ \t\t\t\t\"internalType\": \"bool\", \t\t\t\t\"name\": \"\", \t\t\t\t\"type\": \"bool\" \t\t\t} \t\t], \t\t\"stateMutability\": \"view\", \t\t\"type\": \"function\" \t}, \t{ \t\t\"inputs\": [ \t\t\t{ \t\t\t\t\"internalType\": \"address\", \t\t\t\t\"name\": \"from\", \t\t\t\t\"type\": \"address\" \t\t\t}, \t\t\t{ \t\t\t\t\"internalType\": \"address\", \t\t\t\t\"name\": \"to\", \t\t\t\t\"type\": \"address\" \t\t\t}, \t\t\t{ \t\t\t\t\"internalType\": \"uint256\", \t\t\t\t\"name\": \"tokenId\", \t\t\t\t\"type\": \"uint256\" \t\t\t} \t\t], \t\t\"name\": \"transferFrom\", \t\t\"outputs\": [], \t\t\"stateMutability\": \"nonpayable\", \t\t\"type\": \"function\" \t} ]" } ] }, { "type": "GenericEVMConnectionResource", "name": "(r1) Generic EVM Connection", "id": "r1", "params": [ { "name": "privateKey", "value": "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" }, { "name": "url", "value": "https://rpc.ankr.com/eth" } ] }, { "type": "HTTPConnectionResource", "name": "(r2) HTTP Connection", "id": "r2", "params": [ { "name": "method", "value": "GET" }, { "name": "timeout", "value": "60000" }, { "name": "url", "value": "https://eth-mainnet.g.alchemy.com/nft/v2/wN865XVKKyqDFr4hM87t2ETE55ig5nIt/getNFTMetadata?contractAddress=0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D&tokenId=7904&refreshCache=false" } ] }, { "type": "HTTPConnectionResource", "name": "(r3) HTTP Connection", "id": "r3", "params": [ { "name": "url", "value": "https://example.rafal-kalinowski.pl" }, { "name": "method", "value": "POST" }, { "name": "timeout", "value": "30000" } ] }, { "type": "HTTPConnectionResource", "name": "(r4) HTTP Connection", "id": "r4", "params": [ { "name": "url", "value": "https://analytics.informatica.xyz.com" }, { "name": "method", "value": "PUT" }, { "name": "timeout", "value": "15000" } ] } ], "transitions": [ { "id": "t2", "type": "SuccessTransition", "from": "a0", "to": "a1" }, { "id": "t3", "type": "SuccessTransition", "from": "a1", "to": "a2" }, { "id": "t4", "type": "SuccessTransition", "from": "a2", "to": "a3" }, { "id": "t4", "type": "SuccessTransition", "from": "a3", "to": "a4" }, { "id": "t5", "type": "SuccessTransition", "from": "a4", "to": "a5" }, { "id": "t6", "type": "SuccessTransition", "from": "a4", "to": "a6" }, { "id": "t7", "type": "SuccessTransition", "from": "a6", "to": "a7" } ], "activities": [ { "type": "EVMEventTrigger", "name": "EVMEventTrigger", "id": "a0", "params": [ { "name": "eventName", "value": "\"Transfer\"" }, { "name": "eventAddress", "value": "\"0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D\"" } ], "position": { "x": -2020, "y": -5 }, "resources": [ "r0", "r1" ] }, { "type": "MapperActivity", "name": "Mapper", "id": "a1", "params": [ { "name": "apiKey", "value": "\"wN865XVKKyqDFr4hM87t2ETE55ig5nIt\"" }, { "name": "contractAddress", "value": "\"0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D\"" }, { "name": "from", "value": "a0.eventTopics[0]" }, { "name": "to", "value": "a0.eventTopics[1]" }, { "name": "tokenId", "value": "a0.eventTopics[2]" } ], "position": { "x": -2020, "y": 110.07560287729171 } }, { "type": "SleepActivity", "name": "Sleep", "id": "a2", "params": [ { "name": "duration", "value": "20000" } ], "position": { "x": -2020, "y": 204.5210375793164 } }, { "type": "HTTPRequestReplyActivity", "name": "HTTP Request Reply", "id": "a3", "params": [ { "name": "url", "value": "\"https://eth-mainnet.g.alchemy.com/nft/v2/\" + a2.apiKey + \"/getNFTMetadata?contractAddress=\" + a2.contractAddress + \"&tokenId=\" + 2.tokenId + \"&refreshCache=false\"" } ], "position": { "x": -2020, "y": 302.53299099547473 }, "resources": [ "r2" ] }, { "type": "MapperActivity", "name": "Mapper", "id": "a4", "params": [ { "name": "imageUrl", "value": "a3.dataJson.metadata.image" }, { "name": "title", "value": "a3.dataJson.title" }, { "name": "description", "value": "a3.dataJson.description" }, { "name": "collectionName", "value": "a3.dataJson.contractMetadata.name" }, { "name": "collectionSymbol", "value": "a3.dataJson.contractMetadata.symbol" }, { "name": "lastUpdated", "value": "a3.dataJson.timeLastUpdated" }, { "name": "attributes", "value": "a3.metadata.attributes|stringify" } ], "position": { "x": -2012.9659272810868, "y": 402.9469738740244 } }, { "type": "MapperActivity", "name": "Mapper", "id": "a6", "params": [ { "name": "header", "value": "\"tokenId,title,description,collectionName,collectionSymbol,lastUpdated,attributes\"" }, { "name": "data", "value": "a1.tokenId + \",\" + a4.description + \",\" + a4.collectionName + \",\" + a4.collectionSymbol + \",\" + a4.lastUpdated + \",\" + a4.attributes" } ], "position": { "x": -2218.3842264869168, "y": 495.74559149771085 } }, { "type": "HTTPRequestReplyActivity", "name": "HTTP Request Reply", "id": "a7", "params": [ { "name": "postData", "value": "a6.header + \"\\n\" + a6.data" } ], "position": { "x": -2211.1765668656594, "y": 608.3652730798545 }, "resources": [ "r4" ] }, { "type": "HTTPRequestReplyActivity", "name": "HTTP Request Reply", "id": "a5", "params": [ { "name": "postData", "value": "a3.dataRaw" } ], "position": { "x": -1794.9342237380567, "y": 495.74559149771085 }, "resources": [ "r3" ] } ] } },
    {
        "id": "example-2",
        "name": "Example workflow 2",
        "description": "New workflow",
        "updated": "function Date() {\n    [native code]\n}",
        "structure": {
            "transitions": [
                {
                    "id": "1",
                    "type": TransitionType.SUCCESS,
                    "from": "0",
                    "to": "1"
                }
            ],
            "activities": [
                {
                    "type": TriggerActivityEnum.SCHEDULER,
                    "name": "Scheduler",
                    "id": "0",
                    "params": [
                        {
                            "name": "runOnce",
                            "value": true
                        }
                    ],
                    "position": {
                        "x": -2004.7272727272727,
                        "y": -47.54545454545455
                    }
                },
                {
                    "type": ActivityEnum.LOG_ACTIVITY,
                    "name": "Log",
                    "id": "1",
                    "params": [
                        {
                            "name": "message",
                            "value": "\"test message\""
                        }
                    ],
                    "position": {
                        "x": -2020,
                        "y": 94.63636363636364
                    }
                }
            ],
            "resources": [
                {
                    "type": ResourceEnum.HTTP_CONNECTION,
                    "name": "HTTP Connection",
                    "id": "935.3034170719993",
                    "params": [
                        {
                            "name": "url",
                            "value": "localhost:4000"
                        },
                        {
                            "name": "method",
                            "value": "GET"
                        }
                    ]
                }
            ]
        }
    }
]