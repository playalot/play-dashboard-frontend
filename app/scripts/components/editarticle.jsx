import React from 'react';
import {AtomicBlockUtils, Editor, EditorState, Entity, RichUtils, convertToRaw} from 'draft-js';
import stateToHTML from '../utils/stateToHTML';
import Dropzone from 'react-dropzone';
import TagsInput from 'react-tagsinput';
import Request from 'superagent';
import $ from 'jquery';
import CDN from '../widgets/cdn';


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

function getBlockStyle(block) {
  switch (block.getType()) {
    case 'blockquote': return 'RichEditor-blockquote';
    case 'unstyled': return 'paragraph';
    default: return null;
  }
}

class StyleButton extends React.Component {
  constructor() {
    super();
    this.onToggle = (e) => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }

  render() {
    let className = 'RichEditor-styleButton';
    if (this.props.active) {
      className += ' RichEditor-activeButton';
    }
    if (this.props.icon) {
      className += (' ' + this.props.icon);
    }

    return (
      <span className={className} onMouseDown={this.onToggle}>
        {this.props.icon ? null : this.props.label}
      </span>
    );
  }
}

const BLOCK_TYPES = [
  {label: 'H1', style: 'header-one', icon: ''},
  {label: 'H2', style: 'header-two', icon: ''},
  {label: 'Blockquote', style: 'blockquote', icon: 'fa fa-quote-left'},
  {label: 'UL', style: 'unordered-list-item', icon: 'fa fa-list-ul'},
  {label: 'OL', style: 'ordered-list-item', icon: 'fa fa-list-ol'},
];

