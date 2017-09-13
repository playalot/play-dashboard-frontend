import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Dropzone from 'react-dropzone';
import Request from 'superagent';
import TagsInput from 'react-tagsinput'
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
      tags:[],
      alert: false,
      offset:1,
      modalPoster:false,
      posters:[],
      thumbnail:'',

      canSubmit:false
    };
    this.onDrop = this._onDrop.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.uploadCover = this._uploadCover.bind(this)
    this.uploadQiniu = this._uploadQiniu.bind(this)
  }
  _uploadQiniu(file, uploadKey, uploadToken) {
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
        this.setState({showPoster:true,duration:vdom.duration,canSubmit:true})
      })
  }
  _onDrop(files) {
    let video = files[0];

    // 初始化progress
    video.onprogress = (e) => {
      this.setState({progress: e.percent.toFixed(2)})
    }

    // 获取视频meta
    let URL = window.URL || window.webkitURL
    video.preview = URL.createObjectURL(video)

    let vdom = ReactDOM.findDOMNode(this.refs.vtag)

    this.setState({videoUrl: video.preview,canSubmit:false})

    let timer = setInterval( () => {
      if (vdom.readyState === 4){
        let uploadKey = `user/video/raw/${makeid()}_${Math.round(Date.now()/1000)}_w_${vdom.videoWidth}_h_${vdom.videoHeight}_d_${Math.floor(vdom.duration)}_${this.state.userId}.mp4`
        if(vdom.videoWidth == 0 || vdom.videoHeight == 0){
          clearInterval(timer)
          return alert('视频出错,请重新上传..')
        }
        Request.get('/api/uptoken').query({key:uploadKey})
        .end((err,res) => {
          let uptoken = res.body.uptoken
          this.setState({
            uploadKey,
            thumbnail:`http://img.playalot.cn/${uploadKey}?vframe/jpg/offset/1`
          })
          video.request = this.uploadQiniu(video,uploadKey,uptoken)
        })
        clearInterval(timer)
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
                  this.setState({posters,thumbnail:uploadKey,offset:null})
              })
          };
          img.src = file.preview
      })
  }
  onSubmit() {
    const { uploadKey,canSubmit,progress,userId,thumbnail,tags,caption,title,offset } = this.state
    if (uploadKey === '' ) {
      return alert('请先上传视频')
    }
    if(!canSubmit){
      if(progress > 99){
        return alert('请等待后台转码')
      }else{
        return alert('正在上传..')
      }
    }
    let data = {
      userId,
      uploadKey,
      tags
    }
    if(offset){
      data.offset = offset
    }else{
      data.thumbnail = thumbnail
    }
    if (caption.trim() !== '') {
      data.caption = caption
    }
    if (title.trim() !== '') {
      data.title = title
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
          offset:1,
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
		}
		return (
			<div className="portlet bordered light">
				<div className="portlet-title">
					<div className="caption">
						<span className="caption-subject font-blue-sharp bold uppercase">视频编辑器</span>
					</div>
				</div>
				<div className="portlet-body py-5">
					<form onSubmit={(e) => e.preventDefault()}>
						<div className="form-group row">
              <div className="col-sm-2 control-label">
                上传视频
              </div>
              <div className="col-sm-3 col-6">
								<Dropzone onDrop={this.onDrop} multiple={false} className="play-dropzone-style">
									<div>将视频文件拖入该区域</div>
								</Dropzone>
              </div>
              <div className="col-sm-3 col-6">
								<video ref="vtag" style={{height:100,width:'auto'}} src={this.state.videoUrl} controls></video>
              </div>
						</div>
						<div className="form-group row">
              <div className="col-sm-2 control-label">
                用户ID
              </div>
              <div className="col-sm-9">
								<input className="form-control" type="text" value={this.state.userId} onChange={(e) => this.setState({userId:e.target.value})} />
              </div>
						</div>
            <div className="form-group row">
              <div className="col-sm-2 control-label">
                标题
              </div>
              <div className="col-sm-9">
								<input className="form-control" type="text" value={this.state.title} onChange={(e) => this.setState({title:e.target.value})}/>
              </div>
            </div>
            <div className="form-group row">
              <div className="col-sm-2 control-label">
                描述
              </div>
              <div className="col-sm-9">
								<textarea style={{width:'100%'}} onChange={(e) => this.setState({caption:e.target.value})} value={this.state.caption} />
              </div>
            </div>
            <div className="form-group row">
              <div className="col-sm-2 control-label">
                标签
              </div>
              <div className="col-sm-9">
								<TagsInput value={this.state.tags} onChange={(tags) => this.setState({tags})} />
              </div>
            </div>
            <div className="form-group row">
              <div className="col-sm-2 control-label">
                进度
              </div>
              <div className="col-sm-9">
                <div className="progress">
                  <div className="progress-bar" role="progressbar" style={{width:`${this.state.progress}%`}} aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">
                    {this.state.progress}
                  </div>
                </div>
              </div>
            </div>
						{
							this.state.showPoster ?
              <div className="form-group row">
                <div className="col-sm-2 control-label">
                  封面
                </div>
                <div className="col-2">
									<img className="w-100" src={CDN.show(this.state.thumbnail)}/>
                </div>
                <div className="col-8">
									<button onClick={() => this.setState({modalPoster:true})} className="btn btn-outline purple">更换封面</button> <br/><br/>
									<Dropzone style={{display:'inline-block',border:'none'}} accept="image/*" onDrop={this.uploadCover}>
										<button className="btn btn-outline red">上传封面</button>
									</Dropzone>
                </div>
              </div>
							:null
						}
					</form>
					<div className="portlet-body py-5" style={{borderTop:'1px solid #eef1f5'}}>
            <div className="col-sm-2 ml-auto">
							<button className="btn green btn-outline" onClick={this.onSubmit}>提交</button>
            </div>
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
                  <div key={`poster_${i}`} className="col-sm-2">
									  <img onClick={() => this.setState({modalPoster:false,thumbnail:`http://img.playalot.cn/${this.state.uploadKey}?vframe/jpg/offset/${item}`,offset:item})} style={{width:'100%'}} src={`http://img.playalot.cn/${this.state.uploadKey}?vframe/jpg/offset/${item}`}/>
                  </div>
								)
								})
							}
							{
								this.state.posters.map((poster,i) => {
								return (
                  <div key={`poster_u_${i}`} className="col-sm-2">
									  <img onClick={() => this.setState({modalPoster:false,thumbnail:CDN.show(poster),offset:null})} style={{width:'100%',height:80,objectFit:'cover'}} src={CDN.show(poster)}/>
                  </div>
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
		)
  	}
}
