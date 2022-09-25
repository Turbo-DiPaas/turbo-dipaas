import { createUseStyles } from 'react-jss';
import {
    Button,
    Heading,
    Modal, ModalBody, ModalCloseButton,
    ModalContent, ModalFooter,
    ModalHeader,
    ModalOverlay,
    SimpleGrid,
    Text,
    useDisclosure
} from '@chakra-ui/react';
import { useDispatch, useSelector } from "react-redux";
import { AppStateReducer } from "../../types/interface/AppState";
import { createWorkflow, getWorkflowLogs, runWorkflow, stopWorkflow, getWorkflowExmples, getWorkflowExmple } from "../../service/runner/Workflow";
import { useState } from 'react';
import { setWorkflow } from '../../redux/reducers/workspaceNode';
import { Edge, Node } from 'react-flow-renderer';

const useStyles = createUseStyles({
    container: {
        textAlign: 'center'
    },
    startButton: {
        margin: '12px 0px',
        background: '#6f45d8',
        '&:hover': {
            background: '#5836af'
        }
    },
    selectExampleButton: {
        margin: '12px 0px',
        background: '#6f45d8',
        '&:hover': {
            background: '#5836af'
        },
        width: 400
    },
    content: {
        marginTop: '24px'
    }
})

const logsNumToShow = 100

function ControlsPanel(data) {
    const dispatch = useDispatch()
    const classes = useStyles()
    const workflow = useSelector((state: AppStateReducer) => state.app.workflow);
    const { isOpen: isOpenLogsModal, onOpen: onOpenLogsModal, onClose: onCloseLogsModal } = useDisclosure()
    const { isOpen: isOpenExamplesModal, onOpen: onOpenExamplesModal, onClose: onCloseExamplesModal } = useDisclosure()
    const [logs, setLogs] = useState(<></>)
    const [exampleWorkflows, setExampleWorkflows] = useState(<></>)

    const { setNodes, setEdges } = data;

    function displayLogs() {
        getWorkflowLogs(workflow.id).then(res => {
            const lines = res.data?.split('\n') ?? ['']
            const logsToShowNum = logsNumToShow > lines.length ? lines.length : logsNumToShow

            setLogs(
                <>
                    {
                        lines
                            .slice(lines.length - logsToShowNum, lines.length - 1)
                            .map((v) => { return (<p>{v}</p>) })
                    }
                </>
            )
            onOpenLogsModal()
        })
    }

    function onSelectExample(id: string) {        
        getWorkflowExmple(id).then(res => {
        dispatch(setWorkflow(res.data!))
            let nodes: Node[] =
                res.data!.structure.activities.map(activity => {
                    return {
                        id: activity.id,
                        ...(activity.id === 'a0' && {type: 'input'}),
                        // we are removing the half of the node width (75) to center the new node
                        position: { x: activity.position!.x, y: activity.position!.y },
                        data: {
                            label: `${activity.name} (id: ${activity.id})`,
                            id: activity.id
                        }
                    }
                })
            let edges: Edge[] =
                res.data!.structure.transitions.map(transition => {
                    return {
                        id: transition.id,
                        type: 'smoothstep',
                        label: transition.type,
                        source: transition.from,
                        target: transition.to
                    }
                })

            setNodes(nodes)
            setEdges(edges)
        })
        onCloseExamplesModal()
    }

    function displayExamples() {
        getWorkflowExmples().then(res => {
            setExampleWorkflows(
                <>
                    {
                        res.data!
                            .map((example => { 
                                return <Button className={classes.selectExampleButton} colorScheme='blue' size="lg" mr={3} onClick={() => onSelectExample(example.id)} >
                                        {example.name}
                                    </Button>
                               
                            }))
                    }
                </>
            )

        })
        onOpenExamplesModal()
    }

    return (
        <div className={classes.container}>
            <Heading as='h4' size='md'>Controls</Heading>
            <SimpleGrid className={classes.content} columns={1}>
                <Button className={classes.startButton} onClick={() => createWorkflow(workflow)} colorScheme='blue'>SAVE FLOW</Button>
                <Button className={classes.startButton} onClick={() => runWorkflow(workflow.id)} colorScheme='blue'>START FLOW</Button>
                <Button className={classes.startButton} onClick={() => stopWorkflow(workflow.id)} colorScheme='blue'>STOP FLOW</Button>
                <Button className={classes.startButton} onClick={() => displayLogs()} colorScheme='blue'>GET LOGS</Button>
                <Button className={classes.startButton} onClick={() => displayExamples()} colorScheme='blue'>SHOW EXAMPLE</Button>

                <Modal size={'full'} isOpen={isOpenLogsModal} onClose={onCloseLogsModal}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Logs</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Text fontWeight='bold' mb='1rem'>
                                Displaying last {logsNumToShow} logs
                            </Text>
                            <p>{logs}</p>
                        </ModalBody>

                        <ModalFooter>
                            <Button colorScheme='blue' mr={3} onClick={onCloseLogsModal}>
                                Close
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

                <Modal isOpen={isOpenExamplesModal} onClose={onCloseExamplesModal}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Select example workflow</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            {exampleWorkflows}
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme='blue' mr={3} onClick={onCloseExamplesModal}>
                                Close
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </SimpleGrid>
        </div>
    );
}
export default ControlsPanel