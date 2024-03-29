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
            image:'',
            id:'',
            setId:'',
            subject:'',
        }
        this.onDropImage = this._onDropImage.bind(this)
        this.changeSubject =(e) => this.setState({subject:e.target.value})
        this.submit = this._submit.bind(this)
    }
    componentWillMount() {
        this.setState({setId:this.props.match.params.id})
    }
    _onDropImage(images) {
        let formData = new FormData()
        formData.append('file', images[0])
        $.ajax({
            url: '/api/upload?key=sticker_$id.png',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(data) {
                this.setState({
                    image:data,
                    id:data.split(/[_\.]/)[1]
                })
            }.bind(this)
        })
    }
    _submit() {
        let { image, id, setId, subject } = this.state
        Request
            .post(`/api/sticker`)
            .send({
                image, id, setId, subject, score:0
            })
            .end((err,res) => {
                alert("success!")
            })
  }
    render() {
        return(
			<div className="portlet bordered light">
				<div className="portlet-title">
					<div className="caption">
						<span className="caption-subject font-blue-sharp bold uppercase">贴纸编辑器</span>
					</div>
				</div>
				<div className="portlet-body py-5">
					<Form horizontal  onSubmit={(e) => e.preventDefault()}>
						<FormGroup>
							<Col className="control-label" sm={2}>ID</Col>
							<Col sm={9}>
								<FormControl type="text" value={this.state.id} disabled/>
							</Col>
						</FormGroup>
						<FormGroup>
							<Col className="control-label" sm={2}>话题</Col>
							<Col sm={9}>
								<FormControl onChange={this.changeSubject} type="text" value={this.state.subject} placeholder="Input the subject" />
							</Col>
						</FormGroup>
						<FormGroup>
							<Col className="control-label" sm={2}>集合ID</Col>
							<Col sm={9}>
								<FormControl type="text" value={this.state.setId} disabled/>
							</Col>
						</FormGroup>
						<FormGroup>
							<Col className="control-label" sm={2}>图片</Col>
							<Col sm={9}>
								<FormControl type="text" value={this.state.image} disabled/>
							</Col>
						</FormGroup>
						<FormGroup>
							<Col className="control-label" sm={2}>上传图片</Col>
							<Col xs={6} sm={3}>
								<Dropzone onDrop={this.onDropImage} className="play-dropzone-style">
									<div>将图片拖入该区域</div>
								</Dropzone>
							</Col>
							<Col xs={6} sm={3}>
								<img className="img-responsive" style={{maxHeight:'100px'}} src={this.state.image? CDN.show(this.state.image):''}/>
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




