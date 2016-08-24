import React,{ Component } from 'react'
import { Form, FormGroup, Row, Col, Checkbox, FormControl, Alert } from 'react-bootstrap'
import { Router } from 'react-router'
import Dropzone from 'react-dropzone'
import CDN from '../../widgets/cdn'
import Request from 'superagent'

export default class EditStickerSet extends Component{
	constructor(props) {
	  	super(props)
	  	this.state = {
	  		name:'',
	  		description:'',
	  		author:'',
	  		frame:false,
	  		image:'',
	  		active:true,
	  	}
	  	this.changeName = (e) => this.setState({name:e.target.value})
	  	this.changeDescription = (e) => this.setState({description:e.target.value})
	  	this.changeAuthor = (e) => this.setState({author:e.target.value})
	  	this.changeActive = (e) => this.setState({active:!this.state.active})
	  	this.changeFrame = (e) => this.setState({frame:!this.state.frame})
	  	this.onDropImage = this._onDropImage.bind(this)
	  	this.submit = this._submit.bind(this)
	}
	componentWillMount() {
		Request.get(`/api/sticker/set/${this.props.params.id}`)
			.end((err,res) => {
				this.setState({
					name:res.body.name,
					image:res.body.image,
					author:res.body.author,
					description:res.body.description,
					active:res.body.active,
				})
			})
	}
	_onDropImage(images) {
		let formData = new FormData();
		formData.append('file', images[0]);
		$.ajax({
			url: '/api/upload?key=stickerset/' + this.props.params.id + '.png',
			type: 'POST',
			data: formData,
			processData: false,
			contentType: false,
			success: function(data) {
				this.setState({
					image: data
				})
			}.bind(this)
		})
	}
	_submit() {
  		let { name, image, author, description, active, frame } = this.state
  		if(!name.trim()){
  			return alert('name is required')
  		}
		Request
			.post(`/api/sticker/set/${this.props.params.id}`)
			.send({
                name, image, author, description, active, frame
            })
            .end((err,res) => {
            	if(res.body.msg === 'success!'){
            		alert('更新成功!')
            	}
            })
	}
	render() {
		return(
			<div className="content">
		        <div className="box box-solid">
		          <div className="box-body">
		            <Form className="pl-form" horizontal>
		            	<FormGroup>
					      <Col className="control-label" sm={3}><strong>Name*</strong></Col>
					      <Col sm={9}>
					        <FormControl onChange={this.changeName} type="text" value={this.state.name} placeholder="Input the collection name" />
					      </Col>
					    </FormGroup>
					    <FormGroup>
					      <Col className="control-label" sm={3}><strong>Description</strong></Col>
					      <Col sm={9}>
					        <FormControl onChange={this.changeDescription} type="text" value={this.state.description} placeholder="Input the collection description" />
					      </Col>
					    </FormGroup>
					    <FormGroup>
					      <Col className="control-label" sm={3}><strong>Author</strong></Col>
					      <Col sm={9}>
					        <FormControl onChange={this.changeAuthor} type="text" value={this.state.author} placeholder="Input the collection author name" />
					      </Col>
					    </FormGroup>
					    <FormGroup>
					      <Col className="control-label" sm={3}><strong>Frame</strong></Col>
					      <Col sm={9}>
					        <Checkbox onChange={this.changeFrame} checked={this.state.frame}>check me out</Checkbox>
					      </Col>
					    </FormGroup>
					    <FormGroup>
					      <Col className="control-label" sm={3}><strong>Image</strong></Col>
					      <Col sm={9}>
					        <FormControl type="text" value={this.state.image} disabled/>
					      </Col>
					    </FormGroup>
					    <Row>
		                  <Dropzone onDrop={this.onDropImage} className="col-sm-offset-3 col-sm-2" style={{width:150, height:100, borderWidth: 2, borderColor: '#666', borderStyle: 'dashed'}}>
		                    <div>将图片拖入该区域</div>
		                  </Dropzone>
		                  <Col sm={3}>
		                    <img className="img-responsive" style={{maxHeight:'100px'}} src={this.state.image? CDN.show(this.state.image):''}/>
		                  </Col>
		                </Row>
					    <FormGroup>
					      <Col className="control-label" sm={3}><strong>Active</strong></Col>
					      <Col sm={9}>
					        <Checkbox onChange={this.changeActive} checked={this.state.active}>check me out</Checkbox>
					      </Col>
					    </FormGroup>
					    <FormGroup>
					      <Col smOffset={3} sm={9}>
					        <div onClick={this.submit} className="btn btn-primary">
					          Submit
					        </div>
					      </Col>
					    </FormGroup>
		            </Form>
		          </div>
		        </div>

		    </div>

		)
	}
}

EditStickerSet.contextTypes = {
	router : React.PropTypes.object
}
