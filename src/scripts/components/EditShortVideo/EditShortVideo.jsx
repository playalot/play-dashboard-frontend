import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Dropzone from 'react-dropzone';
import Request from 'superagent';
import { Modal,Button,FormGroup,FormControl,Col,Row,Form } from 'react-bootstrap'
import CDN from '../../widgets/cdn'
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
      title:'',
      progress: 0,
      uploadKey: '',
      caption: '',
      alert: false,
      offset:1,
      modalPoster:false,
      posters:[],
      thumbnail:''
    };
    this.onDrop = this._onDrop.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.uploadCover = this._uploadCover.bind(this)
  }
  uploadQiniu(file, uploadKey, uploadToken) {
    if (!file || file.size === 0) {
      return null;
    }
    return Request
      .post(this.state.uploadUrl)
      .field('key', uploadKey)
      .field('token', uploadToken)
      .field('x:filename', file.name)
      .field('x:size', file.size)
      .attach('file', file, file.name)
      .set('Accept', 'application/json')
      .on('progress',file.onprogress)
      .end((err, res) => {
        let vdom = ReactDOM.findDOMNode(this.refs.vtag)
        this.setState({showPoster:true,duration:vdom.duration})
      })
  }
  _onDrop(files) {
    let video = files[0];

    // 初始化progress
    let _this = this;
    video.onprogress = function(e) {
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
        let uploadKey = 'user/video/raw/' + id + '_' + Math.round(d.getTime()/1000) + '_w_' + vdom.videoWidth +
          '_h_' + vdom.videoHeight + '_d_' + Math.floor(vdom.duration) + '_' + _this.state.userId + '.mp4';
        $.ajax({
           url : '/api/uptoken?key=' + uploadKey,
           type : 'GET',
           success : function(data) {
             let uploadToken = data.uptoken;
             _this.setState({uploadKey: uploadKey,thumbnail:`http://img.playalot.cn/${uploadKey}?vframe/jpg/offset/1`});
             video.request = _this.uploadQiniu(video, uploadKey, uploadToken);
            //  video.uploadPromise = video.request.promise();
           }
        });
        clearInterval(timer);
      }
    }, 500);
  }
  _uploadCover(files) {
    Request.get('/api/uptoken')
      .end((err, res) => {
          let uploadToken = res.body.uptoken
          const file = files[0]
          const img = new Image()
          img.onload = () => {
              if(img.width <320){
                  return alert('图片太小')
              }
              const uploadKey = `user/video/thumbnail/${Math.round(Date.now() / 1000)}_w_${img.width}_h_${img.height}_${makeid()}.${file.name.split('.').pop()}`
              Request
              .post(this.state.uploadUrl)
              .field('key', uploadKey)
              .field('token', uploadToken)
              .field('x:filename', file.name)
              .field('x:size', file.size)
              .attach('file', file, file.name)
              .set('Accept', 'application/json')
              .end((err, res) =>{
                  const posters = this.state.posters
                  posters.push(uploadKey)
                  this.setState({posters,thumbnail:CDN.show(uploadKey)})
              })
          };
          img.src = file.preview
      })
  }
  onSubmit() {
    if (this.state.uploadKey === '') {
      alert('请先上传视频');
      return;
    }
    let data = {
      userId: this.state.userId,
      uploadKey: this.state.uploadKey,
      thumbnail:this.state.thumbnail
    };
    if (this.state.caption.trim() !== '') {
      data.caption = this.state.caption
    }
    if (this.state.title.trim() !== '') {
      data.title = this.state.title
    }
    Request
      .post('/api/uploadvideo')
      .send(data)
      .set('ContentType', 'application/json')
      .end((err, res) => {
        this.setState({
          videoUrl: '',
          progress: 0,
          uploadKey: '',
          caption: '',
          title:'',
          showPoster:false,
        },() => {
          alert('提交成功')
        })
      })
  }
  render() {
    let dropZoneStyles = {
      width:'100%',
      height:200,
      border:'2px dashed rgb(102, 102, 102)',
      borderRadius:5
    };
    return (
      <div className="content">
        <div className="row">
          <div className="col-sm-3" >
            <Dropzone onDrop={this.onDrop} multiple={false} style={dropZoneStyles}>
              <div>将视频文件拖入该区域</div>
            </Dropzone>
            <video ref="vtag" style={{marginTop:15}} src={this.state.videoUrl} controls></video>
          </div>
          <div className="col-sm-9">
            <Form horizontal onSubmit={(e) => e.preventDefault()}>
              <FormGroup>
                <Col className="control-label sm-2-label" sm={3}>USERID</Col>
                <Col sm={9}>
                  <FormControl type="text" value={this.state.userId} onChange={(e) => this.setState({userId:e.target.value})} />
                </Col>
              </FormGroup>
              <FormGroup>
                <Col className="control-label sm-2-label" sm={3}>UPLOADKEY</Col>
                <Col sm={9}>
                  <FormControl type="text" value={this.state.uploadKey} readOnly/>
                </Col>
              </FormGroup>
              <FormGroup>
                <Col className="control-label sm-2-label" sm={3}>TITLE</Col>
                <Col sm={9}>
                  <FormControl type="text" value={this.state.title} onChange={(e) => this.setState({title:e.target.value})}/>
                </Col>
              </FormGroup>
              <FormGroup>
                <Col className="control-label sm-2-label" sm={3}>CAPTION</Col>
                <Col sm={9}>
                  <textarea style={{width:'100%'}} onChange={(e) => this.setState({caption:e.target.value})} value={this.state.caption} />
                </Col>
              </FormGroup>
              <FormGroup>
                <Col className="control-label sm-2-label" sm={3}>PROGRESS</Col>
                <Col sm={9} style={{padding:7}}>
                  <div className="progress" >
                    <div className="progress-bar" style={{width:`${this.state.progress}%`}}>
                      {this.state.progress}
                    </div>
                  </div>
                </Col>
              </FormGroup>
              {
                this.state.showPoster ?
                <FormGroup>
                  <Col className="control-label sm-2-label" sm={3}>POSTER</Col>
                  <Col sm={3}>
                    <img style={{width:'100%'}} src={this.state.thumbnail}/>
                  </Col>
                  <Col sm={6}>
                    <button onClick={() => this.setState({modalPoster:true})} className="btn btn-success">更换封面</button> <br/><br/>
                    <Dropzone style={{display:'inline-block',border:'none'}} accept="image/*" onDrop={this.uploadCover}>
                      <button className="btn btn-info">上传封面</button>
                    </Dropzone>
                  </Col>
                </FormGroup>
                :null
              }
              <Col sm={9} smOffset={3}>
                <button className="btn btn-primary" onClick={this.onSubmit}>提交</button>
              </Col>
            </Form>
          </div>
        </div>
        {
          this.state.modalPoster ?
          <div className="modal" style={{display:'block'}} tabIndex="-1" onClick={() => this.setState({modalPoster:false})}>
            <div className="modal-dialog" onClick={e => e.stopPropagation()}>
              <div className="modal-content">
                <div className="modal-body row">
                  {
                    [1,2,3,5,10,15,20,25,30].map((item,i) => {
                      if(item >= this.state.duration){
                        return null
                      }
                      return(
                        <Col key={`poster_${i}`} sm={2} style={{padding:10}}>
                          <img onClick={() => this.setState({modalPoster:false,thumbnail:`http://img.playalot.cn/${this.state.uploadKey}?vframe/jpg/offset/${item}`})} style={{width:'100%'}} src={`http://img.playalot.cn/${this.state.uploadKey}?vframe/jpg/offset/${item}`}/>
                        </Col>
                      )              
                    })
                  }
                  {
                    this.state.posters.map((poster,i) => {
                      return (
                        <Col key={`poster_u_${i}`} sm={2} style={{padding:10}}>
                          <img onClick={() => this.setState({modalPoster:false,thumbnail:CDN.show(poster)})} style={{width:'100%',height:80,objectFit:'cover'}} src={CDN.show(poster)}/>
                        </Col>
                      )
                    })
                  }
                </div>
              </div>
            </div>
          </div>
          :null
        }
      </div>
    );
  }
}
