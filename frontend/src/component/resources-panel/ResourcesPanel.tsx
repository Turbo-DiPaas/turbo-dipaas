import {createUseStyles} from 'react-jss'
const useStyles = createUseStyles({
   something: {
     background: 'lightblue',
   }
 })
 function ResourcesPanel({ data }:any) {
   const classes = useStyles()
 
   return (
     <div className={classes.something}>
         aaaa
     </div>
   );
 }
 export default ResourcesPanel