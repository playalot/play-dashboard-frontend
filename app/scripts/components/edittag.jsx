var React = require('react');
var Reflux = require('reflux');
var Router = require('react-router');
var $ = require('jquery');
var TagStore = require('../stores/tagstore');
var TagClassStore = require('../stores/tagclassstore');
var TagActions = require('../actions/tagactions');
var Modal = require('react-modal');
var RB = require('react-bootstrap');
import Dropzone from 'react-dropzone';
import Request from 'superagent';
import CDN from '../widgets/cdn';

var TagForm = React.createClass({
  mixins: [Reflux.connect(TagStore, 'taglist'), Reflux.connect(TagClassStore, 'class')],
  contextTypes: {
    router: React.PropTypes.object
  },
  getInitialState: function() {
    return {
      id: this.props.params.id,
      text: '',
      image: '',
      type: '',
      description: '',
      classifications: [],
      alert: false
    };
  },
  componentDidMount: function() {
    $.ajax({
      url: '/api/tag/'+this.props.params.id,  //Server script to process data
      type: 'GET',
      success: function (data) {
        this.setState({
          text: data.text,
          image: data.image,
          description: data.description ? data.description: '',
          type: data.type ? data.type: '',
          classifications: data.classifications
        });
      }.bind(this)
    });
  },
  onChangeDescription: function(e) {
    this.setState({description: e.target.value});
  },
  onChangeType: function(e) {
    this.setState({type: e.target.value});
  },
  onDrop: function(files) {
    let _this = this;
    let file = files[0];
    let uploadKey = 'tag/cover/' + _this.props.params.id + '.' + file.name.split('.').pop();
    $.get('/api/uptoken?key='+uploadKey, function(data) {
      let uploadToken = data.uptoken;
      Request
        .post('http://upload.qiniu.com/')
        .field('key', uploadKey)
        .field('token', uploadToken)
        .field('x:filename', file.name)
        .field('x:size', file.size)
        .attach('file', file, file.name)
        .set('Accept', 'application/json')
        .end(function(err, res){
          _this.setState({image: uploadKey});
        });
    });
  },
  submitForm: function(e) {
    e.preventDefault();
    var data = {
      image: this.state.image
    };
    if (this.state.description.trim() !== '') {
      data.description = this.state.description;
    }
    if (this.state.type !== '') {
      data.type = this.state.type;
    }
    $.ajax({
      type: 'POST',
      url: '/api/tag/' + this.state.id,
      data: JSON.stringify(data),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function(tag) {
        var foundTag = _.find(this.state.taglist, function(t) {
          return t.id === tag.id;
        });
        if (foundTag !== null) {
          foundTag.description = this.state.description;
          foundTag.image = this.state.image;
          foundTag.type = this.state.type;
        }
        this.setState({alert: true});
      }.bind(this)
    });
    return false;
  },
  onConfirm: function() {
    this.context.router.push('/tag');
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
          <div className="box-header">
            <h3 style={{marginLeft:"45px"}}>编辑: {this.state.text}</h3>
          </div>
          <div className="box-body pad">
            <form ref="form" className="pl-form form-horizontal">
              <div className="row edit-section">
                <h5>标签类别</h5>
                <select defaultValue={this.state.type} onChange={this.onChangeType}>
                  <option value="">普通标签</option>
                  <option value="charactar">动漫人物</option>
                  <option value="company">品牌公司</option>
                  <option value="event">活动</option>
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="form-control" name="description" value={this.state.description} onChange={this.onChangeDescription} />
              </div>
              <div className="row edit-section">
                <Dropzone className="gallery-image dropzone" accept="image/*" onDrop={this.onDrop} multiple={false}>
                  <span>上传标签图片</span>
                </Dropzone>
                {this.state.image !== '' ?
                  <img className="img-responsive cover-img" src={CDN.show(this.state.image)} />
                  :null
                }
              </div>
              <br/>
              <button className="btn btn-default" onClick={this.submitForm}>Submit</button>
            </form>
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
        </div>
      </div>
    );
  }
});

module.exports = TagForm;
