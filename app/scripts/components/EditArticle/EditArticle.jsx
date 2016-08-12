import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import Select from 'react-select'
import Request from 'superagent'
import TagsInput from 'react-tagsinput'

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


export default class EditArticle extends Component {
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
			category:'评测',
			onFocusKey:'',
			readOnly:false,
			showUploadDialog:false,
			showVideoDialog:false,
			showLinkDialog:false,
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

		this.publish = () => this._publish();
		this.resizeImg = (entityKey,size) => this._resizeImg(entityKey,size)

		//dialog controller
		this.showVideoDialog = () => this.setState({ showVideoDialog:true })
		this.closeVideoDialog = () => this.setState({ showVideoDialog:false })
		this.showLinkDialog = () => this.setState({ showLinkDialog:true })
		this.closeLinkDialog = () => this.setState({ showLinkDialog:false })

		//下拉菜单
		this.onChangeSelect = (newValue) => this.setState({category:newValue.value})
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
		let _this = this
		Request.get('/api/uptoken')
			.withCredentials()
			.end(function(err, res) {
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
						.post(_this.state.uploadUrl)
						.field('key', uploadKey)
						.field('token', uploadToken)
						.field('x:filename', file.name)
						.field('x:size', file.size)
						.attach('file', file, file.name)
						.set('Accept', 'application/json')
						.end(function(err, res) {
							_this.setState({
								cover: uploadKey
							});
						});
				};
				img.src = file.preview;
			})
	}
	_uploadImg(files) {
		let _this = this
		Request.get('/api/uptoken')
		.withCredentials()
       	.end(function(err, res) {
        	let uploadToken = res.body.uptoken
        	files.forEach((file)=> {
						let d = new Date()
						let id = makeid()
	       		let uploadKey = 'article/photo/' + Math.round(d.getTime()/1000)  + '_' + id + '.' + file.name.split('.').pop()
	    			file.request = _this.uploadToQiniu(file, uploadKey, uploadToken)
    			})
        })
	}
	uploadToQiniu(file, uploadKey, uploadToken) {
	    if (!file || file.size === 0) {
	      return null;
	    }
	    let _this = this;
	    const req = Request
	      .post(this.state.uploadUrl)
	      .field('key', uploadKey)
	      .field('token', uploadToken)
	      .field('x:filename', file.name)
	      .field('x:size', file.size)
	      .attach('file', file, file.name)
	      .set('Accept', 'application/json');

	    req.end(function(err, res){
	      let value = _this.state.gallery.slice();
	      value.push(uploadKey);
	      _this.setState({gallery: value});
	      _this.addImage(uploadKey)
	    });
	    return req;
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
    ));
  }
	_addVideo() {
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
		});
	}
	_publish() {
		let _this = this
		let options = {
	  	blockRenderers: {
	    	atomic: (block) => {
				const entity = Entity.get(block.getEntityAt(0));
				const data = entity.getData();
		      	if (data.type === 'image') {
		        	return `<figure><img src="${data.src}" style="width:${data.size}" /></figure>`;
		      	}
	    	},
	  	},
	  	inlineStyles: {
	  		UNDERLINE: {style: {'text-decoration': 'underline'}},
			},
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
		Request
		 	.post('/api/article/publish')
		 	.send(data)
		 	.end(function(err, res) {
		 		console.log(err);
		 		console.log(res);
		 		console.log((err || !res.ok));
		 		if (err || !res.ok) {
		 			alert('保存失败!');
		 		} else {
		 			alert('保存成功.');
					window.localStorage.removeItem('editor-draft')
					_this.setState({
						showUploadDialog:false,
					},()=>{
						_this.context.router.push('/article')
					})
		 		}
		 	});
		})
	}
	_resizeImg(entityKey,size) {
		Entity.mergeData(entityKey, {size: size === 'auto' ? '100%' : 'auto' });
		this.blur();
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
					    		<p className="toolbar" onClick={()=>this.resizeImg(entityKey,size)}>
					    			<i  className={sizeBar}></i>
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
		if (data !== null) {
			if (confirm('请问是否要载入保存的草稿')) {
				const draftData = JSON.parse(data)
				let { title, cover, tags, category, gallery, raw, authorId } = draftData
				let rawData = convertFromRaw(raw)
				this.setState({
					title: title, cover: cover, tags: tags, category: category, gallery: gallery,authorId,
					editorState: EditorState.push(this.state.editorState, rawData)
				})
			}
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
		    { value: '评测', label: '评测' },
		    { value: '新闻', label: '新闻' },
		    { value: '访谈', label: '访谈' },
		    { value: '随笔', label: '随笔' }
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
					<p className="title">文章标题</p>
					<input type="text" value={this.state.title} className="input" onChange={this.handleTitleChange}/>
				</div>
				<div className="edit-section">
					<div className="edit-root">
				    <div className={className} onClick={this.focus}>
							<Editor
								blockRendererFn={this.blockRenderer.bind(this)}
								blockStyleFn={getBlockStyle}
								editorState={editorState}
								onChange={this.onChange}
								placeholder="编辑文章内容"
								ref="editor"
								// spellCheck={true}
								// customStyleMap={styleMap}
								readOnly={this.state.readOnly}
							/>
				      </div>
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
	                {
	                	this.state.showVideoDialog ?
	                	<div className="modal">
	                		<div className="dialog">
	                			<p className="dialog-title">粘贴视频通用代码</p>
	                			<span onClick={this.closeVideoDialog} className="dialog-close">×</span>
	                			<div>
	                				<textarea className="video-code" value={this.state.videoCode} onChange={this.onChangeVideoCode}/>
	                			</div>
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
					<input type="text" value={this.state.authorId} className="input" onChange={this.handleAuthorIdChange}/>
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
EditArticle.contextTypes = {
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
function getBlockStyle(block) {
	switch (block.getType()) {
		case 'blockquote':
			return 'edit-blockquote';
		default:
			return null;
	}
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
	var currentStyle = props.editorState.getCurrentInlineStyle();
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
      	)}
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
		let className = 'edit-styleButton';
		if (this.props.active) {
			className += ' edit-activeButton ';
		}
  	return (
    	<div className={className} style={this.props.view} onMouseDown={this.onToggle}>
    		{
    			this.props.class ? (<i className={this.props.class}></i>) : (<span>{this.props.label}</span>)
    		}
    	</div>
    );
  }
}
const BlockStyleControls = (props) => {
	const {editorState} = props;
	const selection = editorState.getSelection();
	const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

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
	      	)}
	    </div>
  	);
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
