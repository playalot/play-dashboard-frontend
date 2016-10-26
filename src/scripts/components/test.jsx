import React, {
  Component
} from 'react'
import { Button,IconButton } from 'react-toolbox/lib/button'
export default class extends Component {
    render() {
        return(
            <div>
            	<Button accent ><span className="fa fa-eye"></span>abc</Button>
            	<IconButton primary ><span className="fa fa-heart"></span></IconButton>
                <span>test</span>
            </div>

        )
    }
}