import React, {
  Component
} from 'react'
import CDN from '../widgets/cdn'
import stateToHTML from '../utils/stateToHTML'
import {
  AtomicBlockUtils,
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  Entity,
} from 'draft-js'
export default class  extends Component {
        constructor(props) {
          super(props);

          this.state = {
            editorState: EditorState.createEmpty(),
            showURLInput: false,
            url: '',
            urlType: '',
          };

          this.focus = () => this.refs.editor.focus();
          this.logState = () => {
            const content = this.state.editorState.getCurrentContent();
            console.log(convertToRaw(content));
          };
          this.onChange = (editorState) => this.setState({editorState});
          this.onURLChange = (e) => this.setState({urlValue: e.target.value});

          this.addAudio = this._addAudio.bind(this);
          this.addImage = this._addImage.bind(this);
          this.addVideo = this._addVideo.bind(this);
          this.confirmMedia = this._confirmMedia.bind(this);
          this.handleKeyCommand = this._handleKeyCommand.bind(this);
          this.onURLInputKeyDown = this._onURLInputKeyDown.bind(this);
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

        _confirmMedia(e) {
          e.preventDefault();
          const {editorState, urlValue, urlType} = this.state;
          const contentState = editorState.getCurrentContent();
          const entityKey = Entity.create(
            urlType,
            'IMMUTABLE',
            {src: urlValue}
          );
          // const newEditorState = EditorState.set(
          //   editorState,
          //   {currentContent: contentStateWithEntity}
          // );

          this.setState({
            editorState: AtomicBlockUtils.insertAtomicBlock(
              this.state.editorState,
              entityKey,
              ' '
            ),
            showURLInput: false,
            urlValue: '',
          }, () => {
            setTimeout(() => this.focus(), 0);
          });
        }

        _onURLInputKeyDown(e) {
          if (e.which === 13) {
            this._confirmMedia(e);
          }
        }

        _promptForMedia(type) {
          const {editorState} = this.state;
          this.setState({
            showURLInput: true,
            urlValue: '',
            urlType: type,
          }, () => {
            setTimeout(() => this.refs.url.focus(), 0);
          });
        }

        _addAudio() {
          this._promptForMedia('audio');
        }

        _addImage() {
          let imageKey = `https://www.baidu.com/img/2016_10_09logo_61d59f1e74db0be41ffe1d31fb8edef3.png`
          const src = CDN.show(imageKey) + '?articlestyle';
          const size = 'auto'
          const type = 'image'
          const entityKey = Entity.create('image', 'IMMUTABLE', {
            src,
            size,
            type
          });
          this.onChange(AtomicBlockUtils.insertAtomicBlock(
            this.state.editorState,
            entityKey,
            ' '
          ))
        }

        _addVideo() {
          this._promptForMedia('video');
        }
        mediaBlockRenderer(block) {
        if (block.getType() === 'atomic') {
          return {
            component: (props) => {
        const entity = Entity.get(props.block.getEntityAt(0));
        const {src} = entity.getData();
        const type = entity.getType();

        let media;
        if (type === 'audio') {
          media = <Audio src={src} />;
        } else if (type === 'image') {
          media = <Image src={src}><p>abcdefg</p></Image>;
        } else if (type === 'video') {
          media = <Video src={src} />;
        }

        return media;
      },
            editable: false,
          };
        }

        return null;
      }
        render() {
          let urlInput;
          if (this.state.showURLInput) {
            urlInput =
              <div style={styles.urlInputContainer}>
                <input
                  onChange={this.onURLChange}
                  ref="url"
                  style={styles.urlInput}
                  type="text"
                  value={this.state.urlValue}
                  onKeyDown={this.onURLInputKeyDown}
                />
                <button onMouseDown={this.confirmMedia}>
                  Confirm
                </button>
              </div>;
          }

          return (
            <div style={styles.root}>
              <div style={{marginBottom: 10}}>
                Use the buttons to add audio, image, or video.
              </div>
              <div style={{marginBottom: 10}}>
                Here are some local examples that can be entered as a URL:
                <ul>
                  <li>media.mp3</li>
                  <li>media.png</li>
                  <li>media.mp4</li>
                </ul>
              </div>
              <div style={styles.buttons}>
                <button onMouseDown={this.addAudio} style={{marginRight: 10}}>
                  Add Audio
                </button>
                <button onMouseDown={this.addImage} style={{marginRight: 10}}>
                  Add Image
                </button>
                <button onMouseDown={this.addVideo} style={{marginRight: 10}}>
                  Add Video
                </button>
              </div>
              {urlInput}
              <div style={styles.editor} onClick={this.focus}>
                <Editor
                  blockRendererFn={this.mediaBlockRenderer}
                  editorState={this.state.editorState}
                  // handleKeyCommand={this.handleKeyCommand}
                  onChange={this.onChange}
                  placeholder="Enter some text..."
                  ref="editor"
                />
              </div>
              <input
                onClick={this.logState}
                style={styles.button}
                type="button"
                value="Log State"
              />
            </div>
          );
        }
      }

      function mediaBlockRenderer(block) {
        if (block.getType() === 'atomic') {
          return {
            component: Media,
            editable: false,
          };
        }

        return null;
      }

      const Audio = (props) => {
        return <audio controls src={props.src} style={styles.media} />;
      };
      class Image extends Component{
        render() {
          return <div><p>sadfbasdlf</p>{this.props.children}<img src={this.props.src} style={styles.media} /></div>
        }
      }
      

