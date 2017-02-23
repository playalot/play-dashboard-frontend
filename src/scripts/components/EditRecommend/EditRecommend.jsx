import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import CDN from '../../widgets/cdn'
import { Modal, Button,Form, FormGroup, Col, FormControl, Row,Radio } from 'react-bootstrap'
import Request from 'superagent'

export default class EditBannerSet extends Component {
  constructor(props) {
    super(props)
    this.state = {
      image:'',
      id:'',
      title:'',
      type:'',
      targetId:'',
      targetType:'',
      targetUrl:'',
      titleError:null
    }
    this.submit = this._submit.bind(this)
    this.onDropImage = this._onDropImage.bind(this)
    this.onChangeTitle = (e) => {
      const title = e.target.value
      this.setState({
        title,
        titleError:title.trim() ? null : 'error'
      })
    }

  }
  componentDidMount() {
    Request
    .get(`/api/recommend/${this.props.params.id}`)
    .end((err,res) => {
      if(!err) {
        const { id,image,targetId,targetType,targetUrl,title,type } = res.body
        this.setState({
          id:id||'',
          image:image||'',
          targetId:targetId||'',
          targetType:targetType||'page',
          targetUrl:targetUrl||'',
          title:title||'No title',
          type:type||'banner'
        })
      }
    })
  }
  _onDropImage(images) {
    let formData = new FormData()
    formData.append('file', images[0])
    $.ajax({
      url: `/api/upload?key=recommend_${this.props.params.id+Date.now()}.jpg&temp=false`,
      type: 'POST',
      data: formData,
      processData: false, // tell jQuery not to process the data
      contentType: false, // tell jQuery not to set contentType
      success: (data) => {
        this.setState({
          image: data
        })
      }
    })
  }
  _submit() {

    const { id,image,targetId,targetType,targetUrl,title,type } = this.state
    const data = {
      id,image,targetId,targetType,targetUrl,title,type
    }
    Object.keys(data).forEach(key => !data[key] ? delete data[key] : null)
    Request
    .post(`/api/recommend/${this.props.params.id}`)
    .send(data)
    .end((err,res) =>{
      if(!err){
        if(confirm('保存成功')){
          this.context.router.push('/explorepage')
        }
      }
    })
  }
  render() {
    const radioOptions = [
        {value: 'post', label: '图片'},
        {value: 'tag', label: '标签'},
        {value: 'user', label: '用户'},
        {value: 'url', label: 'URL链接'},
        {value: 'page', label: '文章'},
        {value: 'toy', label: '玩具'},
        {value: 'promotion', label: '商品集'},
        {value: 'toyindex', label: '玩具集'},
    ]
    const typeOptions = [
        {value: 'banner', label: '发现页面Banner'},
        {value: 'toy', label: '玩具页面Banner'},
        {value: 'home', label: '首页推荐'},
        {value: 'theme', label: '主题'}
    ];
    return (
      <div className="content">
        <div className="box box-solid">
          <div className="box-body">
            <Form horizontal>
              <FormGroup>
                <Col sm={3} className="sm-2-label" style={{fontWeight:'bold'}}>
                  ID
                </Col>
                <Col sm={8}>
                  <FormControl.Static>{this.state.id}</FormControl.Static>
                </Col>
              </FormGroup>
              <FormGroup validationState={this.state.titleError}>
                <Col sm={3} className="sm-2-label" style={{fontWeight:'bold'}}>
                  标题*
                </Col>
                <Col sm={8}>
                  <FormControl value={this.state.title} type="text" onChange={this.onChangeTitle}/>
                </Col>
              </FormGroup>
              <FormGroup>
                <Col sm={3} className="sm-2-label" style={{fontWeight:'bold'}}>
                  位置
                </Col>
                <Col sm={8}>
                  {
                    typeOptions.map((type,i) => {
                      return(
                        <Radio key={`type_${i}`} inline name="type" value={type.value} onChange={(e) => this.setState({type:e.target.value})}  checked={type.value == this.state.type}>{type.label}</Radio>
                      )
                    })
                  }
                </Col>
              </FormGroup>
              <FormGroup>
                <Col sm={3} className="sm-2-label" style={{fontWeight:'bold'}}>
                  目标类型
                </Col>
                <Col sm={8}>
                  {
                    radioOptions.map((targetType,i) => {
                      return(
                        <Radio key={`target_type_${i}`} inline name="targetType" value={targetType.value} onChange={(e) => this.setState({targetType:e.target.value})} checked={targetType.value == this.state.targetType}>{targetType.label}</Radio>
                      )
                    })
                  }
                </Col>
              </FormGroup>
              <FormGroup>
                <Col sm={3} className="sm-2-label" style={{fontWeight:'bold'}}>
                  目标ID
                </Col>
                <Col sm={8}>
                  <FormControl value={this.state.targetId} type="text" onChange={(e) => this.setState({targetId:e.target.value})}/>
                </Col>
              </FormGroup>
              <FormGroup>
                <Col sm={3} className="sm-2-label" style={{fontWeight:'bold'}}>
                  目标Url
                </Col>
                <Col sm={8}>
                  <FormControl value={this.state.targetUrl} type="text" onChange={(e) => this.setState({targetUrl:e.target.value})}/>
                </Col>
              </FormGroup>
              <FormGroup>
                <Col sm={3} className="sm-2-label" style={{fontWeight:'bold'}}>
                  图片
                </Col>
                <Col sm={8}>
                  <FormControl.Static>{this.state.image}</FormControl.Static>
                </Col>
              </FormGroup>
              <FormGroup>
                <Col className="control-label" sm={3}><strong>上传封面</strong></Col>
                <Col sm={3}>
                  <Dropzone onDrop={this.onDropImage} style={{width:'100%',height:100, borderWidth: 2, borderColor: '#666', borderStyle: 'dashed'}}>
                      <div>将图片拖入此区域</div>
                  </Dropzone>
                </Col>
                <Col sm={3}>
                  {
                      this.state.image !== '' ?
                      <img className="img-responsive cover-img" style={{height:100,width:'auto'}} src={CDN.show(this.state.image)} />
                      :null
                  }
                </Col>
              </FormGroup>
            </Form>
            <Row>
              <Col sm={10} smOffset={3}>
                <Button bsStyle="primary" onClick={this.submit}>Submit</Button>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    )
  }
}

EditBannerSet.contextTypes = {
    router : React.PropTypes.object
}
