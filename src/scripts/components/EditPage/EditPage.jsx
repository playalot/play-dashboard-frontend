import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import Select from 'react-select'
import Request from 'superagent'
import TagsInput from 'react-tagsinput'
import ReactDOM from 'react-dom'

import {
	Editor,
	EditorState,
	RichUtils,
	CompositeDecorator,
	Entity,
	ContentState,
	AtomicBlockUtils,
	convertToRaw,
	convertFromRaw,
	Modifier,
	SelectionState,
} from 'draft-js'
import CDN from '../../widgets/cdn'
import stateToHTML from '../../utils/stateToHTML'


export default class EditPage extends Component {
	constructor(props) {
		super(props)
		const decorator = new CompositeDecorator([
			{
			  strategy: findLinkEntities,
			  component: LINK,
			},
		])
		this.state = {
			editorState: EditorState.createEmpty(decorator),
			urlValue: '',
			urlText: '',
			uploadUrl: 'http://upload.qiniu.com/',
			title:'',
			authorId:'',
			videoCode:'',
			gallery:[],
			tags: [],
			cover:'',
			category:'news',
			onFocusKey:'',
			showUploadDialog:false,
			showVideoDialog:false,
			showLinkDialog:false,

			videoMode: true,
			progress:null,
			uploadKey:null,
			videoUrl:null,
		}
		this.handleTitleChange = (e) => this.setState({ title: e.target.value })
		this.handleAuthorIdChange = (e) => this.setState({ authorId: e.target.value })
		this.focus = () => this.refs.editor.focus()
		this.blur = () => this.refs.editor.blur()
		this.onChange = (editorState) => this.setState({ editorState })
		this.onDrop = (files) => this._onDrop( files )
		this.handleTagsChange = (tags) => { this.setState({ tags }) }
		this.onDropCover = (files) => this._onDropCover( files )
		//行内,块儿样式
		this.toggleBlockType = (type) => this._toggleBlockType(type)
		this.toggleInlineStyle = (style) => this._toggleInlineStyle(style)
		//链接
		this.promptForLink = this._promptForLink.bind(this)
		this.confirmLink = this._confirmLink.bind(this)
		this.addLink = this._addLink.bind(this)
		this.onChangeUrlValue = (e) => this.setState({urlValue: e.target.value})
		this.onChangeUrlText = (e) => this.setState({urlText: e.target.value})
		//媒体(图片,视频..)
		this.addImage = this._addImage.bind(this)
		this.addVideo = () => this._addVideo()
		this.onChangeVideoCode = (e) => this.setState({videoCode: e.target.value})
		this.uploadImg = this._uploadImg.bind(this)
		this.onDropVideo = this._onDropVideo.bind(this)
		this.uploadQiniu = this._uploadQiniu.bind(this)

		this.publish = () => this._publish();
		this.resizeImg = (entityKey,size) => this._resizeImg(entityKey,size)

		//dialog controller
		this.showVideoDialog = () => this.setState({ showVideoDialog:true })
		this.closeVideoDialog = () => this.setState({
			showVideoDialog:false,
			progress:null,
			uploadKey:null,
			videoUrl:null,
		})
		this.showLinkDialog = () => this.setState({ showLinkDialog:true })
		this.closeLinkDialog = () => this.setState({ showLinkDialog:false })

		//下拉菜单
		this.onChangeSelect = (newValue) => this.setState({category:newValue.value})

		this.handleKeyCommand = this._handleKeyCommand.bind(this)
	}
	_handleKeyCommand(command) {
		const {
			editorState
		} = this.state;
		const newState = RichUtils.handleKeyCommand(editorState, command);
		if (newState) {
			this.onChange(newState);
			return true;
		}
		return false;
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
	_onDropCover(files) {
		Request.get('/api/uptoken')
			.withCredentials()
			.end((err, res) => {
				let uploadToken = res.body.uptoken;
				const file = files[0];
				const img = new Image();
				img.onload = () => {
					if(img.width <320){
						return alert('图片太小')
					}
					const id = makeid();
					const date = new Date();
					const uploadKey = 'article/cover/' + Math.round(date.getTime() / 1000) + '_w_' + img.width + '_h_' + img.height + '_' + id + '.' + file.name.split('.').pop();
					Request
						.post(this.state.uploadUrl)
						.field('key', uploadKey)
						.field('token', uploadToken)
						.field('x:filename', file.name)
						.field('x:size', file.size)
						.attach('file', file, file.name)
						.set('Accept', 'application/json')
						.end((err, res) =>{
							this.setState({
								cover: uploadKey
							});
						});
				};
				img.src = file.preview;
			})
	}
	_uploadImg(files) {
		Request.get('/api/uptoken')
		.withCredentials()
       	.end((err, res) => {
        	let uploadToken = res.body.uptoken
        	files.forEach((file)=> {
				let d = new Date()
				let id = makeid()
	       		let uploadKey = 'article/photo/' + Math.round(d.getTime()/1000)  + '_' + id + '.' + file.name.split('.').pop()
	    			file.request = this.uploadToQiniu(file, uploadKey, uploadToken)
    			})
        })
	}
	uploadToQiniu(file, uploadKey, uploadToken) {
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
	      		let value = this.state.gallery.slice();
	      		value.push(uploadKey);
	      		this.setState({gallery: value});
	      		this.addImage(uploadKey)
	    })
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
			.end((err, res) => {
				console.log('done!')
			})
	}
	//链接操作
	_promptForLink(e) {
		e.preventDefault();
		const { editorState } = this.state;
		const selection = editorState.getSelection();
		if (!selection.isCollapsed()) {
			let url = prompt('请输入地址')
			if (url!==null && url!=="") {
				this.setState({
					urlValue:url
				},()=> {
			    this.confirmLink()
				})
			}
		}else{
			this.showLinkDialog()
		}
	}
	_confirmLink(e) {
		const { editorState, urlValue } = this.state;
		const entityKey = Entity.create('LINK', 'IMMUTABLE', {
			url: urlValue
		});
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
		if(!this.state.urlText || !this.state.urlValue){
			return alert('输入不能为空')
		}
		let text = this.state.urlText
		let entity = Entity.create('LINK', 'IMMUTABLE', {url: this.state.urlValue})

		const {editorState} = this.state;
		const blockMap = ContentState.createFromText(text).blockMap;
		const selection = editorState.getSelection();
		let newState = Modifier.replaceWithFragment(editorState.getCurrentContent(), selection, blockMap);
		const selectionState = new SelectionState({
		    anchorKey: selection.getAnchorKey(),
		    anchorOffset: selection.getStartOffset(),
		    focusKey: selection.getAnchorKey(),
		    focusOffset: selection.getStartOffset() + text.length
		})
		newState = Modifier.applyEntity(newState, selectionState, entity);
		this.onChange(EditorState.push(editorState, newState, 'insert-fragment'))
		this.setState({
			urlValue: '',
			urlText: '',
			showLinkDialog: false
		});
	}
  	//媒体操作
  	_addImage(imageKey){
	  	const src = CDN.show(imageKey) + '?articlestyle';
	  	const size = 'auto'
	  	const type = 'image'
	    const entityKey = Entity.create('image', 'IMMUTABLE', {src,size,type});
	    this.onChange(AtomicBlockUtils.insertAtomicBlock(
	        this.state.editorState,
	        entityKey,
	        ' '
	    ))
  	}
	_addVideo() {
		if(this.state.videoMode){
			if (this.state.videoCode.trim().length === 0) {
				return false;
			}
			const html = this.state.videoCode.trim().replace("width=510", "width=640");
			const type = 'video'
			const entityKey = Entity.create('video', 'IMMUTABLE', {
				html,type
			});
			this.onChange(AtomicBlockUtils.insertAtomicBlock(
				this.state.editorState,
				entityKey,
				' '
			));
			this.setState({
				videoCode: '',
				showVideoDialog: false
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
				showVideoDialog: false
			})
		}

	}
	_onDropVideo(files) {
		let video = files[0];

		// 初始化progress
		let _this = this;
		video.onprogress = function(e) {
			// console.log(e.percent);
			_this.setState({
				progress: e.percent.toFixed(2)
			});
		};

		// 获取视频meta
		let URL = window.URL || window.webkitURL;
		video.preview = URL.createObjectURL(video);

		let vdom = ReactDOM.findDOMNode(this.refs.vtag);

		this.setState({
			videoUrl: video.preview
		});

		let timer = setInterval(function() {
			// console.warn(Date.now())
			if (vdom.readyState === 4) {
				let d = new Date();
				let id = makeid();
				let uploadKey = 'user/video/file/' + id + '_' + Math.round(d.getTime() / 1000) + '_w_' + vdom.videoWidth +
					'_h_' + vdom.videoHeight + '_d_' + Math.floor(vdom.duration) + '_' + _this.state.userId + '.mp4';
				// console.log(uploadKey);
				Request
					.get(`/api/uptoken`)
					.query({
						key:uploadKey
					})
					.end((err,res) => {
						// console.info(res.body.uptoken)
						let uploadToken = res.body.uptoken
						_this.setState({
							uploadKey: uploadKey
						});
						video.request = _this._uploadQiniu(video, uploadKey, uploadToken);
					})
				clearInterval(timer);
			}
		}, 500);
	}
	_publish() {
		let options = {
		  	blockRenderers: {
		    	atomic: (block) => {
					const entity = Entity.get(block.getEntityAt(0));
					const data = entity.getData();
			      	if (data.type === 'image') {
			        	return `<figure><img src="${data.src}" style="width:${data.size}" /></figure>`
			      	} else if (data.type === 'video' && data.src) {
			      		return `<figure><video width="100%" src="${data.src}" poster="${data.poster}" controls /></figure>`
			      	}
		    	},
		  	}
		}
		let {
			title, cover, tags, category, gallery,authorId
		} = this.state
		let content = this.state.editorState.getCurrentContent()
		let raw = convertToRaw(content)
		let html = stateToHTML(content,options)
		let data = {
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
			showUploadDialog:true
		},()=> {
			if(this.props.params.id) {
				data.id = this.props.params.id
			}
			Request
			 	.post(`/api/page/publish`)
			 	.send(data)
			 	.end((err, res) => {
			 		if (err || !res.ok) {
			 			alert('保存失败!');
			 		} else {
			 			alert('保存成功.');
						window.localStorage.removeItem('editor-draft')
						this.setState({
							showUploadDialog:false,
						},()=>{
							this.context.router.push('/page')
						})
			 		}
			 	})
		})
	}
	_resizeImg(entityKey,size) {
		Entity.mergeData(entityKey, {size: size === 'auto' ? '100%' : 'auto' });
		this.setState({
			editorState: EditorState.moveFocusToEnd(this.state.editorState)
		})
	}
	blockRenderer(block) {
		if (block.getType() === 'atomic') {
			return {
			    component: (props)=> {
			    	const _this = this;
						const entityKey = props.block.getEntityAt(0);
						const entity = Entity.get(props.block.getEntityAt(0));
						const {src, html, size} = entity.getData();
						const type = entity.getType();
				  	let media;
				  	if (type === 'image') {
				  		let sizeBar = 'glyphicon '
				  		sizeBar += size === 'auto' ? 'glyphicon-resize-full' : 'glyphicon-resize-small'
				    	media = (
				    		<MediaImage
					    		src={src}
					    		size={size}>
					    		<p className="toolbar">
					    			<i onClick={()=>this.resizeImg(entityKey,size)} className={sizeBar}></i>
					    		</p>
				    		</MediaImage>
				    	)
				  	}else if (type === 'video') {
				    	media = <div dangerouslySetInnerHTML={{__html: html}}></div>;
				  	}
				  	return media;
			    },
			    editable: false,
			};
		}
	  return null;
	}
	componentDidMount() {
		const data = window.localStorage.getItem('editor-draft')
		if (data !== null && !this.props.params.id) {
			if (confirm('请问是否要载入保存的草稿')) {
				const draftData = JSON.parse(data)
				let { title, cover, tags, category, gallery, raw, authorId } = draftData
				let rawData = convertFromRaw(raw)
				this.setState({
					title: title, cover: cover, tags: tags, category: category, gallery: gallery,authorId,
					editorState: EditorState.push(this.state.editorState, rawData)
				})
			}else {
				this.setState({
					authorId:this.props.user.id
				})
			}
		}
		if(this.props.params.id) {
			Request
				.get(`/api/page/${this.props.params.id}/raw`)
				.end((err,res) => {
					let { title, cover, tags, category, gallery, raw, authorId } = res.body
					let rawData = convertFromRaw(raw)
					this.setState({
						title: title, cover: cover, tags: tags, category: category, gallery: gallery,
						authorId:authorId.$oid,
						editorState: EditorState.push(this.state.editorState, rawData)
					})
				})
		}
		this.intervalId = setInterval(() => {
			let {
				title, cover, tags, category, gallery,authorId
			} = this.state
			let raw = convertToRaw(this.state.editorState.getCurrentContent())
			let saveData = {
				title,
				authorId,
				cover,
				tags,
				category,
				gallery,
				raw
			}
      window.localStorage.setItem('editor-draft', JSON.stringify(saveData))
			console.log('saved!')
    }, 5000);
	}
	componentWillUnmount() {
   	clearInterval(this.intervalId)
	}
	render() {
		const {editorState} = this.state;
		let className = 'edit-editor';
		let contentState = editorState.getCurrentContent();
		if (!contentState.hasText()) {
			if (contentState.getBlockMap().first().getType() !== 'unstyled') {
				className = ' edit-hidePlaceholder';
			}
		}
		const options = [
		    { value: 'review', label: '评测' },
		    { value: 'news', label: '新闻' },
				{ value: 'info', label: '情报' },
		    { value: 'interview', label: '访谈' },
		    { value: 'essay', label: '随笔' },
				{ value: 'knowledge', label: '干货' }
		];
		return (
			<div className="editarticle">
				<div className="edit-section">
					<Dropzone className="upload-cover" onDrop={this.onDropCover}>
	            	{
	            		this.state.cover ?
	            		<div className="cover">
	            			<img src={CDN.show(this.state.cover)} />
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
					<input type="text" value={this.state.title} className="input" onChange={this.handleTitleChange} placeholder="输入文章标题"/>
				</div>
				<div className="edit-section">
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
				        	<span className="edit-styleButton" onClick={this.showVideoDialog}>
				        		<i className="fa fa-video-camera"></i>
				        	</span>
				        </div>
				    	<div className={className} onClick={this.focus}>
							<Editor
								blockRendererFn={this.blockRenderer.bind(this)}
								editorState={editorState}
								onChange={this.onChange}
								handleKeyCommand={this.handleKeyCommand}
								placeholder="编辑文章内容"
								ref="editor"
							/>
				      	</div>
				        
	                {
	                	this.state.showVideoDialog ?
	                	<div className="modal">
	                		<div className="dialog">
	                			<span onClick={this.closeVideoDialog} className="dialog-close">×</span>
	                			<ul className="nav nav-tabs">
								  <li className={this.state.videoMode ? 'active':''}><a onClick={() => this.setState({videoMode:true})}>粘贴视频通用代码</a></li>
								  <li className={this.state.videoMode ? '':'active'}><a onClick={() => this.setState({videoMode:false})}>上傳視頻</a></li>
								</ul>
								<br/>
								{
									this.state.videoMode ?
									<div>
										<textarea className="video-code" value={this.state.videoCode} onChange={this.onChangeVideoCode}/>
									</div>
									:<div>
										<Dropzone onDrop={this.onDropVideo} multiple={false} style={{width:'100%',height:'100px',border: '2px dashed rgb(204, 204, 204)', 'borderRadius': '5px'}}>
								            <div>将视频文件拖入该区域</div>
								        </Dropzone>
								        <br/>
								        <div className="progress">
										  <div className="progress-bar" style={{width:`${this.state.progress}%`}}>
										  	{(this.state.progress || 0)}
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
	                {
	                	this.state.showLinkDialog ?
	                	<div className="modal">
	                		<div className="dialog">
	                			<p className="dialog-title">添加链接</p>
	                			<span onClick={this.closeLinkDialog} className="dialog-close">×</span>
	                			<div>
	                				<input type="text" className="form-control" value={this.state.urlValue} onChange={this.onChangeUrlValue} placeholder="链接地址"/>
	                				<input type="text" style={{marginTop:'10px'}} className="form-control" value={this.state.urlText} onChange={this.onChangeUrlText} placeholder="链接文本"/>
	                			</div>
	                			<div className="dialog-footer">
					                <button className="btn btn-primary" onClick={this.addLink}>插入</button>
					            </div>
	                		</div>
	                	</div>
	                	: null
	                }
		      		</div>
				</div>
				<div className="edit-section">
					<p className="title">添加标签</p>
					<TagsInput value={this.state.tags} onChange={(tags) => this.handleTagsChange(tags)} />
				</div>
				<div className="edit-section">
					<p className="title">文章分类</p>
	        		<Select
				    name="form-field-name"
				    value={this.state.category}
				    options={options}
				    clearable={false}
				    onChange={this.onChangeSelect}
					/>
				</div>
				<div className="edit-section">
					<p className="title">作者ID</p>
					<input type="text" value={this.state.authorId} className="form-control" onChange={this.handleAuthorIdChange}/>
				</div>
		      	<div className="edit-section">
					<button className="btn btn-primary" onClick={this.publish}>发布文章</button>
				</div>
				{
					this.state.showUploadDialog ?
					<div className="modal">
						<div className="upload-dialog">
						<span className="edit-icon icon-spin3 animate-spin"></span>
						<span>正在上传...</span>
						</div>
					</div>
					:null
				}
			</div>
		)
	}
}
EditPage.contextTypes = {
  	router : React.PropTypes.object
}

class MediaImage extends Component{
	constructor(props) {
		super(props);
		this.state = { showBar:false };
		this.enter = () => this.setState({showBar:true})
		this.leave = () => this.setState({showBar:false})
	}
	render() {
		return(
			<div className="media-image-wrap" onMouseOver={this.enter} onMouseLeave={this.leave}>
				{
					this.state.showBar ? this.props.children : null
				}
		    	<img src={this.props.src} style={{width:this.props.size}} />
		    </div>
		)
	}
}

function makeid() {
    let text = '';
    const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for( let i=0; i < 10; i++ ) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

//创建链接实体
function findLinkEntities(contentBlock, callback) {
	contentBlock.findEntityRanges(
		(character) => {
			const entityKey = character.getEntity();
			return (
				entityKey !== null &&
				Entity.get(entityKey).getType() === 'LINK'
			);
		},
		callback
	);
}
//链接组件
const LINK = (props) => {
	const {url} = Entity.get(props.entityKey).getData();
	return (
		<a href={url} style={{'textDecoration': 'underline'}}>
	    	{props.children}
		</a>
	);
};
const InlineStyleControls = (props) => {
	var currentStyle = props.editorState.getCurrentInlineStyle()
  	return (
	    <div className="edit-controls">
      	{
			INLINE_STYLES.map((type,index) =>
		        <StyleButton
		        	key={index}
					active={currentStyle.has(type.style)}
					label={type.label}
					onToggle={props.onToggle}
					style={type.style}
					class={type.class}
		        />
	      	)
      	}
	    </div>
  	);
};
class StyleButton extends Component {
	constructor() {
		super();
		this.onToggle = (e) => {
			e.preventDefault();
			this.props.onToggle(this.props.style);
		};
	}
	render() {
		let className = 'edit-styleButton'
		className+= this.props.active ? ' edit-activeButton ' :''
  		return (
	    	<div className={className} style={this.props.view} onMouseDown={this.onToggle}>
	    		{
	    			this.props.class ? (<i className={this.props.class}></i>) : (<span>{this.props.label}</span>)
	    		}
	    	</div>
    	)
  	}
}
const BlockStyleControls = (props) => {
	const {editorState} = props
	const selection = editorState.getSelection()
	const blockType = editorState
	    .getCurrentContent()
	    .getBlockForKey(selection.getStartKey())
	    .getType()

  	return (
	    <div className="edit-controls">
	      	{
	      		BLOCK_TYPES.map((type,index) =>
			        <StyleButton
			        	key={index}
						active={type.style === blockType}
						label={type.label}
						onToggle={props.onToggle}
						style={type.style}
						class={type.class}
			        />
	      		)
	      	}
	    </div>
  	)
};
const INLINE_STYLES = [
	{label: 'Bold', style: 'BOLD',class:'fa fa-bold'},
	{label: 'Italic', style: 'ITALIC',class:'fa fa-italic'},
	{label: 'Underline', style: 'UNDERLINE',class:'fa fa-underline'},
];
const BLOCK_TYPES = [
	{label: 'H1', style: 'header-one'},
	{label: 'H2', style: 'header-two'},
	{label: 'Ul', style: 'unordered-list-item',class:'fa fa-list'},
	{label: 'Ol', style: 'ordered-list-item',class:'fa fa-list-ol'},
	{label: 'Quote', style: 'blockquote',class:'fa fa-quote-left'},
];