      const Video = (props) => {
        return <video controls src={props.src} style={styles.media} />;
      };

      const Media = (props) => {
        const entity = Entity.get(props.block.getEntityAt(0));
        const {src} = entity.getData();
        const type = entity.getType();

        let media;
        if (type === 'audio') {
          media = <Audio src={src} />;
        } else if (type === 'image') {
          media = <Image src={src} />;
        } else if (type === 'video') {
          media = <Video src={src} />;
        }

        return media;
      };

      const styles = {
        root: {
          fontFamily: '\'Georgia\', serif',
          padding: 20,
          width: 600,
        },
        buttons: {
          marginBottom: 10,
        },
        urlInputContainer: {
          marginBottom: 10,
        },
        urlInput: {
          fontFamily: '\'Georgia\', serif',
          marginRight: 10,
          padding: 3,
        },
        editor: {
          border: '1px solid #ccc',
          cursor: 'text',
          minHeight: 80,
          padding: 10,
        },
        button: {
          marginTop: 10,
          textAlign: 'center',
        },
        media: {
          width: '100%',
        },
      };

      
      





// import React, { Component } from 'react'
// import Dropzone from 'react-dropzone'
// import Select from 'react-select'
// import Request from 'superagent'
// import TagsInput from 'react-tagsinput'
// import ReactDOM from 'react-dom'

// import {
//   Editor,
//   EditorState,
//   RichUtils,
//   CompositeDecorator,
//   Entity,
//   ContentState,
//   AtomicBlockUtils,
//   convertToRaw,
//   convertFromRaw,
//   Modifier,
//   SelectionState,
// } from 'draft-js'
// import CDN from '../widgets/cdn'
// import stateToHTML from '../utils/stateToHTML'


// export default class EditArticle extends Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       editorState: EditorState.createEmpty(),
//     }
//     this.focus = () => this.refs.editor.focus()
//     this.blur = () => this.refs.editor.blur()
//     this.onChange = (editorState) => this.setState({ editorState })
//     this.addImage = this._addImage.bind(this)
//     this.publish = () => this._publish();
//   }
//   _addImage() {
//     let imageKey = `https://www.baidu.com/img/2016_10_09logo_61d59f1e74db0be41ffe1d31fb8edef3.png`
//     const src = CDN.show(imageKey) + '?articlestyle';
//     const size = 'auto'
//     const type = 'image'
//     const entityKey = Entity.create('image', 'IMMUTABLE', {
//       src,
//       size,
//       type
//     });
//     this.onChange(AtomicBlockUtils.insertAtomicBlock(
//       this.state.editorState,
//       entityKey,
//       ' '
//     ))
//   }
//   _publish() {
//     let options = {
//       blockRenderers: {
//         atomic: (block) => {
//           const entity = Entity.get(block.getEntityAt(0));
//           const data = entity.getData();
//           if (data.type === 'image') {
//             if (data.remove) {
//               return ''
//             } else {
//               return `<figure><img src="${data.src}" style="width:${data.size}" /></figure>`
//             }
//           }
//         },
//       }
//     }
//     let content = this.state.editorState.getCurrentContent()
//     let raw = convertToRaw(content)
//     let html = stateToHTML(content, options).replace(/<p><br><\/p>/g, '')
//     let data = {
//       html,
//       raw
//     }
//     console.info(data)

//   }
//   blockRenderer(block) {
//     if (block.getType() === 'atomic') {
//       return {
//         component: (props) => {
//           const _this = this;
//           const entityKey = props.block.getEntityAt(0);
//           const entity = Entity.get(props.block.getEntityAt(0));
//           const {
//             src,
//             html,
//             size,
//           } = entity.getData();
//           const type = entity.getType();
//           let media;
//           if (type === 'image') {
//             let sizeBar = 'glyphicon '
//             sizeBar += size === 'auto' ? 'glyphicon-resize-full' : 'glyphicon-resize-small'
//             media = (
//               <MediaImage
//                   src={src}>
//                 </MediaImage>
//             )
//           } else if (type === 'video') {
//             media = <div dangerouslySetInnerHTML={{__html: html}}></div>;
//           }
//           return media;
//         },
//         editable: false,
//       };
//     }
//     return null;
//   }
//   render() {
//     const {editorState} = this.state;
//     let className = 'edit-editor';
//     let contentState = editorState.getCurrentContent();
//     if (!contentState.hasText()) {
//       if (contentState.getBlockMap().first().getType() !== 'unstyled') {
//         className = ' edit-hidePlaceholder';
//       }
//     }
//     return (
//       <div className="editarticle">
//         <div className="edit-section">
//           <div className="edit-root">
//             <div className={className} onClick={this.focus}>
//               <Editor
//                 blockRendererFn={this.blockRenderer.bind(this)}
//                 editorState={editorState}
//                 onChange={this.onChange}
//                 placeholder="编辑文章内容"
//                 ref="editor"
//               />
//               </div>
//                 <div className="edit-controls">
//                     <i className="fa fa-camera-retro" onClick={this.addImage}></i>

//                 </div>
//               </div>
//         </div>
       
//         <div className="edit-section">
//           <button className="btn btn-primary" onClick={this.publish}>发布文章</button>
//         </div>
//       </div>
//     )
//   }
// }


// class MediaImage extends Component{
//   render() {
//     return(
//       <div className="media-image-wrap">
//           <img src={this.props.src}/>
//       </div>
//     )
//   }
// }

