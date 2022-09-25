import {
    ActivityEnum,
    ResourceEnum,
    TransitionType,
    TriggerActivityEnum
} from 'turbo-dipaas-common/src/enums/DesignStructEnum'
import {Workflow} from 'turbo-dipaas-common/src/types/api/workflow/Workflow'

export const ExampleWorkflows: Workflow[] = [
    {
        "id": "example-1",
        "name": "Example workflow 1",
        "description": "New workflow",
        "updated": "function Date() {\n    [native code]\n}",
        "structure": {
            "transitions": [
                {
                    "id": "1",
                    "from": "0",
                    "type": TransitionType.SUCCESS,
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
                        "x": -1998.4545454545453,
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
    },
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
                        "x": -1998.4545454545453,
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