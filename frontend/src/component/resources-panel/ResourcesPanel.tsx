import {createUseStyles} from 'react-jss';
import { Button, Heading, useDisclosure, Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton, } from '@chakra-ui/react';



const useStyles = createUseStyles({
  container: {
    textAlign: 'center'
   },
   addButton: {
    margin: '24px 0px'
   }
 })
 function ResourcesPanel({ data }:any) {
   const classes = useStyles();
   const { isOpen, onOpen, onClose } = useDisclosure()

   
 
   return (
     <div className={classes.container}>
        <Heading as='h4' size='md'>Resources</Heading>
        <Button onClick={onOpen} className={classes.addButton} colorScheme='blue'>+ add resource</Button>

        <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            rampapapapam lubie kiedy pada deszcz, kiedy nie pada tesz
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant='ghost'>Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
     </div>
   );
 }
 export default ResourcesPanel