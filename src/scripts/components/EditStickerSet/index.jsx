import React,{ Component } from 'react'
import PropTypes from 'prop-types'
import { Form, FormGroup, Row, Col, Checkbox, FormControl, Alert } from 'react-bootstrap'
import Dropzone from 'react-dropzone'
import CDN from '../../widgets/cdn'
import Request from 'superagent'

export default class extends Component{
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
		Request.get(`/api/sticker/set/${this.props.match.params.id}`)
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
			url: '/api/upload?key=stickerset/' + this.props.match.params.id + '.png',
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
			.post(`/api/sticker/set/${this.props.match.params.id}`)
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
			<div className="portlet bordered light">
				<div className="portlet-title">
					<div className="caption">
						<span className="caption-subject font-blue-sharp bold uppercase">贴纸集编辑器</span>
					</div>
				</div>
				<div className="portlet-body py-5">
		            <Form horizontal  onSubmit={(e) => e.preventDefault()}>
		            	<FormGroup>
							<Col className="control-label" sm={2}>Name</Col>
							<Col sm={9}>
								<FormControl onChange={this.changeName} type="text" value={this.state.name} placeholder="Input the collection name" />
							</Col>
					    </FormGroup>
					    <FormGroup>
							<Col className="control-label" sm={2}>Description</Col>
							<Col sm={9}>
								<FormControl onChange={this.changeDescription} type="text" value={this.state.description} placeholder="Input the collection description" />
							</Col>
					    </FormGroup>
					    <FormGroup>
							<Col className="control-label" sm={2}>Author</Col>
							<Col sm={9}>
								<FormControl onChange={this.changeAuthor} type="text" value={this.state.author} placeholder="Input the collection author name" />
							</Col>
					    </FormGroup>
					    <FormGroup>
							<Col className="control-label" sm={2}>Frame</Col>
							<Col sm={9} className="mt-2 pl-5">
								<Checkbox onChange={this.changeFrame} checked={this.state.frame}>check me out</Checkbox>
							</Col>
					    </FormGroup>
						<FormGroup>
							<Col className="control-label" sm={2}>Image</Col>
							<Col xs={6} sm={3}>
								<Dropzone accept="image/jpeg, image/png" onDrop={this.onDropImage} className="play-dropzone-style">
									<div>将图片拖入此区域</div>
								</Dropzone>
							</Col>
							<Col xs={6} sm={3}>
								<img className="img-responsive" style={{maxHeight:'100px'}} src={this.state.image? CDN.show(this.state.image):''}/>
							</Col>
						</FormGroup>
					    <FormGroup>
							<Col className="control-label" sm={2}>Active</Col>
							<Col sm={9} className="mt-2 pl-5">
								<Checkbox onChange={this.changeActive} checked={this.state.active}>check me out</Checkbox>
							</Col>
					    </FormGroup>
		            </Form>
					<div className="portlet-body py-5" style={{borderTop:'1px solid #eef1f5'}}>
						<Col sm={2} smOffset={2}>
							<button className="btn btn-outline green" type="button" onClick={this.submit}>Submit</button>
						</Col>
					</div>
				</div>
			</div>
		)
	}
}
