import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Request from 'superagent'
import Dropzone from 'react-dropzone'
import TagsInput from 'react-tagsinput'

import {
  Editor,
  EditorState,
  RichUtils,
  Entity,
  ContentState,
  AtomicBlockUtils,
  convertToRaw,
  convertFromRaw,
  Modifier,
  SelectionState
} from 'draft-js'

import decorator from '../PlayDraft/DecoratorServer'
import { getBlockStyle,makeId, DraftImage,mediaBlockRenderer,draftToHtml } from '../PlayDraft/draftServer'
import { createLinkEntity,createImageEntity,createVideoEntityWithHtml,createVideoEntityWithSrc,removeEntity } from '../PlayDraft/entityServer'
import DraftToolbar from '../PlayDraft/DraftToolbar'

import CDN from '../../widgets/cdn'
import parse from '../../widgets/parse'
import { uploadFiles,uploadImageWithWH } from '../../widgets/upload'
export default class EditPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            editorState:EditorState.createEmpty(decorator),
            //表单相关
            uploadUrl: 'http://upload.qiniu.com/',
            cover:'',
            title:'',
            tags:[],
            category:'news',
            authorId:'',
            gallery:[],
            dialogSubmit:false,

            dialogVideo:false,
            videoMode: true,
            videoCode:'',
            progress:null,
            videoUrl:null,
            uploadKey:'',

            uploadingVideo:false
        }
        //封面
        this.onDropCover = (files) => uploadImageWithWH(files[0],'article/cover/').then(cover => this.setState({cover},this.saveStorage))
        //自动保存至storage
        this.saveStorage = this._saveStorage.bind(this)
        //editor的回调方法
        this.onChange = (editorState) => this.setState({ editorState },() => this.saveStorage())
        this.focus = () => this.refs.editor.focus()
        this.blur = () => this.refs.editor.blur()
        this.handleKeyCommand = (command) => this._handleKeyCommand(command)

        //媒体(图片,视频..)
        this.addImage = this._addImage.bind(this)
        this.addVideo = () => this._addVideo()
        this.onChangeVideoCode = (e) => this.setState({videoCode: e.target.value})
        this.onDropImage = (files) => uploadFiles(files,'article/photo/').then(keys => keys.map(key => this.addImage(key)))
        this.onDropVideo = this._onDropVideo.bind(this)
        this.uploadQiniu = this._uploadQiniu.bind(this)
        //dialog controller
        this.showVideoDialog = () => this.setState({ dialogVideo:true })
        this.closeVideoDialog = () => this.setState({
            dialogVideo:false,
            progress:null,
            uploadKey:null,
            videoUrl:null,
        })
    }
    componentDidMount() {
        const data = window.localStorage.getItem('editor-draft')
        const { id } = parse(this.props.location.search)
        if (data !== null && !id) {
            if (confirm('请问是否要载入保存的草稿')) {
                const draftData = JSON.parse(data)
                let { title, cover, tags, category, gallery, raw, authorId } = draftData
                let rawData = convertFromRaw(raw)
                this.setState({
                    title, cover, tags, category, gallery,authorId,
                    editorState: EditorState.push(this.state.editorState, rawData)
                })
            }
        }

        if(id) {
            this.setState({pageId:id})
			Request
			.get(`/api/page/${id}/raw`)
			.end((err,res) => {
				const { title, cover, tags, category, gallery, raw, authorId } = res.body
                let rawData = convertFromRaw(raw)
                console.log(rawData.toJS().entityMap)
				this.setState({
					title, cover, tags, category, gallery, authorId:authorId.$oid,
                    editorState:EditorState.push(this.state.editorState, rawData)
				})
			})
		}
    }
    componentWillReceiveProps(nextProps) {
        if(!this.state.pageId){
            this.setState({authorId:nextProps.user.id})
        }
    }
    scrollToTop(e) {
        e.preventDefault()
        $('html, body').animate({scrollTop: 0}, 1000)
        return false
    }
    
    _saveStorage() {
        const {
            title, cover, tags, category, gallery,authorId,editorState
        } = this.state
        const contentState = editorState.getCurrentContent()
        const raw = convertToRaw(contentState)
        const saveData = {
            title,
            authorId,
            cover,
            tags,
            category,
            gallery,
            raw
        }
        window.localStorage.setItem('editor-draft', JSON.stringify(saveData))
        console.info('saved!')
    }
    publish() {
        const {
            title, cover, tags, category, gallery,authorId,editorState
        } = this.state
        const contentState = editorState.getCurrentContent()
        const raw = convertToRaw(contentState)
        const html = draftToHtml(contentState)
        const data = {
            title,
            authorId,
            cover,
            tags,
            category,
            gallery,
            html,
            raw
        }
        if (data.title.trim() === '') {
            alert('请输入文章标题')
            return
        }
        if (data.cover === '') {
            alert('请上传文章封面')
            return
        }
        if (data.authorId === '') {
            alert('请输入作者ID')
            return
        }
        this.setState({
            dialogSubmit:true
        },()=> {
            if(this.state.pageId) {
                data.id = this.state.pageId
            }
            Request
                .post(`/api/page/publish`)
                .send(data)
                .end((err, res) => {
                    if (err || !res.ok || res.text.length !== 24) {
                        alert('保存失败!');
                    } else {
                        alert('保存成功.');
                        window.localStorage.removeItem('editor-draft')
                        this.setState({
                            dialogSubmit:false,
                        },()=>{
                            this.props.history.push('/pages')
                        })
                    }
                })
        })
    }
    _handleKeyCommand(command) {
      	const {editorState} = this.state;
      	const newState = RichUtils.handleKeyCommand(editorState, command)
      	if (newState) {
        	this.onChange(newState)
        	return true
      	}
      	return false
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
        .on('progress', file.onprogress)
        .end((err, res) =>{
            this.setState({uploadingVideo:false})
        });
    }
    //媒体操作
    _addImage(imageKey) {
        const { editorState } = this.state
        const src = CDN.show(imageKey) + '!articlestyle';
        this.setState({
            editorState:createImageEntity(editorState,src)
        })
    }
    _addVideo() {
        const { videoMode,videoCode,editorState,uploadingVideo } = this.state
        if(videoMode){
            if (videoCode.trim().length === 0) {
                return false
            }
            const html = videoCode.trim().replace("width=510", "width=640");
            this.setState({
                editorState:createVideoEntityWithHtml(editorState,html),
                videoCode: '',
                dialogVideo: false
            })
        }else{
            if (parseInt(this.state.progress) !== 100 || uploadingVideo) {
                return alert('正在上傳請稍等..')
            }
            const src = CDN.show(this.state.uploadKey)
            this.setState({
                editorState:createVideoEntityWithSrc(editorState,src),
                uploadKey: '',
                dialogVideo: false
            })
        }

    }
    _onDropVideo(files) {
        this.setState({uploadingVideo:true})
        let video = files[0]
        video.onprogress = (e) => {
            this.setState({ progress: e.percent.toFixed(2) });
        }
        // 获取视频meta
        let URL = window.URL || window.webkitURL
        video.preview = URL.createObjectURL(video)

        let vdom = ReactDOM.findDOMNode(this.refs.vtag)

        this.setState({ videoUrl: video.preview })

        let timer = setInterval(() => {
            // console.warn(Date.now())
            if (vdom.readyState === 4) {
                let d = new Date();
                let id = makeId();
                let uploadKey = 'user/video/file/' + id + '_' + Math.round(d.getTime() / 1000) + '_w_' + vdom.videoWidth +
                '_h_' + vdom.videoHeight + '_d_' + Math.floor(vdom.duration) + '_' + this.state.authorId + '.mp4';
                Request
                .get(`/api/uptoken`)
                .query({
                    key:uploadKey
                })
                .end((err,res) => {
                    // console.info(res.body.uptoken)
                    let uploadToken = res.body.uptoken
                    this.setState({ uploadKey })
                    video.request = this.uploadQiniu(video, uploadKey, uploadToken)
                })
                clearInterval(timer)
            }
        }, 500)
    }
    render() {
        const { cover,title,tags,category,authorId,dialogSubmit,gallery,editorState } = this.state
        const contentState = editorState.getCurrentContent()
        let className = 'RichEditor-editor'
        if (!contentState.hasText()) {
            if (contentState.getBlockMap().first().getType() !== 'unstyled') {
                className += ' RichEditor-hidePlaceholder'
            }
        }
        return (
            <div className="editarticle">
                <div className="edit-section">
                    <Dropzone className="upload-cover" multiple={false} onDrop={this.onDropCover}>
                    {
                        cover ?
                        <div className="cover">
                            <img src={CDN.show(cover)} />
                            <div className="re-upload">
                                <span className="fa fa-camera"></span>
                            </div>
                        </div>
                        :<div style={{textAlign:'center'}}>
                        <span className="fa fa-camera"></span>
                        <p className="text">上传文章封面</p>
                        </div>
                    }
                    </Dropzone>
                </div>
                <div className="edit-section">
                    <input type="text" value={title} className="input" onChange={(e) => this.setState({title:e.target.value},() => this.saveStorage())} placeholder="输入文章标题"/>
                </div>
                <DraftToolbar editorState={editorState} onChange={this.onChange}>
                    <Dropzone data-toggle="tooltip" data-placement="top" title="图片" className="fa fa-camera-retro"  accept="image/*" onDrop={this.onDropImage}>
                    </Dropzone>
                    <span data-toggle="tooltip" data-placement="top" title="视频" className="fa fa-video-camera" onClick={this.showVideoDialog}>
                    </span>
                </DraftToolbar>
                <div className="edit-section">
                    <div className="edit-root">
                        <div className={className} onClick={this.focus}>
                            <Editor
                                blockRendererFn={mediaBlockRenderer}
                                editorState={editorState}
                                onChange={this.onChange}
                                placeholder="编辑文章内容"
                                ref="editor"
                                handleKeyCommand={this.handleKeyCommand}
                            />
                        </div>
                    </div>
                </div>
                <div className="edit-section">
                    <p className="title">添加标签</p>
                    <TagsInput value={tags} onChange={(tags) => this.setState({tags},() => this.saveStorage())} />
                </div>
                <div className="row">
                    <div className="col-sm-8">
                        <input type="text" placeholder="作者ID" value={authorId} className="form-control" onChange={(e) => this.setState({authorId:e.target.value},() => this.saveStorage())}/>
                    </div>

                    <div className="col-sm-4">
                        <button className="btn btn-outline green pull-right" onClick={this.publish.bind(this)}>发布文章</button>
                        <div style={{marginRight:15}} className="btn-group dropup pull-right">
                          <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown">
                            {(() => {
                                switch(category){
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
                                <li><a onClick={() => this.setState({category:'review'},() => this.saveStorage())}>评测</a></li>
                                <li><a onClick={() => this.setState({category:'news'},() => this.saveStorage())}>新闻</a></li>
                                <li><a onClick={() => this.setState({category:'info'},() => this.saveStorage())}>情报</a></li>
                                <li><a onClick={() => this.setState({category:'interview'},() => this.saveStorage())}>访谈</a></li>
                                <li><a onClick={() => this.setState({category:'essay'},() => this.saveStorage())}>随笔</a></li>
                                <li><a onClick={() => this.setState({category:'knowledge'},() => this.saveStorage())}>干货</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                {
                    dialogSubmit ?
                    <div className="play-modal">
                        <div className="upload-dialog">
                            <span className="edit-icon icon-spin3 animate-spin"></span>
                            <span>正在上传...</span>
                        </div>
                    </div>
                    :null
                }
                {
                    this.state.dialogVideo ?
                    <div className="play-modal">
                        <div className="play-dialog">
                            <span onClick={() => this.setState({dialogVideo:false})} className="dialog-close">×</span>
                            <ul className="nav nav-tabs">
                              <li className={this.state.videoMode ? 'active':''}><a onClick={() => this.setState({videoMode:true})}>粘贴视频通用代码</a></li>
                              <li className={this.state.videoMode ? '':'active'}><a onClick={() => this.setState({videoMode:false})}>上傳視頻</a></li>
                            </ul>
                            <br/>
                            {
                                this.state.videoMode ?
                                <div>
                                    <textarea className="video-code" value={this.state.videoCode} onChange={(e) => this.setState({videoCode:e.target.value})}/>
                                </div>
                                :<div>
                                    <Dropzone onDrop={this.onDropVideo} multiple={false} style={{width:'100%',height:'100px',border: '2px dashed rgb(204, 204, 204)', 'borderRadius': '5px'}}>
                                        <div>将视频文件拖入该区域</div>
                                    </Dropzone>
                                    <br/>
                                    <div className="progress">
                                      <div className="progress-bar" style={{width:`${this.state.progress}%`}}>
                                        {(this.state.progress || 0)}%
                                      </div>
                                    </div>
                                    <video style={{display:'none'}} ref="vtag" className="" src={this.state.videoUrl} controls></video>
                                </div>
                            }
                            <div className="dialog-footer">
                                <button className="btn btn-outline green" disabled={this.state.uploadingVideo} onClick={this.addVideo}>插入</button>
                            </div>
                        </div>

                    </div>
                    : null
                }
                <div onClick={this.scrollToTop} className="scroll-to-top">
                    <i className="fa fa-arrow-up"></i>
                </div>
            </div>
        )
    }
}

