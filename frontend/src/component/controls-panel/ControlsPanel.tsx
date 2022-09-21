import {createUseStyles} from 'react-jss';
import { Button, Heading } from '@chakra-ui/react';
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
 
   return (
    <div className={classes.container}>
    <Heading as='h4' size='md'>Controls</Heading>
    <Button className={classes.startButton} colorScheme='blue'>START FLOW</Button>
 </div>
   );
 }
 export default ControlsPanel