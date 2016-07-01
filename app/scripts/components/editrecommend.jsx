var React = require('react');
var Reflux = require('reflux');
var Router = require('react-router');
var $ = require('jquery');
var Dropzone = require('react-dropzone');
var Formsy = require('formsy-react');
var Modal = require('react-modal');
var RB = require('react-bootstrap');
var FRC = require('formsy-react-components');
import CDN from '../widgets/cdn';

var EditBannerSet = React.createClass({
  contextTypes: {
    router: React.PropTypes.object
  },
  getInitialState: function() {
    return {
      image: "",
      alert: false
    };
  },
  componentDidMount: function() {
    $.get('/api/recommend/'+this.props.params.id, function(data) {
      console.log(data);
      if (this.isMounted()) {
        this.refs.form.resetModel(data);
        this.setState({image: data.image});
      }
    }.bind(this));
  },
  onConfirm: function() {
    this.context.router.push('/manage/explore');
  },
  onClose: function() {
     this.setState({alert: false});
  },
  onDropImage: function(images) {
    console.log(images);
    var formData = new FormData();
    formData.append('file', images[0]);
    $.ajax({
           url : '/api/upload?key=recommend_'+this.props.params.id + '.jpg&temp=false',
           type : 'POST',
           data : formData,
           processData: false,  // tell jQuery not to process the data
           contentType: false,  // tell jQuery not to set contentType
           success : function(data) {
               console.log(data);
               this.refs.image.setValue(data);
               this.setState({image: data});
           }.bind(this)
    });
  },
  submit: function(model) {
    console.log(model);
    var filteredModel = _.pickBy(model, function(value){
      return value !== '' && value !== null;
    });
    $.ajax({
      url: '/api/recommend/'+this.props.params.id,  //Server script to process data
      type: 'POST',
      data: JSON.stringify(filteredModel),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (res) {
        this.setState({alert: true});
      }.bind(this)
    });
  },
  render: function() {
    var radioOptions = [
        {value: 'post', label: '图片'},
        {value: 'tag', label: '标签'},
        {value: 'user', label: '用户'},
        {value: 'url', label: 'URL链接'},
        {value: 'page', label: '文章'},
        {value: 'toy', label: '玩具'},
        {value: 'promotion', label: '商品集'}
    ];
    var placeOptions = [
        {value: 'banner', label: '发现页面Banner'},
        {value: 'toy', label: '玩具页面Banner'},
        {value: 'home', label: '首页推荐'},
        {value: 'theme', label: '主题'}
    ];
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
                <FRC.Input ref="id" name="id" id="id" value={this.props.params.id} label="ID" type="text" disabled />
                <FRC.Input ref="title" name="title" id="title" value="" label="标题" type="text" placeholder="Input the banner title" required/>
                <FRC.RadioGroup name="place" type="inline" value="banner" label="位置" options={placeOptions} />
                <FRC.RadioGroup name="targetType" type="inline" value="post" label="目标类型" options={radioOptions} />
                <FRC.Input ref="targetId" name="targetId" id="targetId" value="" label="目标ID" type="text" placeholder="target id" />
                <FRC.Input ref="targetUrl" name="targetUrl" id="targetUrl" value="" label="目标Url" type="text" placeholder="target url" />
                <FRC.Input ref="image" name="image" id="image" value="" label="图片" type="text" disabled />
                <div className="row">
                  <img className="img-responsive col-sm-offset-3" style={{maxWidth:'150px'}} src={this.state.image?CDN.show(this.state.image):''}/>
                </div>
                <div className="row">
                  <div className="col-sm-offset-3">
                    <Dropzone onDrop={this.onDropImage} width={150} height={50}>
                      <div>更改图片</div>
                    </Dropzone>
                  </div>
                </div>
                <br></br>
              </fieldset>
              <FRC.Row layout={'horizontal'}>
                <input name="cancel" className="btn btn-default" type="button" defaultValue="Cancel" />
                {' '}
                <input name="submit" className="btn btn-primary" formNoValidate={true} type="submit" defaultValue="Submit" />
              </FRC.Row>
            </Formsy.Form>
          </div>
          <Modal
            isOpen={this.state.alert}
            style={customStyles}
            onRequestClose={this.onClose} >
            <div className="static-modal">
              <RB.Modal.Body>
                保存成功
              </RB.Modal.Body>
              <RB.Modal.Footer>
                <RB.Button bsStyle="primary"　onClick={this.onConfirm}>确定</RB.Button>
              </RB.Modal.Footer>
            </div>
          </Modal>
        </div>
      </div>
    );
  }
});

module.exports = EditBannerSet;
