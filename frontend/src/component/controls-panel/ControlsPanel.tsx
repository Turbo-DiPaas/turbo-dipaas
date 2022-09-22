import {createUseStyles} from 'react-jss';
import {Button, Heading, SimpleGrid} from '@chakra-ui/react';
import {useSelector} from "react-redux";
import {AppStateReducer} from "../../types/interface/AppState";
import {createWorkflow, runWorkflow} from "../../service/runner/Workflow";
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

   return (
      <div className={classes.container}>
         <Heading as='h4' size='md'>Controls</Heading>
         <SimpleGrid columns={1}>
            <Button className={classes.startButton} onClick={() => createWorkflow(workflow)} colorScheme='blue'>SAVE FLOW</Button>
            <Button className={classes.startButton} onClick={() => runWorkflow(workflow.id)} colorScheme='blue'>START FLOW</Button>
         </SimpleGrid>
      </div>
   );
 }
 export default ControlsPanel