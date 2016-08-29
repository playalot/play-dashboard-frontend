import React,{ Component } from 'react'
import { Form, FormGroup, Row, Col, Checkbox, FormControl, Alert } from 'react-bootstrap'
import { Router } from 'react-router'
import Dropzone from 'react-dropzone'
import CDN from '../../widgets/cdn'
import Request from 'superagent'
import TagsInput from 'react-tagsinput'
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
            otherInfo:[],
            newKey: '',
            newValue: '',
            alias:[],
        }
        this.onDropImage = this._onDropImage.bind(this)
        this.changeDescription = (e) => this.setState({
            description: e.target.value
        })
        this.changeType = (e) => this.setState({
            type: e.target.value
        })
        this.removeOtherInfo = this._removeOtherInfo.bind(this)
        this.addOtherInfo = this._addOtherInfo.bind(this)
        this.changeNewKey = (e) => this.setState({newKey:e.target.value})
        this.changeNewValue = (e) => this.setState({newValue:e.target.value})
        this.handleTagsChange = (alias) => { this.setState({ alias }) }
        this.submit = this._submit.bind(this)
        this.stop = (e) => {
            if(e.keyCode === 13){
                e.preventDefault()
            }
        }
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
                    classifications: res.body.classifications,
                    otherInfo:res.body.otherInfo ? res.body.otherInfo : [],
                    alias: res.body.alias.length ? res.body.alias : [],
                })
            })
    }
    _removeOtherInfo(i) {
        let tmpArr = this.state.otherInfo
        tmpArr.splice(i,1)
        this.setState({
            otherInfo: tmpArr
        })
    }
    _addOtherInfo(e) {
        e.preventDefault()
        if(!this.state.newKey.trim() || !this.state.newValue.trim()){
            return alert('字段不能为空')
        }
        let tmpArr = this.state.otherInfo
        tmpArr.push({
            key:this.state.newKey,
            value:this.state.newValue
        })
        this.setState({
            otherInfo:tmpArr
        },() => {
            this.setState({
                newKey:'',
                newValue:''
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
            otherInfo,
            alias,
        } = this.state
        let data = {
            image,
            description,
            type,
            otherInfo,
            alias,
        }
        Object.keys(data).forEach(key => {
            if(!data[key]){
                delete data[key]
            }
        })
        Request
            .post(`/api/tag/${this.props.params.id}`)
            .send(data)
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
                              <option value="company">品牌公司</option>
                              <option value="character">动漫人物</option>
                              <option value="series">玩具系列</option>
                              <option value="person">真人</option>
                              <option value="origin">原著</option>
                              <option value="topic">话题</option>
                              <option value="event">活动</option>
                            </select>
                          </Col>
                        </FormGroup>
                        <FormGroup>
                          <Col className="control-label" sm={3}><strong>别名</strong></Col>
                          <Col sm={9}>
                            <TagsInput value={this.state.alias} onChange={(alias) => this.handleTagsChange(alias)} />
                          </Col>
                        </FormGroup>
                        <FormGroup>
                          <Col className="control-label" sm={3}><strong>详细描述</strong></Col>
                          <Col sm={9}>
                            <textarea className="form-control" value={this.state.description} onChange={this.changeDescription}></textarea>
                          </Col>
                        </FormGroup>
                        <FormGroup>
                          <Col className="control-label" sm={3}><strong>其他信息</strong></Col>
                          <Col sm={9}>
                            {
                                this.state.otherInfo.map((info,i) => {
                                    return (
                                        <Row key={`otherInfo_${i}`} >
                                            <Col  xs={3}>
                                                <span>{info.key}</span>
                                            </Col>
                                            <Col xs={3} >
                                                <span>{info.value}</span>
                                            </Col>
                                            <Col  xs={2} smOffset={1} xsOffset={1}>
                                                <span onClick={() => this.removeOtherInfo(i)} className="fa fa-minus-circle"></span>
                                            </Col>
                                        </Row>
                                    )
                                })
                            }
                            <Row>
                                <Col xs={3}>
                                    <input  className="form-control" type="text" value={this.state.newKey} onKeyDown={this.stop} onChange={this.changeNewKey} placeholder="key"></input>
                                </Col>
                                <Col xs={3} >
                                  <input  className="form-control"  type="text" value={this.state.newValue} onKeyDown={this.stop} onChange={this.changeNewValue} placeholder="value"></input>
                                </Col>
                                <Col  xs={2} smOffset={1} xsOffset={1}>
                                  <button className="btn btn-primary" onClick={this.addOtherInfo}>添加</button>
                                </Col>
                            </Row>
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



