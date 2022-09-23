import {createUseStyles} from 'react-jss';
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
import {useSelector} from "react-redux";
import {AppStateReducer} from "../../types/interface/AppState";
import {createWorkflow, getWorkflowLogs, runWorkflow, stopWorkflow} from "../../service/runner/Workflow";
import { useState } from 'react';
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
   content: {
    marginTop: '24px'
   }
 })

const logsNumToShow = 100

 function ControlsPanel({ data }:any) {
   const classes = useStyles()
   const workflow = useSelector((state: AppStateReducer) => state.app.workflow);
   const { isOpen, onOpen, onClose } = useDisclosure()
   const [logs, setLogs] = useState(<></>)

   function displayLogs () {
       getWorkflowLogs(workflow.id).then(res => {
           const lines = res.data?.split('\n') ?? ['']
           const logsToShowNum = logsNumToShow > lines.length ? lines.length : logsNumToShow

           setLogs(
               <>
                   {
                       lines
                           .slice(lines.length - logsToShowNum, lines.length - 1)
                           .map((v) => { return (<p>{v}</p>)})
                   }
               </>
           )
           onOpen()
       })
   }

   return (
      <div className={classes.container}>
         <Heading as='h4' size='md'>Controls</Heading>
         <SimpleGrid className={classes.content} columns={1}>
            <Button className={classes.startButton} onClick={() => createWorkflow(workflow)} colorScheme='blue'>SAVE FLOW</Button>
            <Button className={classes.startButton} onClick={() => runWorkflow(workflow.id)} colorScheme='blue'>START FLOW</Button>
            <Button className={classes.startButton} onClick={() => stopWorkflow(workflow.id)} colorScheme='blue'>STOP FLOW</Button>
            <Button className={classes.startButton} onClick={() => displayLogs()} colorScheme='blue'>GET LOGS</Button>

            <Modal size={'full'} isOpen={isOpen} onClose={onClose}>
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
                  <Button colorScheme='blue' mr={3} onClick={onClose}>
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