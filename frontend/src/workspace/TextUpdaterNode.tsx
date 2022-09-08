import { useCallback } from 'react';
import { Handle, Position } from 'react-flow-renderer';
import {createUseStyles} from 'react-jss'

const handleStyle = { left: 10 };
const useStyles = createUseStyles({
  textUpdaterNode: {
    height: '50px',
    border: '1px solid #eee',
    padding: '5px',
    borderRadius: '5px',
    background: 'white',
    '& label': {
      display: 'block',
      color: '#777',
      fontSize: '12px',
    }
  }
})

function TextUpdaterNode({ data }:any) {
  const classes = useStyles()
  const onChange = useCallback((evt:any) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div className={classes.textUpdaterNode}>
      <Handle type="target" position={Position.Top} />
      <div>
        <label htmlFor="text">Text:</label>
        <input id="text" name="text" onChange={onChange} />
      </div>
      <Handle type="source" position={Position.Bottom} id="a" style={handleStyle} />
      <Handle type="source" position={Position.Bottom} id="b" />
    </div>
  );
}

export default TextUpdaterNode;
