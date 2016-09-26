/*global window, alert */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Dropzone from 'react-dropzone';
import Request from 'superagent';
import $ from 'jquery';
import Modal from 'react-modal';
var RB = require('react-bootstrap');

function isFunction(fn) {
  let getType = {};
  return fn && getType.toString.call(fn) === '[object Function]';
}

function makeid() {
    let text = '';
    const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for( let i=0; i < 10; i++ ) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoUrl: '',
      uploadUrl: 'http://upload.qiniu.com/',
      userId: '56f2b9811400000e0077d8f8',
      progress: 0,
      uploadKey: '',
      caption: '',
      alert: false
    };
    this.onDrop = this.onDrop.bind(this);
    this.changeCaption = this.changeCaption.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    this.onClose = this.onClose.bind(this);
  }
  changeCaption(e) {
    this.setState({caption:e.target.value});
  }
  uploadQiniu(file, uploadKey, uploadToken) {
    if (!file || file.size === 0) {
      return null;
    }
    const req = Request
      .post(this.state.uploadUrl)
      .field('key', uploadKey)
      .field('token', uploadToken)
      .field('x:filename', file.name)
      .field('x:size', file.size)
      .attach('file', file, file.name)
      .set('Accept', 'application/json');

    if (isFunction(file.onprogress)) {
      req.on('progress', file.onprogress);
    }
    req.end(function(err, res){
      console.log('done!');
    });
    return req;
  }
  onDrop(files) {
    let video = files[0];

    // 初始化progress
    let _this = this;
    video.onprogress = function(e) {
      console.log(e.percent);
      _this.setState({progress: e.percent.toFixed(2)});
    };

    // 获取视频meta
    let URL = window.URL || window.webkitURL;
    video.preview = URL.createObjectURL(video);

    let vdom = ReactDOM.findDOMNode(this.refs.vtag);

    this.setState({videoUrl: video.preview});

    let timer = setInterval(function () {
      if (vdom.readyState === 4){
        let d = new Date();
        let id = makeid();
        let uploadKey = 'user/video/file/' + id + '_' + Math.round(d.getTime()/1000) + '_w_' + vdom.videoWidth +
          '_h_' + vdom.videoHeight + '_d_' + Math.floor(vdom.duration) + '_' + _this.state.userId + '.mp4';
          console.log(uploadKey);
        $.ajax({
           url : '/api/uptoken?key=' + uploadKey,
           type : 'GET',
           success : function(data) {
             let uploadToken = data.uptoken;
             _this.setState({uploadKey: uploadKey});
             video.request = _this.uploadQiniu(video, uploadKey, uploadToken);
            //  video.uploadPromise = video.request.promise();
           }
        });
        clearInterval(timer);
      }
    }, 500);
  }
  onSubmit() {
    if (this.state.uploadKey === '') {
      alert('请先上传视频');
      return;
    }
    let data = {
      userId: this.state.userId,
      uploadKey: this.state.uploadKey
    };
    if (this.state.caption.trim() !== '') {
      data.caption = this.state.caption;
    }
    let _this = this;
    Request
      .post('/api/uploadvideo')
      .send(data)
      .set('ContentType', 'application/json')
      .end(function(err, res){
        console.log(err);
        console.log(res);
        _this.setState({alert: true});
        // Calling the end function will send the request
      });
    // $.ajax({
    //    url : '/api/uploadvideo',
    //    type : 'POST',
    //    data: JSON.stringify(data),
    //    contentType: 'application/json; charset=utf-8',
    //    dataType: 'json',
    //    success : function() {
    //      this.setState({alert: true});
    //    }.bind(this)
    // });
  }
  onConfirm() {
    this.setState({
      videoUrl: '',
      progress: 0,
      uploadKey: '',
      caption: '',
      alert: false
    });
  }
  onClose() {
     this.setState({alert: false});
  }
  render() {
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
    let dropZoneStyles = {
        margin: '20px auto',
        border: '2px dashed #ccc',
        borderRadius: '5px',
        width: '300px',
        height: '200px',
        color: '#aaa'
    };
    return (
      <div className="content">
        <div className="row">
          <Dropzone onDrop={this.onDrop} multiple={false} className="col-sm-3" style={dropZoneStyles}>
            <div>将视频文件拖入该区域</div>
          </Dropzone>
          <div className="col-sm-3">
            <p>{'USERID: ' + this.state.userId}</p>
            <p>{this.state.uploadKey}</p>
            <p>{(this.state.progress || 0) + '% uploaded'}</p>
          </div>
          <div className="col-sm-3">
            <video ref="vtag" className="" src={this.state.videoUrl} controls></video>
          </div>
        </div>
        <div className="row">
          <textarea onChange={this.changeCaption} value={this.state.caption} />
        </div>
        <div className="row">
          <div className="btn btn-primary" onClick={this.onSubmit}>提交</div>
        </div>
        <Modal
          isOpen={this.state.alert}
          style={customStyles}
          onRequestClose={this.onClose} >
          <div className="static-modal">
            <RB.Modal.Body>
              提交成功
            </RB.Modal.Body>
            <RB.Modal.Footer>
              <RB.Button bsStyle="primary"　onClick={this.onConfirm}>确定</RB.Button>
            </RB.Modal.Footer>
          </div>
        </Modal>
      </div>
    );
  }
}
