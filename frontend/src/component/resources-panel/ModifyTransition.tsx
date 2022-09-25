import {createUseStyles} from 'react-jss';
import { Button, Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Input,
    Select,
    FormControl,
    FormLabel} from '@chakra-ui/react';
import { TransitionType} from '../../types/enums/DesignStructEnum';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppStateReducer } from '../../types/interface/AppState';
import {setWorkflow} from "../../redux/reducers/workspaceNode";
import {Transition} from "turbo-dipaas-common/src/types/api/workflow/Transition";

const useStyles = createUseStyles({
    addButton: {
        margin: '24px 0px'
    }
});

function ModifyTransition(data :any) {
    const classes = useStyles();
    const { isOpen, onOpen, onClose, editedTransitionId } = data;

    const [selectedTransition, setSelectedTransition] = useState<Transition | undefined>();
    const workflow = useSelector((state: AppStateReducer) => state.app.workflow);
    const dispatch = useDispatch();

    useEffect(() => {
        const newTransition = workflow.structure.transitions.find((v) => v.id === editedTransitionId)

        setSelectedTransition(newTransition)
    }, [isOpen])

    function saveForm() {
        const notMatchingTransitions = workflow.structure.transitions.filter((v) => v.id !== selectedTransition!.id)
        dispatch(setWorkflow({
            id: workflow.id,
            name: workflow.name,
            description: workflow.description,
            updated: Date.toString(),
            structure: {
                transitions: [...notMatchingTransitions, selectedTransition!],
                activities: workflow.structure.activities,
                resources: workflow.structure.resources,
            }
        }))
    }

    function getCurrentTransationCopy(): Transition {
        return JSON.parse(JSON.stringify(selectedTransition))
    }

    function changeType(value: TransitionType) {
        const tr = getCurrentTransationCopy()
        tr.type = value

        setSelectedTransition(tr)
    }

    function setTransitionCondition(value: string) {
        const tr = getCurrentTransationCopy()
        tr.condition = value

        setSelectedTransition(tr)
    }

    return (

        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Edit transition type</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl>
                        <FormLabel>Asset type</FormLabel>
                        {/*@ts-ignore*/}
                        <Select onChange={(e) => changeType(e.target.value)} value={selectedTransition?.type}>
                            <option value={TransitionType.SUCCESS}>success</option>
                            <option value={TransitionType.CONDITION}>condition</option>
                            <option value={TransitionType.ERROR}>error</option>
                        </Select>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Condition</FormLabel>

                        <Input onChange={(e) => {setTransitionCondition(e.target.value)}}
                               value={selectedTransition?.condition ?? ''}>
                        </Input>
                    </FormControl>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={() => {saveForm(); onClose(); }}>
                        Edit
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>

    );
}
export default ModifyTransition