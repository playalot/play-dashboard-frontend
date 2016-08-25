import React,{ Component } from 'react'
import { Form, FormGroup, Row, Col, Checkbox, FormControl, Alert } from 'react-bootstrap'
import { Router } from 'react-router'
import Dropzone from 'react-dropzone'
import CDN from '../../widgets/cdn'
import Request from 'superagent'

export default class EditTag extends Component{
    constructor(props) {
        super(props)
        this.state = {
            id: this.props.params.id,
            text: '',
            image: '',
            type: '',
            description: '',
            classifications:[],
        }
        this.onDropImage = this._onDropImage.bind(this)
        this.changeDescription = (e) => this.setState({
            description: e.target.value
        })
        this.changeType = (e) => this.setState({
            type: e.target.value
        })
        this.submit = this._submit.bind(this)
    }
    componentWillMount() {
        Request
            .get(`/api/tag/${this.props.params.id}`)
            .end((err,res) => {
                this.setState({
                    text: res.body.text,
                    image: res.body.image,
                    description: res.body.description ? res.body.description : '',
                    type: res.body.type ? res.body.type : '',
                    classifications: res.body.classifications
                })
            })
    }
    _onDropImage(files) {
        let file = files[0];
        let uploadKey = `tag/cover/${this.props.params.id}.${Math.random().toString().substring(2,12)}`
        Request
            .get(`/api/uptoken?key=${uploadKey}`)
            .end((err,res) => {
                let uploadToken = res.body.uptoken
                Request
                    .post(`http://upload.qiniu.com/`)
                    .field('key', uploadKey)
                    .field('token', uploadToken)
                    .field('x:filename', file.name)
                    .field('x:size', file.size)
                    .attach('file', file, file.name)
                    .set('Accept', 'application/json')
                    .end((err, res) => {
                        this.setState({image: uploadKey});
                    });
            })
    }
    _submit(e) {
        e.preventDefault()
        let {
            image,
            description,
            type,
        } = this.state
        Request
            .post(`/api/tag/${this.props.params.id}`)
            .send({
                image,
                description,
                type,
            })
            .end((err, res) => {
                alert("success!")
            })
        return false
    }
    render() {
        return(
            <div className="content">
                <div className="box box-solid">
                  <div className="box-body pad">
                    <Form className="pl-form" horizontal>
                        <FormGroup>
                          <Col className="control-label" sm={3}><strong>编辑</strong></Col>
                          <Col sm={9}>
                            <FormControl.Static>{this.state.text}</FormControl.Static>
                          </Col>
                        </FormGroup>
                        <FormGroup>
                          <Col className="control-label" sm={3}><strong>标签类别</strong></Col>
                          <Col sm={9}>
                            <select value={this.state.type} className="form-control" onChange={this.changeType}>
                              <option value="">普通标签</option>
                              <option value="charactar">动漫人物</option>
                              <option value="company">品牌公司</option>
                              <option value="event">活动</option>
                            </select>
                          </Col>
                        </FormGroup>
                        <FormGroup>
                          <Col className="control-label" sm={3}><strong>Description</strong></Col>
                          <Col sm={9}>
                            <textarea className="form-control" value={this.state.description} onChange={this.changeDescription}></textarea>
                          </Col>
                        </FormGroup>
                        <FormGroup>
                          <Col className="control-label" sm={3}><strong>上传标签图片</strong></Col>
                          <Col sm={9}>
                            <Dropzone onDrop={this.onDropImage} style={{width:150, height:100, borderWidth: 2, borderColor: '#666', borderStyle: 'dashed'}}>
                                <div>将图片拖入该区域</div>
                            </Dropzone>
                          </Col>
                        </FormGroup>
                        {
                            this.state.image !== '' ?
                            <img className="img-responsive cover-img col-sm-offset-3" src={CDN.show(this.state.image)} />
                            :null
                        }
                      <br/>
                      <button className="btn btn-default col-sm-offset-3" onClick={this.submit}>Submit</button>
                    </Form>
                  </div>
                </div>
            </div>
        )
    }
}



