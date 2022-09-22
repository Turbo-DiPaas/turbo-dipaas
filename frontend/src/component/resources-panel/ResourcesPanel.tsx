import {createUseStyles} from 'react-jss';
import { Button, Heading} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { AppStateReducer } from '../../types/interface/AppState';
import AddNewResource from './AddNewResource';

const useStyles = createUseStyles({
  container: {
    textAlign: 'center'
   },
   addButton: {
    margin: '24px 0px'
   }
 });

 function ResourcesPanel({ data }:any) {
   const classes = useStyles();
   const resources = useSelector((state: AppStateReducer) => state.app.workflow.structure.resources);

   return (
     <div className={classes.container}>
        <Heading as='h4' size='md'>Resources</Heading>
        <AddNewResource/>
        {resources.map((el) => 
            <div style={{marginBottom: '8px', float: 'left'}}>
               <Button style={{float: 'left'}} colorScheme='blue' variant='ghost' size='sm'>
               edit
               </Button>
               <Button style={{maxWidth: '250px',
                              textOverflow: 'ellipsis',
                              overflow: 'hidden',
                              width: '180px',
                              whiteSpace: 'nowrap',
                              float: 'left',
                              display: 'inline-block',
                              marginLeft: '8px'
            }} colorScheme='blue' variant='outline' size='sm'>
               {el.name}
               </Button>

            </div>)}
     </div>
   );
 }
 export default ResourcesPanel