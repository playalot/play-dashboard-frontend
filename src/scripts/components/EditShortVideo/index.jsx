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
      category:'news',
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
                  this.setState({posters,thumbnail:uploadKey})
              })
          };
          img.src = file.preview
      })
  }
  onSubmit() {
    if (this.state.uploadKey === '' ) {
      return alert('请先上传视频')
    }
    if(!this.state.canSubmit){
      if(this.state.progress > 99){
        return alert('请等待后台转码')
      }else{
        return alert('正在上传..')
      }
      
    }
    let data = {
      userId: this.state.userId,
      uploadKey: this.state.uploadKey,
      thumbnail:this.state.thumbnail,
      category:this.state.category
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
		}
		return (
			<div className="portlet bordered light">
				<div className="portlet-title">
					<div className="caption">
						<span className="caption-subject font-blue-sharp bold uppercase">视频编辑器</span>
					</div>
				</div>
				<div className="portlet-body py-5">
					<Form horizontal onSubmit={(e) => e.preventDefault()}>
						<FormGroup>
							<Col className="control-label" sm={2}>上传视频</Col>
							<Col xs={6} sm={3}>
								<Dropzone onDrop={this.onDrop} multiple={false} className="play-dropzone-style">
									<div>将视频文件拖入该区域</div>
								</Dropzone>
							</Col>
							<Col xs={6} sm={3}>
								<video ref="vtag" style={{height:100,width:'auto'}} src={this.state.videoUrl} controls></video>
							</Col>
						</FormGroup>
						<FormGroup>
							<Col className="control-label" sm={2}>用户ID</Col>
							<Col sm={9}>
								<FormControl type="text" value={this.state.userId} onChange={(e) => this.setState({userId:e.target.value})} />
							</Col>
						</FormGroup>
						<FormGroup>
							<Col className="control-label" sm={2}>标题</Col>
							<Col sm={9}>
								<FormControl type="text" value={this.state.title} onChange={(e) => this.setState({title:e.target.value})}/>
							</Col>
						</FormGroup>
						<FormGroup>
							<Col className="control-label" sm={2}>描述</Col>
							<Col sm={9}>
								<textarea style={{width:'100%'}} onChange={(e) => this.setState({caption:e.target.value})} value={this.state.caption} />
							</Col>
						</FormGroup>
						<FormGroup>
							<Col className="control-label" sm={2}>标签</Col>
							<Col sm={9}>
								<div className="btn-group">
                  <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown">
                    {(() => {
                        switch(this.state.category){
                            case 'review':
                                return '评测'
                            case 'news':
                                return '新闻'
                            case 'info':
                                return '情报'
                            case 'interview':
                                return '访谈'
                            case 'essay':
                                return '随笔'
                            case 'knowledge':
                                return '干货'
                            default :
                                return ''
                        }
                    })()}
                    &nbsp;&nbsp;<span className="caret"></span>
                  </button>
                    <ul className="dropdown-menu">
                        <li><a onClick={() => this.setState({category:'review'})}>评测</a></li>
                        <li><a onClick={() => this.setState({category:'news'})}>新闻</a></li>
                        <li><a onClick={() => this.setState({category:'info'})}>情报</a></li>
                        <li><a onClick={() => this.setState({category:'interview'})}>访谈</a></li>
                        <li><a onClick={() => this.setState({category:'essay'})}>随笔</a></li>
                        <li><a onClick={() => this.setState({category:'knowledge'})}>干货</a></li>
                    </ul>
                </div>
							</Col>
						</FormGroup>
						<FormGroup>
							<Col className="control-label" sm={2}>进度</Col>
							<Col sm={9}>
								<div className="progress progress-striped active mt-3">
									<div className="progress-bar progress-bar-info" role="progressbar" style={{width:`${this.state.progress}%`}}>
										{this.state.progress}
									</div>
								</div>
							</Col>
						</FormGroup>
						{
							this.state.showPoster ?
							<FormGroup>
								<Col className="control-label" sm={2}>封面</Col>
								<Col xs={2}>
									<img style={{width:'100%'}} src={CDN.show(this.state.thumbnail)}/>
								</Col>
								<Col xs={8}>
									<button onClick={() => this.setState({modalPoster:true})} className="btn btn-outline purple">更换封面</button> <br/><br/>
									<Dropzone style={{display:'inline-block',border:'none'}} accept="image/*" onDrop={this.uploadCover}>
										<button className="btn btn-outline red">上传封面</button>
									</Dropzone>
								</Col>
							</FormGroup>
							:null
						}
					</Form>
					<div className="portlet-body py-5" style={{borderTop:'1px solid #eef1f5'}}>
						<Col sm={2} smOffset={2}>
							<button className="btn green btn-outline" onClick={this.onSubmit}>提交</button>
						</Col>
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
		)
  	}
}
