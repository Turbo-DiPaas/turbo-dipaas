import { Button } from '@chakra-ui/react';
import React, {Component} from 'react';
import './Tree.css'

class Tree extends React.Component<any, any>  {
    constructor(props) {
        super(props)
        this.state = {show: false}
    }
    toggleView = () => {
        this.setState({show: !this.state.show})
    }
    render() {
        const {name, data, level} = this.props
        const margin = 40
        const tree = data.map((node, key) => {
            if(node.data === null) {
            //   return <div className="Tree" style={{marginLeft: String((level + 1) * margin) + "px"}} key={key}>{node.name}</div>
              return <Button className="Tree" style={{marginLeft: String((level + 1) * margin) + "px"}} colorScheme='blue' variant='ghost' size='sm'>
               {node.name}
               </Button>
            }
            return <Tree key={key} name={node.name} data={node.data} level={level+1} />
        })
        const sign = this.state.show ? " \u2212 " : " + "
        return (
            <>
                <Button className="Tree" style={{marginLeft: String(level * margin) + "px"}}  colorScheme='blue' variant='ghost' size='sm' onClick={this.toggleView}>
                     {sign}{name}
                </Button>
                {/* <div className="Tree" style={{marginLeft: String(level * margin) + "px"}} onClick={this.toggleView}>
                    <span className="Sign">{sign}</span>{name}
                </div> */}
                {this.state.show && tree}
            </>
        )
    }
}

export default Tree;