const BlockStyleControls = (props) => {
  const {editorState} = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map((type) =>
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          icon={type.icon}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};


const INLINE_STYLES = [
  {label: 'Bold', style: 'BOLD', icon: 'fa fa-bold'},
  {label: 'Italic', style: 'ITALIC', icon: 'fa fa-italic'},
  {label: 'Underline', style: 'UNDERLINE', icon: 'fa fa-underline'},
];

const InlineStyleControls = (props) => {
  var currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map(type =>
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          icon={type.icon}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};

const Media = (props) => {
  const entity = Entity.get(props.block.getEntityAt(0));
  const {src, html} = entity.getData();
  const type = entity.getType();
  let media;
  if (type === 'image') {
    media = (<div style={{width: "80%", height: "auto", cursor: "default", margin: "5px auto", textAlign: "center"}}>
      <img src={src} style={{maxWidth: "100%", height: "auto"}} />
    </div>);
  } else if (type === 'video') {
    media = <div style={{width: "80%", height: "auto", cursor: "default", margin: "5px auto", textAlign: "center"}} dangerouslySetInnerHTML={{__html: html}}></div>;
  }
  return media;
};

export default class ArticleEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      showImageWindow: false,
      showVideoWindow: false,
      videoCode: '',
      title: '',
      cover: '',
      tags: [],
      category: '评测',
      authorId: '',
      gallery:[],
      uploadUrl: 'http://upload.qiniu.com/',
    };

    this.focus = () => this.refs.editor.focus();
    this.onChange = (editorState) => this.setState({editorState});

    this.handleKeyCommand = (command) => this._handleKeyCommand(command);
    this.toggleBlockType = (type) => this._toggleBlockType(type);
    this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);
    this.toggleImageWindow = () => this.setState({showImageWindow: !this.state.showImageWindow});
    this.toggleVideoWindow = () => this.setState({showVideoWindow: !this.state.showVideoWindow});
    this.handleTagsChange = (tags) => this.setState({tags});
    this.handleTitleChange = (e) => this.setState({title: e.target.value});
    this.handleCategoryChange = (e) => this.setState({category: e.target.value});
    this.handleAuthorChange = (e) => this.setState({authorId: e.target.value});

    this.onDrop = (files) => this._onDrop(files);
    this.onDropCover = (files) => this._onDropCover(files);
    this.onChangeVideoCode = (e) => this.setState({videoCode: e.target.value});
    this.addImage = (imageKey) => this._addImage(imageKey);
    this.addVideo = () => this._addVideo();
    this.publish = () => this._publish();
    this.blockRenderer = (block) => {
      if (block.getType() === 'atomic') {
        return {
          component: Media,
          editable: false,
        };
      }
      return null;
    };
  }
  _handleKeyCommand(command) {
    const {editorState} = this.state;
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
    );
  }
  _toggleInlineStyle(inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle
      )
    );
  }
  _addImage(imageKey) {
    const src = CDN.show(imageKey) + '?articlestyle';
    const entityKey = Entity.create('image', 'IMMUTABLE', {src});
    this.onChange(AtomicBlockUtils.insertAtomicBlock(
      this.state.editorState,
      entityKey,
      ' '
    ));
    this.setState({showImageWindow: false});
  }
  _addVideo() {
    if (this.state.videoCode.trim().length === 0) {
      return false;
    }
    const html = this.state.videoCode.trim().replace("width=510", "width=640");
    const entityKey = Entity.create('video', 'IMMUTABLE', {html});
    this.onChange(AtomicBlockUtils.insertAtomicBlock(
      this.state.editorState,
      entityKey,
      ' '
    ));
    this.setState({videoCode:'', showVideoWindow: false});
  }
  _onDrop(files) {
    let _this = this;
    $.ajax({
       url : '/api/uptoken',
       type : 'GET',
       success : function(data) {
         let uploadToken = data.uptoken;
         let progresses = {};
         files.forEach((file)=> {
           // genereate upload key
           let d = new Date();
           let id = makeid();
           let uploadKey = 'article/photo/' + Math.round(d.getTime()/1000)  + '_' + id + '.' + file.name.split('.').pop();
           // file.preview = URL.createObjectURL(file);
           file.onprogress = function(e) {
             progresses[file.preview] = e.percent;
             _this.setState({progresses: progresses});
           };
           file.request = _this.uploadToQiniu(file, uploadKey, uploadToken);
         });
       }
    });
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

    if (isFunction(file.onprogress)) {
      req.on('progress', file.onprogress);
    }
    req.end(function(err, res){
      let value = _this.state.gallery.slice();
      value.push(uploadKey);
      _this.setState({gallery: value});
    });
    return req;
  }
  _onDropCover(files) {
    let _this = this;
    Request.get('/api/uptoken').end(function(err, res){
      let uploadToken = res.body.uptoken;
      const file = files[0];
      const img = new Image();
      img.onload = () => {
        console.log(img.width + ' ' + img.height);
        const id = makeid();
        const date = new Date();
        const uploadKey = 'article/cover/' + Math.round(date.getTime()/1000)  + '_w_' + img.width  + '_h_' + img.height  + '_' + id + '.' + file.name.split('.').pop();
        Request
          .post(_this.state.uploadUrl)
          .field('key', uploadKey)
          .field('token', uploadToken)
          .field('x:filename', file.name)
          .field('x:size', file.size)
          .attach('file', file, file.name)
          .set('Accept', 'application/json')
          .end(function(err, res){
            _this.setState({cover: uploadKey});
          });
      };
      img.src = file.preview;
    });
  }
  _publish() {
    let _this = this;

    let title = this.state.title;
    let cover = this.state.cover;
    let tags = this.state.tags;
    let category = this.state.category;
    let authorId = this.state.authorId;
    let gallery = this.state.gallery;
    let html = stateToHTML(this.state.editorState.getCurrentContent()).replace('<p></p>', '');
    let raw = convertToRaw(this.state.editorState.getCurrentContent());

    let data = {title, cover, tags, category, authorId, gallery, html, raw};
    console.log(data);
    Request
      .post('/api/article')
      .send(data)
      .end(function(err, res){
        console.log(err);
        console.log(res);
        console.log((err || !res.ok));
        if (err || !res.ok) {
          alert('保存失败!');
        } else {
          alert('保存成功.');
          location.href = `/article/${res.text}/preview`;
        }
      });
  }
  render() {
    const {editorState} = this.state;

    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    let className = 'RichEditor-editor';
    let contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
         className += ' RichEditor-hidePlaceholder';
      }
    }
    return (
      <div className="content">

        <div className="edit-section">
          <h5>文章标题</h5>
          <input className="title-input" value={this.state.title} onChange={this.handleTitleChange}/>
        </div>
        <div className="edit-section">
          <div className="RichEditor-root">
            <div className={className} onClick={this.focus}>
              <Editor
                blockRendererFn={this.blockRenderer}
                blockStyleFn={getBlockStyle}
                editorState={editorState}
                handleKeyCommand={this.handleKeyCommand}
                onChange={this.onChange}
                placeholder="编辑文章内容..."
                ref="editor"
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
            <span className="RichEditor-controls-btn fa fa-picture-o" onClick={this.toggleImageWindow}>添加图片</span>
            <span className="RichEditor-controls-btn fa fa-video-camera" onClick={this.toggleVideoWindow}>添加视频</span>
          </div>
          {this.state.showImageWindow ?
            <div className="insert-window">
              <div className="modal-header">
                <button className="close" onClick={this.toggleImageWindow}><span>×</span></button>
                <h4 className="modal-title">选择图片</h4>
              </div>
              <div className="modal-body">
                <Dropzone className="gallery-image dropzone" accept="image/*" onDrop={this.onDrop}>
                  <span>点击此处选取图片或将文件拖入该区域</span>
                </Dropzone>
                {this.state.gallery.map(function (imageKey) {
                  return (
                    <div className="gallery-image" key={'img_'+imageKey}>
                      <img className="img-responsive" src={CDN.show(imageKey)} onClick={() => this.addImage(imageKey)}/>
                    </div>
                  );
                }, this)}
              </div>
            </div>
            : null
          }
          {this.state.showVideoWindow ?
            <div className="insert-window">
              <div className="modal-header">
                <button className="close" onClick={this.toggleVideoWindow}><span aria-hidden="true">×</span></button>
                <h4 className="modal-title">粘贴视频通用代码</h4>
              </div>
              <div className="modal-body">
                <textarea className="video-code" value={this.state.videoCode} onChange={this.onChangeVideoCode}/>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={this.addVideo}>插入</button>
              </div>
            </div>
            : null
          }
        </div>
        <div className="edit-section">
          <h5>添加标签</h5>
          <TagsInput value={this.state.tags} onChange={(tags) => this.handleTagsChange(tags)} />
        </div>
        <div className="edit-section clearfix">
          <Dropzone className="gallery-image dropzone" accept="image/*" onDrop={this.onDropCover}>
            <span>上传文章封面</span>
          </Dropzone>
          {this.state.cover !== '' ?
            <img className="img-responsive cover-img" src={CDN.show(this.state.cover)} />
            :null
          }
        </div>
        <div className="edit-section">
          <h5>文章分类</h5>
          <select defaultValue="评测" onChange={this.handleCategoryChange}>
            <option value="评测">评测</option>
            <option value="新闻">新闻</option>
            <option value="访谈">访谈</option>
            <option value="随笔">随笔</option>
          </select>
        </div>
        <div className="edit-section">
          <h5>作者ID</h5>
          <input  className="title-input" value={this.state.authorId} onChange={this.handleAuthorChange} />
        </div>
        <div className="edit-section">
          <button className="btn btn-primary" onClick={this.publish}>发布文章</button>
        </div>
      </div>
      );
  }
}
