import React, { Component } from 'react'
import { Editor, EditorState,RichUtils,ContentState,Entity,convertToRaw,convertFromHTML } from 'draft-js'
// import {convertFromHTML} from 'draft-convert'
import Request from 'superagent'
import Dropzone from 'react-dropzone'

import decorator from '../PlayDraft/DecoratorServer'
import DraftToolbar from '../PlayDraft/DraftToolbar'
import { makeId, DraftImage,mediaBlockRenderer} from '../PlayDraft/draftServer'
import { createLinkEntity,createImageEntity,createVideoEntityWithHtml,createVideoEntityWithSrc,removeEntity } from '../PlayDraft/entityServer'
import CDN from '../../widgets/cdn'


export default class extends Component {
    constructor(props){
        super(props)
        this.state = {
            editorState: EditorState.createEmpty( decorator )
        }
              
        this.focus = () => this.refs.editor.focus()
	  	this.onChange = editorState => this.setState({editorState})
		this.handleKeyCommand = (command) => this._handleKeyCommand(command)
        this.blockRendererFn = this._blockRendererFn.bind(this)
        
        this.dropImage = this._dropImage.bind(this)
        this.uploadImage = this._uploadImage.bind(this)
        this.addImage = this._addImage.bind(this)
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
    _blockRendererFn(block) {
        const { editorState } = this.state
        const contentState = editorState.getCurrentContent()
        if (block.getType() === 'atomic') {
            return {
                component: (props) => {
                    const entityKey = props.block.getEntityAt(0)
                    const entity = contentState.getEntity(entityKey)
                    const { html, src } = entity.getData()
                    const type = entity.getType()

                    let media = null
                    if (type === 'image') {
                        media = (
                            <DraftImage
                                src={src.split('!')[0]}
                                delete={() => this.onChange(removeEntity(editorState,props.block.getKey()))}
                            />
                        )
                    }
                    return media
                },
                editable: false,
            };
        }
      return null;
    }
    _dropImage(files) {
        Request.get(`/api/uptoken`)
        .end((err, res) => {
            let uploadToken = res.body.uptoken
            files.forEach((file) => {
                let d = new Date()
                let id = makeId()
                let uploadKey = 'article/photo/' + Math.round(d.getTime() / 1000) + '_' + id + '.' + file.name.split('.').pop()
                this.uploadImage(file, uploadKey, uploadToken)
            })
        })
    }
    _uploadImage(file, uploadKey, uploadToken) {
        if (!file || file.size === 0) {
            return null;
        }
        Request
            .post('http://upload.qiniu.com/')
            .field('key', uploadKey)
            .field('token', uploadToken)
            .field('x:filename', file.name)
            .field('x:size', file.size)
            .attach('file', file, file.name)
            .set('Accept', 'application/json')
            .end((err, res) => {
                this.addImage(uploadKey)
            })
    }
    _addImage(imageKey) {
        const { editorState } = this.state
        const src = CDN.show(imageKey) + '!articlestyle';
        this.setState({
            editorState:createImageEntity(editorState,src)
        })
    }
    componentDidMount() {
        const html = `
            <div>
                <p style="text-decoration: underline;">
                
            <b>Bold text</b>, <i>Italic text</i> 
                </p>
            </div>
            <img src="http://img.playalot.cn/article/cover/1501052255_w_720_h_474_bz461k14b1.jpg?imageView2/2/w/1280/q/90" />  <br />
            <a href="http://www.baidu.com">baiduk</a>aasa<br />
        `
        const blocksFromHTML = convertFromHTML(html)//.contentBlocks
        // const entityMaps = convertFromHTML(html).entityMap
        // blocksFromHTML.map((block,i) => {
        //     console.log(block.toJS())
        // })
        // let i = 1
        // while(entityMaps.get(i.toString())){
        //     console.log(entityMaps.get(i.toString()).toJS())
        //     i++
        // }
        // const blocksFromHTML = convertFromHTML(html);
        // const state = ContentState.createFromBlockArray(
        //     blocksFromHTML.contentBlocks,
        //     blocksFromHTML.entityMap
        // );
        // this.setState({
        //     editorState:EditorState.createWithContent(state,decorator)
        // })
        // const blocksFromHTML = convertFromHTML(html);

        const defaultConvertedContentState = ContentState.createFromBlockArray(
            blocksFromHTML.contentBlocks,
            blocksFromHTML.entityMap,
        );
        const raw = convertToRaw(defaultConvertedContentState)
        console.log(raw)

        // const customConvertedContentState = CustomContentStateConverter(defaultConvertedContentState);

        // const initialEditorState = EditorState.createWithContent(
        //     customConvertedContentState,
        //     decorator,
        // );
        // this.setState({
        //     editorState:initialEditorState
        // })
    }
    render() {
        const {editorState} = this.state;
        let className = 'RichEditor-editor';
        var contentState = editorState.getCurrentContent();
        if (!contentState.hasText()) {
            if (contentState.getBlockMap().first().getType() !== 'unstyled') {
                className += ' RichEditor-hidePlaceholder'
            }
        }
        return (
            <div className="edit-root">
                <div className="RichEditor-root">
                    <DraftToolbar editorState={editorState} onChange={this.onChange}>
                         <Dropzone data-toggle="tooltip" data-placement="top" title="图片" className="fa fa-camera-retro"  accept="image/*" onDrop={this.dropImage}>
                        </Dropzone> 
                    </DraftToolbar>
                    <div className={className} style={{border:'1px dashed #eee'}} onClick={this.focus}>
                        <Editor
                            blockRendererFn={mediaBlockRenderer}
                            editorState={editorState}
                            handleKeyCommand={this.handleKeyCommand}
                            onChange={this.onChange}
                            placeholder="Tell a story..."
                            ref="editor"
                        />
                    </div>
                </div>
            </div>
        )
    }
}

//  const CustomConvertFromHTML = (html) => {
//   // Correctly seperates paragraphs into their own blocks
//   const blockRenderMap = DefaultDraftBlockRenderMap.set('p', { element: 'p' });
//   const blocksFromHTML = convertFromHTML(html, getSafeBodyFromHTML, blockRenderMap);
//   blocksFromHTML.contentBlocks = blocksFromHTML.contentBlocks.map(block => (block.get('type') === 'p' ? block.set('type', 'unstyled') : block));

//   return blocksFromHTML;
// };

// const CustomContentStateConverter = (contentState) => {
//   // Correctly assign properties to images and links
//   const newBlockMap = contentState.getBlockMap().map((block) => {
//     const entityKey = block.getEntityAt(0);
//     if (entityKey !== null) {
//       const entityBlock = contentState.getEntity(entityKey);
//       const entityType = entityBlock.getType();
//       switch (entityType) {
//         case 'IMAGE': {
//           const newBlock = block.merge({
//             type: 'atomic',
//             text: 'img',
//           });
//           // const newContentState = contentState.mergeEntityData(entityKey, { mutability: 'IMMUTABLE' });
//           return newBlock;
//         }
//         default:
//           return block;
//       }
//     }
//     return block;
//   });
//   const newContentState = contentState.set('blockMap', newBlockMap);

//   return newContentState;
// };