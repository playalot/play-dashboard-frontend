import React, { Component } from 'react'
import { Editor, EditorState,RichUtils,ContentState,Entity,convertToRaw } from 'draft-js'
import Request from 'superagent'
import Dropzone from 'react-dropzone'

import decorator from '../PlayDraft/DecoratorServer'
import DraftToolbar from '../PlayDraft/DraftToolbar'
import { makeId,mediaBlockRenderer, draftFromHtml,draftToHtml} from '../PlayDraft/draftServer'
import { createImageEntity } from '../PlayDraft/entityServer'
import CDN from '../../widgets/cdn'

import { uploadFiles } from '../../widgets/upload'

export default class extends Component {
    constructor(props){
        super(props)
        this.state = {
            editorState: EditorState.createEmpty( decorator )
        }
              
        this.focus = () => this.refs.editor.focus()
	  	this.onChange = editorState => this.setState({editorState})
		this.handleKeyCommand = (command) => this._handleKeyCommand(command)
        
        this.dropImage = this._dropImage.bind(this)
        this.uploadImage = this._uploadImage.bind(this)
        this.addImage = this._addImage.bind(this)
        this.test = () => {
            console.log(this.state.editorState.getCurrentContent().getEntityMap())
            // console.log(draftToHtml(this.state.editorState.getCurrentContent()))
            // uploadFiles().then(a => console.log(a))
        }
        this.test2 = (e) => {
            console.log(e.dataTransfer.files)
            const preview = window.URL.createObjectURL(e.target.files[0])
            const img = new Image()
            img.onload = () => {
                console.log(img.width)
                console.log(img.height)
            }
            img.src = preview
            // var file = e.target.files[0];
            // var reader = new FileReader();
            // reader.readAsDataURL(file);
            // reader.onload = (e) =>{
            //     // var pic = document.getElementById("preview");
            //     img.src = e.target.result
            //     img.onload = () => {
            //         console.log(img.width)
            //         console.log(img.height)
            //     }
            // }
        }
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
    _dropImage(files) {
        uploadFiles(files,'article/photo').then(keys => {
            keys.map(key => {
                this.addImage(key)
            })
        })
        // Request.get(`/api/uptoken`)
        // .end((err, res) => {
        //     let uploadToken = res.body.uptoken
        //     files.forEach((file) => {
        //         let d = new Date()
        //         let id = makeId()
        //         let uploadKey = 'article/photo/' + Math.round(d.getTime() / 1000) + '_' + id + '.' + file.name.split('.').pop()
        //         this.uploadImage(file, uploadKey, uploadToken)
        //     })
        // })
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
            <div>
                <p style="text-decoration: underline;">
                    <b>Bold text</b>, <i>Italic text</i> 
                </p>
            </div>
            <figure>
                <img src="https://www.baidu.com/img/bd_logo1.png" />
            </figure>
            <div>
            <a href="http://www.baidu.com">baiduk</a>aasa
            </div>
            </div>
        `
        this.setState({
            editorState:EditorState.createWithContent(draftFromHtml(html),decorator)
        })
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
                    <input type="file" onDrop={this.test2} onChange={this.test2} />
                    <div style={{width:100,height:100,background:'red'}} onDrop={this.test2}>

                    </div>
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
                    <button onClick={this.test}>转html</button>
                </div>
            </div>
        )
    }
}

