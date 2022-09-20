import {createUseStyles} from 'react-jss'
const useStyles = createUseStyles({
   something: {
     background: 'lightgrey',
   }
 })
 function ControlsPanel({ data }:any) {
   const classes = useStyles()
 
   return (
     <div className={classes.something}>
         bbb
     </div>
   );
 }
 export default ControlsPanel