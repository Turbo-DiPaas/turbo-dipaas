import {createUseStyles} from 'react-jss';
import {Button, Heading, SimpleGrid} from '@chakra-ui/react';
import {useSelector} from "react-redux";
import {AppStateReducer} from "../../types/interface/AppState";
import {createWorkflow, getWorkflowLogs, runWorkflow, stopWorkflow} from "../../service/runner/Workflow";
const useStyles = createUseStyles({
  container: {
    textAlign: 'center'
   },
   startButton: {
    margin: '24px 0px',
    background: '#6f45d8',
    '&:hover': {
      background: '#5836af'
    }
   }
 })


 function ControlsPanel({ data }:any) {
   const classes = useStyles()
   const workflow = useSelector((state: AppStateReducer) => state.app.workflow);

   function displayLogs () {
       getWorkflowLogs(workflow.id).then(res => {
           console.log(res)
       })
   }

   return (
      <div className={classes.container}>
         <Heading as='h4' size='md'>Controls</Heading>
         <SimpleGrid columns={1}>
            <Button className={classes.startButton} onClick={() => createWorkflow(workflow)} colorScheme='blue'>SAVE FLOW</Button>
            <Button className={classes.startButton} onClick={() => runWorkflow(workflow.id)} colorScheme='blue'>START FLOW</Button>
             <Button className={classes.startButton} onClick={() => stopWorkflow(workflow.id)} colorScheme='blue'>STOP FLOW</Button>
             <Button className={classes.startButton} onClick={() => displayLogs()} colorScheme='blue'>GET LOGS</Button>
         </SimpleGrid>
      </div>
   );
 }
 export default ControlsPanel