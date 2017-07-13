import React,{ Component } from 'react'
import { Form, FormGroup, Row, Col, Checkbox, FormControl, Alert, Modal } from 'react-bootstrap'
import Dropzone from 'react-dropzone'
import CDN from '../../widgets/cdn'
import Request from 'superagent'
import TagsInput from 'react-tagsinput'
const _ = require('lodash')
export default class EditTag extends Component{
    constructor(props) {
        super(props)
        this.state = {
            id: this.props.match.params.id,
            text: '',
            image: '',
            cover: '',
            type: '',
            description: '',
            classifications:[],
            otherInfo:[],
            newKey: '',
            newValue: '',
            alias:[],
            cls:[],

            openTag:false
        }
        this.onDropImage = this._onDropImage.bind(this)
        this.onDropCover = this._onDropCover.bind(this)
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
        this.closeTag = () => this.setState({openTag:false})
        this.removeTagClassification = (tid,c) => this._removeTagClassification(tid,c)
        this.setTagClassification = (tid,cid) => this._setTagClassification(tid,cid)
    }
    componentWillMount() {
        if(!this.props.classLoaded){
            this.props.fetchTagClass()
        }
        Request
            .get(`/api/tag/${this.state.id}`)
            .end((err,res) => {
                this.setState({
                    text: res.body.text,
                    image: res.body.image,
                    cover: res.body.cover || '',
                    description: res.body.description || '',
                    type: res.body.type || '',
                    classifications: res.body.classifications,
                    otherInfo:res.body.otherInfo || [],
                    alias: res.body.alias.length ? res.body.alias : [],
                    cls:res.body.cls.length ? res.body.cls : [],
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
        let uploadKey = `tag/image/${this.state.id}.${Math.random().toString().substring(2,12)}`
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
    _onDropCover(files) {
        let file = files[0];
        let uploadKey = `tag/cover/${this.state.id}.${Math.random().toString().substring(2,12)}`
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
                        this.setState({cover: uploadKey});
                    });
            })
    }
    _submit(e) {
        e.preventDefault()
        let {
            image,
            cover,
            description,
            type,
            otherInfo,
            alias,
        } = this.state
        let data = {
            image,
            cover,
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
            .post(`/api/tag/${this.state.id}`)
            .send(data)
            .end((err, res) => {
                alert("success!")
            })
        return false
    }
    _removeTagClassification(tid,cid) {
        let index = this.state.cls.indexOf(cid)
        if(index !== -1) {
            let tmpCls = this.state.cls
            tmpCls.splice(index,1)
            this.setState({
                cls:tmpCls
            },() => {
                Request
                .del(`/api/tag/${tid}/class/${cid}`)
                .end((err, res) => {
                })
            })
        }

    }
    _setTagClassification(tid,cid) {
        let tmpCls = this.state.cls
        tmpCls.push(cid)
        this.setState({
            cls:tmpCls
        },() => {
            Request
            .post(`/api/tag/${tid}/class/${cid}`)
            .end((err, res) => {
            })
        })

    }
    render() {
        let cls = _.filter(this.props.classifications,c => this.state.cls.indexOf(c.id) === -1 )
        return(
            <div className="portlet bordered light">
				<div className="portlet-title">
					<div className="caption">
						<span className="caption-subject font-blue-sharp bold uppercase">标签编辑器</span>
					</div>
				</div>
				<div className="portlet-body py-5">
                    <Form horizontal  onSubmit={(e) => e.preventDefault()}>
                        <FormGroup>
                            <Col className="control-label" sm={2}>编辑</Col>
                            <Col sm={9}>
                                <FormControl.Static>{this.state.text}</FormControl.Static>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col className="control-label" sm={2}>标签类别</Col>
                            <Col sm={7}>
                                <select value={this.state.type} className="form-control" onChange={this.changeType}>
                                <option value="">普通标签</option>
                                <option value="company">品牌公司</option>
                                <option value="character">动漫人物</option>
                                <option value="series">玩具系列</option>
                                <option value="person">真人</option>
                                <option value="origin">原著</option>
                                <option value="topic">话题</option>
                                <option value="event">活动</option>
                                <option value="media">媒体</option>
                                </select>
                            </Col>
                            <Col sm={2}>
                                <span onClick={() => this.setState({openTag:true})} className="btn btn-sm"><i className="fa fa-th-large"></i></span>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col className="control-label" sm={2}>别名</Col>
                            <Col sm={9}>
                                <TagsInput value={this.state.alias} onChange={(alias) => this.handleTagsChange(alias)} />
                            </Col>
                            </FormGroup>
                        <FormGroup>
                            <Col className="control-label" sm={2}>详细描述</Col>
                            <Col sm={9}>
                                <textarea className="form-control" value={this.state.description} onChange={this.changeDescription}></textarea>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col className="control-label" sm={2}>其他信息</Col>
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
                                        <button className="btn btn-outline blue" onClick={this.addOtherInfo}>添加</button>
                                    </Col>
                                </Row>
                            </Col>
                        </FormGroup>
                        <FormGroup>
							<Col className="control-label" sm={2}>上传图片</Col>
							<Col xs={6} sm={3}>
								<Dropzone accept="image/jpeg, image/png" onDrop={this.onDropImage} className="play-dropzone-style">
									<div>将图片拖入此区域</div>
								</Dropzone>
							</Col>
							<Col xs={6} sm={3}>
								{
                                    this.state.image !== '' ?
                                    <img className="img-responsive cover-img" style={{height:100,width:'auto'}} src={CDN.show(this.state.image)} />
                                    :null
                                }
							</Col>
						</FormGroup>
                        <FormGroup>
							<Col className="control-label" sm={2}>上传封面</Col>
							<Col xs={6} sm={3}>
								<Dropzone accept="image/jpeg, image/png" onDrop={this.onDropCover} className="play-dropzone-style">
									<div>将图片拖入此区域</div>
								</Dropzone>
							</Col>
							<Col xs={6} sm={3}>
								{
                                    this.state.cover !== '' ?
                                    <img className="img-responsive cover-img" style={{height:100,width:'auto'}} src={CDN.show(this.state.cover)} />
                                    :null
                                }
							</Col>
						</FormGroup>
                    </Form>
                    <div className="portlet-body py-5" style={{borderTop:'1px solid #eef1f5'}}>
						<Col sm={2} smOffset={2}>
							<button className="btn btn-outline green" type="button" onClick={this.submit}>Submit</button>
						</Col>
					</div>
				</div>
                <Modal className='modal-container' animation={false} show={this.state.openTag} onHide={this.closeTag}>
                    <Modal.Body>
                        <strong>已选类别</strong>
                        <div>
                            {
                                this.state.cls.map(c =>{
                                    return (
                                        <span key={'t_c_m_'+c}
                                        onClick={ () => this.removeTagClassification( this.state.id, c) }
                                        className="label label-warning label-margin" >{_.isEmpty(this.props.classifications) ? c : this.props.classifications[c].name}</span>);
                                })
                            }
                        </div>
                        <strong>全部类别</strong>
                        <div>
                            {
                                cls.map((c,key) => {
                                    return (
                                        <span key={'c_m_'+key}
                                        className='label label-info label-margin'
                                        onClick={() => this.setTagClassification(this.state.id, c.id)}>{c.name}</span>
                                    )
                                })
                            }
                        </div>
                    </Modal.Body>
                </Modal>
			</div>
        )
    }
}
