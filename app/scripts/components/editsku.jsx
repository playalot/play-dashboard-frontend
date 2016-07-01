var React = require('react');
var LinkedStateMixin = require('react-addons-linked-state-mixin');
var Reflux = require('reflux');
var Router = require('react-router');
var $ = require('jquery');
var _ = require('lodash');
var Dropzone = require('react-dropzone');
var Formsy = require('formsy-react');
var Modal = require('react-modal');
var RB = require('react-bootstrap');
var FRC = require('formsy-react-components');
import CDN from '../widgets/cdn';

var EditSku = React.createClass({
  contextTypes: {
    router: React.PropTypes.object
  },
  getInitialState: function() {
    return {
      cover: '',
      images: [],
      tags: [],
      otherInfo: [],
      newKey: '',
      newValue: '',
      alert: false
    };
  },
  componentDidMount: function() {
    $.get('/api/sku/'+this.props.params.id, function(data) {
      console.log(data);
      if (this.isMounted()) {
        this.refs.form.resetModel(data);
        var release = '';
        if (data.releaseDateMap.year) {
          release = data.releaseDateMap.year + '';
        }
        if (data.releaseDateMap.month) {
          release = release + '/' + data.releaseDateMap.month;
        }

        this.refs.release.setValue(release);
        this.setState({cover: data.cover, images: data.images, tags: data.tags});
      }
    }.bind(this));
  },
  onDropCover: function(images) {
    console.log(images);
    var formData = new FormData();
    formData.append('file', images[0]);
    $.ajax({
         url : '/api/upload?key=sku/cover/'+this.props.params.id + '.jpg',
         type : 'POST',
         data : formData,
         processData: false,  // tell jQuery not to process the data
         contentType: false,  // tell jQuery not to set contentType
         success : function(data) {
             console.log(data);
             this.refs.cover.setValue(data);
             this.setState({cover: data});
         }.bind(this)
    });
  },
  onDropOfficialImage: function(images) {
    console.log(images);
    var formData = new FormData();
    formData.append('file', images[0]);
    $.ajax({
         url : '/api/upload?key=sku/img/'+this.props.params.id + '_' + (Date.now() / 1000) + '.jpg',
         type : 'POST',
         data : formData,
         processData: false,  // tell jQuery not to process the data
         contentType: false,  // tell jQuery not to set contentType
         success : function(data) {
             console.log(data);
             this.state.images.push(data);
             this.setState({images: this.state.images});
         }.bind(this)
    });
  },
  onChangeNewKey: function(e) {
    this.setState({newKey: e.target.value});
  },
  onChangeNewValue: function(e) {
    this.setState({newValue: e.target.value});
  },
  addInfo: function(e) {
    this.state.otherInfo.push({ key:this.state.newKey, value:this.state.newValue });
    this.setState({otherInfo: this.state.otherInfo, newKey:'', newValue:''});
    e.preventDefault();
  },
  removeInfo: function(key) {
    var newInfo = _.filter(this.state.otherInfo, function(info){
      return info.key !== key;
    });
    this.setState({otherInfo: newInfo});
  },
  submit: function(model) {
    model.images = this.state.images;
    model.tags = this.state.tags;
    model.otherInfo = this.state.otherInfo;
    var filteredModel = _.pickBy(model, function(value){
      return value !== '' && value !== null;
    });

    if (filteredModel.money) {
      filteredModel.money = parseInt(filteredModel.money);
    }

    if (filteredModel.scale) {
      filteredModel.scale = parseInt(filteredModel.scale);
    }

    console.log(model);
    console.log('Filtered model:');
    console.log(filteredModel);

    $.ajax({
      url: '/api/sku/'+this.props.params.id,  //Server script to process data
      type: 'POST',
      data: JSON.stringify(filteredModel),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function(res) {
        console.log(res);
        this.setState({alert: true});
      }.bind(this)
    });
  },
  onConfirm: function() {
    this.context.router.push('/sku');
  },
  onClose: function() {
     this.setState({alert: false});
  },
  render: function() {
    var customStyles = {
      content : {
        zIndex                : 3,
        width                 : '300px',
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
      }
    };

    return (
      <div className="content">
        <div className="box box-solid">
          <div className="box-body">
            <Formsy.Form ref="form" className="pl-form form-horizontal" onSubmit={this.submit} >
              <fieldset>
                <legend>基本信息 <small>{' ' + this.props.params.id}</small> </legend>
                <FRC.Input ref="nameRaw" name="nameRaw" id="nameRaw" value="" label="原名" type="text" />
                <FRC.Input ref="name" name="name" id="name" value="" label="中文名" type="text" />
                <FRC.Input ref="taobaoId" name="taobaoId" id="taobaoId" value="" label="淘宝ID" type="text" />
                <FRC.Input ref="release" name="release" id="release" value="" label="发售日" type="text" placeholder="YYYY/MM"
                  elementWrapperClassName={[{'col-sm-9': false}, 'col-sm-5']}
                  />
                <FRC.Input ref="money" name="money" id="money" value="" label="价格" type="number"
                  elementWrapperClassName={[{'col-sm-9': false}, 'col-sm-5']}
                />
                <FRC.Select name="currency" label="货币"
                  options={[{value:'', label:''},{value:'yen', label:"日元"}, {value:'rmb', label:"人民币"}, {value:'dollar', label:"美元"}, {value:'euro', label:"欧元"}]}
                  elementWrapperClassName={[{'col-sm-9': false}, 'col-sm-5']}
                  />
                <FRC.Input ref="scale" name="scale" id="scale" value="" label="比例" type="text"
                  elementWrapperClassName={[{'col-sm-9': false}, 'col-sm-5']}
                  addonBefore={<span>1 : </span>}
                  />
                <FRC.Checkbox name="isR18" value={false} label="" rowLabel="R18" />
                <FRC.Input ref="companyName" name="companyName" id="companyName" value="" label="公司" type="text"
                  elementWrapperClassName={[{'col-sm-9': false}, 'col-sm-5']}
                  />
                <FRC.Textarea rows={5} cols={50} name="detail" label="详细描述" />
                <FRC.Input ref="cover" name="cover" id="cover" value="" label="封面" type="text" disabled />
                <div className="row">
                  <Dropzone onDrop={this.onDropCover} className="col-sm-offset-3 col-sm-2" style={{width:150, height:100, borderWidth: 2, borderColor: '#666', borderStyle: 'dashed'}}>
                    <div>将图片拖入该区域</div>
                  </Dropzone>
                  <div className="col-sm-3">
                    <img className="img-responsive" style={{maxHeight:'100px'}} src={this.state.cover?CDN.show(this.state.cover):''}/>
                  </div>
                </div>
              </fieldset>
              <fieldset>
                <legend>其他信息</legend>
                {this.state.otherInfo.map(function (info) {
                  return (<div className="row" key={'info_'+info.key}><span className="col-sm-offset-3 col-sm-2">{info.key}</span><span className="col-sm-2">{info.value}</span><i className="fa fa-minus-circle" onClick={this.removeInfo.bind(this, info.key)}></i><br/></div>);
                }, this)}
                <div className="form-group row">
                  <div className="col-sm-12">
                    <div className="input-group" style={{width:'100%'}}>
                      <input style={{width:'25%'}} className="form-control col-sm-offset-3 col-sm-1" type="text" onChange={this.onChangeNewKey} placeholder="key"></input>
                      <input style={{width:'25%'}} className="form-control col-sm-1"  type="text" onChange={this.onChangeNewValue} placeholder="value"></input>
                      <button className="btn btn-primary" onClick={this.addInfo}>添加</button>
                    </div>
                  </div>
                </div>
              </fieldset>
              <fieldset>
                <legend>官方图片</legend>
                <div>
                  <Dropzone onDrop={this.onDropOfficialImage} className="col-sm-2" style={{height:100, borderWidth: 2, borderColor: '#666', borderStyle: 'dashed'}}>
                    <p>将图片拖入该区域</p>
                  </Dropzone>
                  {this.state.images.map(function (img) {
                    return (
                      <div className="pull-left" style={{'margin-left':'5px'}} key={'img_'+img}>
                        <img className="img-responsive" style={{maxHeight:'100px'}} src={img?CDN.show(img):''}/>
                      </div>
                    );
                  }, this)}
                </div>
              </fieldset>
              <fieldset>
                <br/>
                <br/>
                <br/>
                <FRC.Row layout={'horizontal'}>
                  <input name="submit" className="btn btn-primary" formNoValidate={true} type="submit" defaultValue="保存" />
                </FRC.Row>
              </fieldset>
            </Formsy.Form>
          </div>
        </div>
        <Modal
          isOpen={this.state.alert}
          style={customStyles}
          onRequestClose={this.onClose} >
          <div className="static-modal">
            <RB.Modal.Body>
              更新成功
            </RB.Modal.Body>
            <RB.Modal.Footer>
              <RB.Button bsStyle="primary"　onClick={this.onConfirm}>确定</RB.Button>
            </RB.Modal.Footer>
          </div>
        </Modal>
      </div>
    );
  }
});

module.exports = EditSku;
