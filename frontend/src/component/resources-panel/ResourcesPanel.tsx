import {createUseStyles} from 'react-jss';
import { Button, Heading, useDisclosure} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { AppStateReducer } from '../../types/interface/AppState';
import AddNewResource from './AddNewResource';
import { useState } from 'react';
import { Resource } from 'turbo-dipaas-common/src/types/api/workflow/Resource';

const useStyles = createUseStyles({
  container: {
    textAlign: 'center'
   },
   addButton: {
    margin: '32px 0px 24px 0px'
   }
 });

 function ResourcesPanel({ data }:any) {
   const classes = useStyles();
   const resources = useSelector((state: AppStateReducer) => state.app.workflow.structure.resources);
   const [editedResource, setEditedResource] = useState<Resource | undefined>();
   const { isOpen, onOpen, onClose } = useDisclosure();

   return (
     <div className={classes.container}>
        <Heading as='h4' size='md'>Resources</Heading>
        
        <Button onClick={() => {setEditedResource(undefined); onOpen();}} className={classes.addButton} colorScheme='blue'>+ add resource</Button>
        {resources.map((el:Resource) => 
            <div style={{marginBottom: '8px', float: 'left'}}>
               <Button style={{float: 'left'}} colorScheme='blue' variant='ghost' size='sm'
               onClick={() => {setEditedResource(el); onOpen();}}>
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
            <AddNewResource editedResource={editedResource} isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
     </div>
   );
 }
 export default ResourcesPanel