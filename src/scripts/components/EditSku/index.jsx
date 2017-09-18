import React, { Component } from 'react'
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
      <div>
        <div>
          <div>
						<span className="text-primary">
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
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group row">
              <label className="col-sm-3 col-form-label text-right">卖家</label>
              <div className="col-sm-4">
                <select className="form-control" value={this.state.merchant} onChange={(e) => this.setState({merchant:e.target.value})}>
                  { MERCHANTS.map(m => <option key={`edit-sku-${m}`} value={m}>{m}</option>) }
                </select>

              </div>
            </div>
            <div className="row mb-2">
              <label className="col-3 col-form-label text-right">版本</label>
              <div className="col-sm-4">
                <input className="form-control" value={this.state.version} type="text" onChange={(e) => this.setState({version:e.target.value})}/>
                <small className="form-text text-muted">默认为普通版</small>
              </div>
            </div>
            <div className="row mb-2">
              <label className="col-3 col-form-label text-right">库存数量</label>
              <div className="col-sm-4">
                <input className="form-control" value={this.state.quantity} type="number" onChange={(e) => this.setState({quantity:e.target.value})}/>
              </div>
            </div>
            <div className="row mb-2">
              <label className="col-3 col-form-label text-right">图片</label>
              <div className="col-sm-4">
                <Dropzone accept="image/jpeg, image/png" onDrop={this.onDropImage} className="play-dropzone-style">
                  {
                    this.state.image ?
                    <img className="play-img-cover w-100 h-100" src={CDN.show(this.state.image) } alt=""/>
                    :<div>将图片拖入此区域</div>
                  }
								</Dropzone>
              </div>
            </div>
            <div className="row">
              <label className="col-3 col-form-label text-right">图片库</label>
              <div className="col-sm-9">
                {
                  this.state.images.map((image,i) => {
                    return(
                      <img onClick={() => this.setState({image})} className="mr-1 mb-1" src={CDN.show(image)} key={image} style={{maxHeight:100}} alt=""/>
                    )
                  })
                }
              </div>
            </div>
            <hr/>
            <div className="row">
              <label className="col-3 col-form-label text-right">购买类型</label>
              <div className="col-sm-4 my-auto">
                <label>
                  <input type="radio" name="type" value="inStock" onChange={(e) => this.setState({type:e.target.value})} checked={this.state.type==='inStock'}/>现货
                </label>&nbsp;&nbsp;
                <label>
                  <input type="radio" name="type" value="preOrder" onChange={(e) => this.setState({type:e.target.value})} checked={this.state.type==='preOrder'}/>预定
                </label>
              </div>
            </div>
            {
              this.state.type === 'preOrder' ?
              <div className="row mb-2">
                <label className="col-3 col-form-label text-right">定金</label>
                <div className="col-sm-4">
                  <input className="form-control" value={this.state.prepay} type="number" onChange={(e) => this.setState({prepay:e.target.value})}/>
                </div>
              </div>
              :null
            }
            {
              this.state.type === 'preOrder' ?
              <div className="row mb-2">
                <label className="col-3 col-form-label text-right">截止时间</label>
                <div className="col-sm-4">
                  <DatePicker
                    selected={this.state.orderClose}
                    onChange={this.changeOrderClose}
                    dateFormat="YYYY/MM/DD"
                  />
                </div>
              </div>
              :null
            }
            <div className="row mb-2">
              <label className="col-3 col-form-label text-right">售价</label>
              <div className="col-sm-4">
                <input className="form-control" value={this.state.price} type="number" onChange={(e) => this.setState({price:e.target.value})}/>
              </div>
            </div>
            <div className="row mb-2">
              <label className="col-3 col-form-label text-right">进货成本价</label>
              <div className="col-sm-4">
                <input className="form-control" value={this.state.costPrice} type="number" onChange={(e) => this.setState({costPrice:e.target.value})}/>
              </div>
            </div>
            <div className="row mb-2">
              <label className="col-3 col-form-label text-right">运费</label>
              <div className="col-sm-4">
                <input className="form-control" value={this.state.freight} type="number" onChange={(e) => this.setState({freight:e.target.value})}/>
              </div>
            </div>
            <hr/>
            <div className="row mb-2">
              <label className="col-3 col-form-label text-right">淘宝链接</label>
              <div className="col-sm-4">
                <input className="form-control" value={this.state.tbUrl} type="text" onChange={(e) => this.setState({tbUrl:e.target.value})}/>
                <small className="form-text text-muted">添加该产品淘宝链接</small>
              </div>
            </div>
            <div className="row mb-2">
              <label className="col-3 col-form-label text-right">备注</label>
              <div className="col-sm-4">
                <textarea className="form-control" value={this.state.note} onChange={(e) => this.setState({note:e.target.value})}></textarea>
              </div>
            </div>
          </form>
          <div className="row py-5">
            <div className="col-sm-3"></div>
            <div className="col-sm-3">
              <button className="btn btn-outline-primary" type="button" onClick={this.save}>提交</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
