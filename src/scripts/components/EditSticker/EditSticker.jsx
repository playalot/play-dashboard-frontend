import React,{ Component } from 'react'
import { Form, FormGroup, Row, Col, Checkbox, FormControl, Alert } from 'react-bootstrap'
import { Router } from 'react-router'
import Dropzone from 'react-dropzone'
import CDN from '../../widgets/cdn'
import Request from 'superagent'

export default class EditSticker extends Component{
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
        this.setState({setId:this.props.params.id})
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
          <div className="content">
            <div className="box box-solid">
              <div className="box-body">
                <Form className="pl-form" horizontal>
                    <FormGroup>
                      <Col className="control-label" sm={3}><strong>ID</strong></Col>
                      <Col sm={9}>
                        <FormControl type="text" value={this.state.id} disabled/>
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Col className="control-label" sm={3}><strong>话题</strong></Col>
                      <Col sm={9}>
                        <FormControl onChange={this.changeSubject} type="text" value={this.state.subject} placeholder="Input the subject" />
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Col className="control-label" sm={3}><strong>集合ID</strong></Col>
                      <Col sm={9}>
                        <FormControl type="text" value={this.state.setId} disabled/>
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Col className="control-label" sm={3}><strong>图片</strong></Col>
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
                    <br/>
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

EditSticker.contextTypes = {
  router : React.PropTypes.object
}




