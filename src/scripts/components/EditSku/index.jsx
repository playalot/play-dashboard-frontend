import React, { Component } from 'react'
import { Form, FormGroup, Col, FormControl, Row, Button, ControlLabel } from 'react-bootstrap'
import Dropzone from 'react-dropzone'
import DatePicker from 'react-datepicker'
import Moment from 'moment'
import Request from 'superagent'
import parse from '../../widgets/parse'
import CDN from '../../widgets/cdn'
import { MERCHANTS } from '../../widgets/constant'
import { uploadImageWithWH } from '../../widgets/upload'
export default class EditSku extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isAddSku:true,
      id:'',
      name:'',
      cover:'',
      sid:'',
      quantity:100,
      originPrice:0,
      price:999,
      costPrice:0,
      freight:0,
      type:'inStock',
      prepay:0,
      orderClose:Moment(),
      merchant:'PLAY玩具控',
      version:'',
      tbUrl:'',
      note: '',
      image:'',
      images:[]
    }
    this.save = this._save.bind(this)
    this.changeOrderClose = (date) => this.setState({orderClose:date})
    this.onDropImage = (files) => uploadImageWithWH(files[0],'stock/image/').then(image => this.setState({image}))
  }
  componentWillMount() {
    const id = this.props.match.params.id
    const sid = parse(this.props.location.search).sid
    Request.get(`/api/toy/${id}`)
    .end((err,res) => {
      const { name,cover,images } = res.body
      this.setState({ id,name,cover,images })
    })
    if(sid){
      Request
      .get(`/api/toy/${id}/stock/${sid}`)
      .end((err,res) => {
        let stock = res.body
        this.setState({
          sid,
          quantity:stock.quantity || 100,
          merchant:stock.merchant || 'PLAY玩具控',
          price:stock.price || 9999,
          costPrice:stock.costPrice || 0,
          originPrice:stock.originPrice || 0,
          freight:stock.freight || 0,
          type:stock.preOrder ? 'preOrder' : 'inStock',
          prepay:stock.preOrder ? stock.preOrder.prepay : 0,
          orderClose: stock.preOrder ? Moment(stock.preOrder.orderClose) : Moment(),
          version: stock.version || '',
          tbUrl: stock.tbUrl || '',
          image: stock.image || '',
          note: stock.note || '',
          isAddSku:false
        })
      })
    }
  }
 
  _save() {
    const {
      id,sid,isAddSku,
      price,quantity,freight,prepay,orderClose,type,costPrice,originPrice,version,tbUrl,note,merchant,image
    } = this.state
    let data = {
      price:parseFloat(price),
      costPrice:parseFloat(costPrice),
      quantity:parseInt(quantity),
      freight:parseFloat(freight),
      preOrder:{
        prepay:parseFloat(prepay),
        orderClose:`${orderClose.format('YYYY-MM-DD')} 23:59:59`
      },
      version,tbUrl,note,merchant,image
    }
    type ==='preOrder' ? null:delete data['preOrder']
    version.trim() ? null : delete data['version']
    tbUrl.trim() ? null : delete data['tbUrl']
    note.trim() ? null : delete data['note']
    image.trim() ? null : delete data['image']
    if(isAddSku){
      Request
      .post(`/api/toy/${id}/stock`)
      .send(data)
      .end((err,res) => {
        if(err) {
          alert('保存失败！'+err);
          console.warn(err)
        }else{
          alert('保存成功')
        }
      })
    }else{
      Request
      .post(`/api/toy/${id}/stock/${sid}`)
      .send(data)
      .end((err,res) => {
        if(err) {
          alert('保存失败！'+err);
          console.warn(err)
        }else{
          alert('保存成功')
        }
      })
    }
  }
  render() {
    return(
      <div className="portlet bordered light">
        <div className="portlet-title">
          <div className="caption">
						<span className="caption-subject font-blue-sharp bold uppercase">
							{
								this.state.isAddSku ? '添加商品库存':'修改商品库存'
							}
						</span>
						<span className="text-muted">
							&nbsp;&nbsp;
							{this.state.name}
              &nbsp;&nbsp;
              <img style={{height:50}} src={CDN.show(this.state.cover)} alt=""/>
						</span>
					</div>
        </div>
        <div className="portlet-body py-5">
          <Form horizontal onSubmit={(e) => e.preventDefault()}>
            <FormGroup>
              <Col sm={3} className="sm-2-label">
                卖家
              </Col>
              <Col sm={4}>
                <FormControl componentClass="select" value={this.state.merchant} onChange={(e) => this.setState({merchant:e.target.value})}>
                  { MERCHANTS.map(m => <option key={`edit-sku-${m}`} value={m}>{m}</option>) }
                </FormControl>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col sm={3} className="control-label">
                版本
              </Col>
              <Col sm={4}>
                <FormControl value={this.state.version} type="text" onChange={(e) => this.setState({version:e.target.value})}/>
                <span className="help-block">默认为普通版</span>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col sm={3} className="control-label">
                库存数量
              </Col>
              <Col sm={4}>
                <FormControl value={this.state.quantity} type="number" onChange={(e) => this.setState({quantity:e.target.value})}/>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col sm={3} className="control-label">
                图片
              </Col>
              <Col sm={3}>
                <Dropzone accept="image/jpeg, image/png" onDrop={this.onDropImage} className="play-dropzone-style">
                  {
                    this.state.image ?
                    <img className="play-img-cover w-100 h-100" src={CDN.show(this.state.image) } alt=""/>
                    :<div>将图片拖入此区域</div>
                  }
								</Dropzone>
                
              </Col>
              
            </FormGroup>
            <FormGroup>
              <Col sm={3} className="control-label">
                图片库
              </Col>
              <Col sm={9}>
                {
                  this.state.images.map((image,i) => {
                    return(
                      <img onClick={() => this.setState({image})} className="mr-1 mb-1" src={CDN.show(image)} key={image} style={{maxHeight:100}} alt=""/>
                    )
                  })
                }
              </Col>
              
            </FormGroup>
            <hr/>
            <FormGroup>
              <Col sm={3} className="control-label">
                购买类型
              </Col>
              <Col sm={4} className="mt-2">
                <label>
                  <input type="radio" name="type" value="inStock" onChange={(e) => this.setState({type:e.target.value})} checked={this.state.type==='inStock'}/>现货
                </label>&nbsp;&nbsp;
                <label>
                  <input type="radio" name="type" value="preOrder" onChange={(e) => this.setState({type:e.target.value})} checked={this.state.type==='preOrder'}/>预定
                </label>
              </Col>
            </FormGroup>
            {
              this.state.type === 'preOrder' ?
              <FormGroup>
                <Col sm={3} className="control-label">
                  定金
                </Col>
                <Col sm={4}>
                  <FormControl value={this.state.prepay} type="number" onChange={(e) => this.setState({prepay:e.target.value})}/>
                </Col>
              </FormGroup>
              :null
            }
            {
              this.state.type === 'preOrder' ?
              <FormGroup>
                <Col sm={3} className="control-label">
                  截止时间
                </Col>
                <Col sm={4} className="mt-2">
                  <DatePicker
                    selected={this.state.orderClose}
                    onChange={this.changeOrderClose}
                    dateFormat="YYYY/MM/DD"
                  />
                </Col>
              </FormGroup>
              :null
            }
            <FormGroup>
              <Col sm={3} className="control-label">
                售价
              </Col>
              <Col sm={4}>
                <FormControl value={this.state.price} type="number" onChange={(e) => this.setState({price:e.target.value})}/>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col sm={3} className="control-label">
                进货成本价
              </Col>
              <Col sm={4}>
                <FormControl value={this.state.costPrice} type="number" onChange={(e) => this.setState({costPrice:e.target.value})}/>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col sm={3} className="control-label">
                运费
              </Col>
              <Col sm={4}>
                <FormControl value={this.state.freight} type="number" onChange={(e) => this.setState({freight:e.target.value})}/>
              </Col>
            </FormGroup>
            <hr/>
            <FormGroup>
              <Col sm={3} className="control-label">
                淘宝链接
              </Col>
              <Col sm={4}>
                <FormControl value={this.state.tbUrl} type="text" onChange={(e) => this.setState({tbUrl:e.target.value})}/>
                <span className="help-block">添加该产品淘宝链接</span>
              </Col>
            </FormGroup>
            <FormGroup controlId="formControlsTextarea">
              <Col sm={3} className="control-label">
                备注
              </Col>
              <Col sm={4}>
                <FormControl componentClass="textarea" value={this.state.note} onChange={(e) => this.setState({note:e.target.value})}/>
              </Col>
            </FormGroup>
          </Form>
          <div className="portlet-body py-5" style={{borderTop:'1px solid #eef1f5'}}>
            <Col sm={3} smOffset={2}>
              <button className="btn btn-outline green" type="button" onClick={this.save}>提交</button>
            </Col>
          </div>
        </div>
      </div>
    )
  }
}
