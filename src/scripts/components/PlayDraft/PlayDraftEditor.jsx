import React, {  Component } from 'react'
import ReactDOM from 'react-dom'
import {
  AtomicBlockUtils,
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  Entity,
  CompositeDecorator,
  ContentState,
  Modifier,
  SelectionState
} from 'draft-js'
import Dropzone from 'react-dropzone'
import Request from 'superagent'

import CDN from '../../widgets/cdn'
import decorator from './DecoratorServer'
import { InlineStyleControls, BlockStyleControls, MediaImage, makeId} from './ComponentServer'

export default class  extends Component {
    constructor(props) {
        super(props)
        this.state = {
            editorState: EditorState.createEmpty(decorator),
            uploadUrl: 'http://upload.qiniu.com/',
            //link实体相关
            dialogLink:false,
            urlValue: '',
            urlText: '',
            //图片
            gallery:[],
            //视频
            dialogVideo:false,
            videoMode: true,
            videoCode:'',
            progress:null,
            videoUrl:null,
            uploadKey:'',

            receiveRaw:false
        }
        //本身方法
        this.onChange = editorState => this.setState({ editorState },() => {
            this.props.onChangeEditor(editorState.getCurrentContent(),this.state.gallery)
        })
        this.focus = () => this.editor.focus()
        this.handleKeyCommand = this._handleKeyCommand.bind(this)
        this.blockRendererFn = this._blockRendererFn.bind(this)
        //行内,块儿样式
        this.toggleBlockType = (type) => this._toggleBlockType(type)
        this.toggleInlineStyle = (style) => this._toggleInlineStyle(style)
        //链接实体
        this.promptForLink = this._promptForLink.bind(this)
        this.confirmLink = this._confirmLink.bind(this)
        this.addLink = this._addLink.bind(this)
        //图片
        this.addImage = this._addImage.bind(this)
        this.resizeImg = this._resizeImg.bind(this)
        this.uploadImg = this._uploadImg.bind(this)
        this.uploadToQiniuImage = this._uploadToQiniuImage.bind(this)
        //视频
        this.addVideo = this._addVideo.bind(this)
        this.onDropVideo = this._onDropVideo.bind(this)
        this.uploadToQiniuVideo = this._uploadToQiniuVideo.bind(this)

    }
    _handleKeyCommand(command) {
        const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
        if (newState) {
            this.onChange(newState)
            return true
        }
        return false
    }
    _blockRendererFn(block) {
        if (block.getType() === 'atomic') {
            return {
                component: (props) => {
                    const entityKey = props.block.getEntityAt(0)
                    const entity = props.contentState.getEntity(props.block.getEntityAt(0))
                    const { html, src, size } = entity.getData()
                    const type = entity.getType()

                    let media
                    if (type === 'image') {
                        let sizeBar = 'glyphicon '
                        sizeBar += size === 'auto' ? 'glyphicon-resize-full' : 'glyphicon-resize-small'
                        media = (
                            <MediaImage
                                src={src}
                                size={size}>
                                <p className="toolbar">
                                    <i onClick={() => this.resizeImg(entityKey,size)} className={sizeBar}></i>
                                </p>
                            </MediaImage>
                        )
                    }else if (type === 'video') {
                        media = <div dangerouslySetInnerHTML={{__html: html}}></div>
                    }
                    return media
                },
                editable: false,
            };
        }
      return null;
    }
    _toggleBlockType(blockType) {
        this.onChange(
            RichUtils.toggleBlockType(
                this.state.editorState,
                blockType
            )
        )
    }
    _toggleInlineStyle(inlineStyle) {
        this.onChange(
            RichUtils.toggleInlineStyle(
                this.state.editorState,
                inlineStyle
            )
        );
    }
    //链接
    _promptForLink(e) {
        e.preventDefault()
        const { editorState } = this.state
        const selection = editorState.getSelection()
        if (!selection.isCollapsed()) {
            let url = prompt('请输入地址')
            if (url.trim()) {
                this.setState({
                    urlValue:url
                },()=> {
                    this.confirmLink()
                })
            }
        }else{
            this.setState({ dialogLink:true })
        }
    }
    _confirmLink(e) {
        const { editorState, urlValue } = this.state;
        let contentState = editorState.getCurrentContent()
        const contentStateWithEntity = contentState.createEntity('LINK', 'IMMUTABLE', {
            url: urlValue
        });
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        this.setState({
            editorState: RichUtils.toggleLink(
                editorState,
                editorState.getSelection(),
                entityKey
            ),
            showURLInput: false,
            urlValue: '',
        }, () => {
            setTimeout(() => this.refs.editor.focus(), 0);
        });
    }
    _addLink() {
        const { urlText, urlValue, editorState } = this.state
        const contentState = editorState.getCurrentContent()
        if(!urlText.trim() || !urlValue.trim()){
            return alert('输入不能为空')
        }
        const contentStateWithEntity = contentState.createEntity('LINK', 'IMMUTABLE', {
            url: urlValue
        })
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
        const blockMap = ContentState.createFromText(urlText).blockMap
        const selection = editorState.getSelection()
        let newState = Modifier.replaceWithFragment(editorState.getCurrentContent(), selection, blockMap)
        const selectionState = new SelectionState({
            anchorKey: selection.getAnchorKey(),
            anchorOffset: selection.getStartOffset(),
            focusKey: selection.getAnchorKey(),
            focusOffset: selection.getStartOffset() + urlText.length
        })
        newState = Modifier.applyEntity(newState, selectionState, entityKey)
        this.onChange(EditorState.push(editorState, newState, 'insert-fragment'))
        this.setState({
            urlValue: '',
            urlText: '',
            dialogLink: false
        })
    }
    //图片
    _addImage(imageKey){
        const { editorState } = this.state
        const contentState = editorState.getCurrentContent()
        const src = CDN.show(imageKey) + '?articlestyle';
        const size = 'auto'
        const type = 'image'
        const contentStateWithEntity = contentState.createEntity('image', 'IMMUTABLE', {src,size,type})
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
        this.onChange(AtomicBlockUtils.insertAtomicBlock(
            this.state.editorState,
            entityKey,
            ' '
        ))
    }
    //修改图片大小
    _resizeImg(entityKey,size) {
        const { editorState } = this.state
        const contentState = editorState.getCurrentContent()
        contentState.mergeEntityData(entityKey, {size: size === 'auto' ? '100%' : 'auto' })
        this.setState({
            editorState: EditorState.moveFocusToEnd(editorState)
        })
    }
    //本地获取图片上传
    _uploadImg(files) {
        Request.get('/api/uptoken')
        .end((err, res) => {
            let uploadToken = res.body.uptoken
            files.forEach((file)=> {
                let uploadKey = `article/photo/${makeId()}.${file.name.split('.').pop()}` 
                this.uploadToQiniuImage(file, uploadKey, uploadToken)
            })
        })
    }
    //上传七牛图片
    _uploadToQiniuImage(file, uploadKey, uploadToken) {
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
            .end((err, res) => {
                let gallery = this.state.gallery
                gallery.push(uploadKey)
                this.setState({gallery})
                this.addImage(uploadKey)
        })
    }
    _addVideo() {
        if(this.state.videoMode){
            if (this.state.videoCode.trim().length === 0) {
                return false;
            }
            const html = this.state.videoCode.trim().replace("width=510", "width=640");
            const type = 'video'

            const { editorState } = this.state
            let contentState = editorState.getCurrentContent()
            const contentStateWithEntity = contentState.createEntity('video', 'IMMUTABLE', {
                html,type
            })
            const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

            this.onChange(AtomicBlockUtils.insertAtomicBlock(
                this.state.editorState,
                entityKey,
                ' '
            ));
            this.setState({
                videoCode: '',
                dialogVideo: false
            })
        }else{
            if (parseInt(this.state.progress) !== 100) {
                return alert('正在上傳請稍等..')
            }
            let src = CDN.show(this.state.uploadKey)
            let poster = `${CDN.show(this.state.uploadKey)}?vframe/jpg/offset/1`
            const html = `<video width="100%" src="${src}" poster="${poster}" controls>`
            const type = 'video'
            const entityKey = Entity.create('video', 'IMMUTABLE', {
                html,type,src,poster
            })
            this.onChange(AtomicBlockUtils.insertAtomicBlock(
                this.state.editorState,
                entityKey,
                ' '
            ));
            this.setState({
                uploadKey: '',
                dialogVideo: false
            })
        }
    }
    _onDropVideo(files) {
        let video = files[0]

        // 初始化progress
        video.onprogress = (e) => {
            this.setState({
                progress: e.percent.toFixed(2)
            });
        };

        // 获取视频meta
        let URL = window.URL || window.webkitURL;
        video.preview = URL.createObjectURL(video)

        let vdom = ReactDOM.findDOMNode(this.refs.vtag)

        this.setState({
            videoUrl: video.preview
        })

        let timer = setInterval(() => {
            // console.warn(Date.now())
            if (vdom.readyState === 4) {
                let uploadKey = `user/video/file/${makeId()}_w_${vdom.videoWidth}_h_${vdom.videoHeight}_d_${Math.floor(vdom.duration)}.mp4`
                Request
                    .get(`/api/uptoken`)
                    .query({
                        key:uploadKey
                    })
                    .end((err,res) => {
                        // console.info(res.body.uptoken)
                        let uploadToken = res.body.uptoken
                        this.setState({ uploadKey })
                        this.uploadToQiniuVideo(video, uploadKey, uploadToken)
                    })
                clearInterval(timer)
            }
        }, 500)
    }
    _uploadToQiniuVideo(file, uploadKey, uploadToken) {
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
            .end((err, res) => {
                console.log('done!')
            })
    }
    componentDidMount() {
        this.props.onChangeEditor(this.state.editorState.getCurrentContent(),this.state.gallery)
    }
    componentWillReceiveProps(nextProps) {
        const { preRaw, gallery} = nextProps
        const { receiveRaw,editorState } = this.state
        if(!!preRaw && !receiveRaw) {
            console.info(Date.now())
            let rawData = convertFromRaw(preRaw)
            this.setState({
                editorState: EditorState.push(editorState, rawData),
                gallery,
                receiveRaw:true
            },() => {
                this.props.onChangeEditor(this.state.editorState.getCurrentContent(),this.state.gallery)
            })
        }
    }
    render() {
        const { editorState, dialogLink, urlValue, urlText } = this.state
        let className = 'edit-editor'
        let contentState = editorState.getCurrentContent()
        if (!contentState.hasText()) {
            if (contentState.getBlockMap().first().getType() !== 'unstyled') {
                className = ' edit-hidePlaceholder'
            }
        }
        return (
            <div className="edit-root">
                <InlineStyleControls
                    editorState={editorState}
                    onToggle={this.toggleInlineStyle}
                />
                <BlockStyleControls
                    editorState={editorState}
                    onToggle={this.toggleBlockType}
                />
                <div className="edit-controls">
                    <span className="edit-styleButton" onClick={this.promptForLink}>
                        <i className="fa fa-link"></i>
                    </span>
                    <Dropzone className="edit-styleButton" accept="image/*" onDrop={this.uploadImg}>
                        <i className="fa fa-camera-retro"></i>
                    </Dropzone>
                    <span className="edit-styleButton" onClick={() => this.setState({dialogVideo:true})}>
                        <i className="fa fa-video-camera"></i>
                    </span>
                </div>
                <div className={className} onClick={this.focus}>
                    <Editor
                        editorState={editorState}
                        handleKeyCommand={this.handleKeyCommand}
                        blockRendererFn={this.blockRendererFn}
                        onChange={this.onChange}
                        placeholder="Enter some text..."
                        ref={editor => this.editor = editor}
                    />
                </div>
                {
                    dialogLink ?
                    <div className="modal">
                        <div className="dialog">
                            <p className="dialog-title">添加链接</p>
                            <span onClick={() => this.setState({dialogLink:false})} className="dialog-close">×</span>
                            <div>
                                <input type="text" className="form-control" value={urlValue} onChange={(e) => this.setState({urlValue: e.target.value})} placeholder="链接地址"/>
                                <input type="text" style={{marginTop:'10px'}} className="form-control" value={urlText} onChange={(e) => this.setState({urlText: e.target.value})} placeholder="链接文本"/>
                            </div>
                            <div className="dialog-footer">
                                <button className="btn btn-primary" onClick={this.addLink}>插入</button>
                            </div>
                        </div>
                    </div>
                    : null
                }
                {
                    this.state.dialogVideo ?
                    <div className="modal">
                        <div className="dialog">
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
                                <button className="btn btn-primary" onClick={this.addVideo}>插入</button>
                            </div>
                        </div>

                    </div>
                    : null
                }
            </div>
        )
    }
}




