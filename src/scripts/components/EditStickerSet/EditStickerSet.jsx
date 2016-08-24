import React,{ Component } from 'react'
import { Router } from 'react-router'
import Dropzone from 'react-dropzone'
import CDN from '../../widgets/cdn'

import RB,{ Form, FormGroup, Row, Button, Input, Checkbox, FormControl  } from 'react-bootstrap'
import Formsy from 'formsy-react'
import Modal from 'react-modal'
import FRC from 'formsy-react-components'

export default class EditStickerSet extends Component{
	constructor(props) {
	  	super(props)
	  	this.state = {
	  		image: '',
      		alert: false
	  	}
	}
	render() {
		let customStyles = {
	      content : {
	        zIndex                : 3,
	        width                 : '300px',
	        top                   : '50%',
	        left                  : '50%',
	        right                 : 'auto',
	        bottom                : 'auto',
	        marginRight           : '-50%',
	        transform             : 'translate(-50%, -50%)'
	      }
	    }
		return(
			<div className="content">
		        <div className="box box-solid">
		          <div className="box-body">
		            <Form className="pl-form form-horizontal">
		            	<FormGroup>
		            		<FormControl type="text" label="Name" placeholder="Input the collection name" value="" />
		            	</FormGroup>
		            </Form>
		            <Formsy.Form ref="form" className="pl-form form-horizontal" onSubmit={this.submit} >
		              <fieldset>
		                <FRC.Input ref="name" name="name" id="cname" value="" label="Name" type="text" placeholder="Input the collection name" required/>
		                <FRC.Input ref="description" name="description" id="cdescription" value="" label="Description" type="text" placeholder="Input the collection description" />
		                <FRC.Input ref="author" name="author" id="cauthor" value="" label="Author" type="text" placeholder="Input the collection author name" />
		                <FRC.Checkbox ref="frame" name="frame" value={false} label="check me out" rowLabel="Frame" />
		                <FRC.Input ref="image" name="image" id="cimage" value="" label="Image" type="text" disabled />
		                <div className="row">
		                  <Dropzone onDrop={this.onDropImage} className="col-sm-offset-3 col-sm-2" style={{width:150, height:100, borderWidth: 2, borderColor: '#666', borderStyle: 'dashed'}}>
		                    <div>将图片拖入该区域</div>
		                  </Dropzone>
		                  <div className="col-sm-3">
		                    <img className="img-responsive" style={{maxHeight:'100px'}} src={this.state.image?CDN.show(this.state.image):''}/>
		                  </div>
		                </div>
		                <FRC.Checkbox ref="active" name="active" value={false} label="check me out" rowLabel="Active" />
		              </fieldset>
		              <FRC.Row layout={'horizontal'}>
		                <input name="submit" className="btn btn-primary" formNoValidate={true} type="submit" defaultValue="Submit" />
		              </FRC.Row>
		            </Formsy.Form>
		          </div>
		        </div>

		    </div>

		)
	}
}

EditStickerSet.contextTypes = {
	router : React.PropTypes.object
}
