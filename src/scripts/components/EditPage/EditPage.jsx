import React, {
    Component
} from 'react'
import { convertToRaw } from 'draft-js'
import { stateToHTML } from 'draft-js-export-html'
import Request from 'superagent'
import Dropzone from 'react-dropzone'
import TagsInput from 'react-tagsinput'
import Select from 'react-select'

import CDN from '../../widgets/cdn'
import PlayDraftEditor from '../PlayDraft/PlayDraftEditor'
import { makeId } from '../PlayDraft/ComponentServer'
export default class EditPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            //editor相关
            contentState:null,
            raw:false,
            //表单相关
            uploadUrl: 'http://upload.qiniu.com/',
            cover:'',
            title:'',
            tags:[],
            category:'news',
            authorId:'',
            gallery:[],
            dialogSubmit:false
        }
        //editor的回调方法
        this.onChangeEditor = (contentState,gallery) => this.setState({contentState,gallery},() => this.saveStorage() )
        //封面
        this.onDropCover = this._onDropCover.bind(this)
        //自动保存至storage
        this.saveStorage = this._saveStorage.bind(this)
    }
    componentDidMount() {
        const data = window.localStorage.getItem('editor-draft')
        if (data !== null && !this.props.params.id) {
            if (confirm('请问是否要载入保存的草稿')) {
                const draftData = JSON.parse(data)
                let { title, cover, tags, category, gallery, raw, authorId } = draftData
                this.setState({
                    title, cover, tags, category, gallery,authorId
                })
                this.props.setPageRaw(raw,gallery)
            }
        }
        if(this.props.params.id) {
			Request
			.get(`/api/page/${this.props.params.id}/raw`)
			.end((err,res) => {
				const { title, cover, tags, category, gallery, raw, authorId } = res.body
				this.setState({
					title, cover, tags, category, gallery, authorId:authorId.$oid
				})
                this.props.setPageRaw(raw,gallery)
			})
		}
    }
    componentWillReceiveProps(nextProps) {
        if(!this.props.params.id){
            this.setState({authorId:nextProps.user.id})
        }
    }
    _onDropCover(files) {
        Request.get('/api/uptoken')
        .end((err, res) => {
            let uploadToken = res.body.uptoken
            const file = files[0]
            const img = new Image()
            img.onload = () => {
                if(img.width <320){
                    return alert('图片太小')
                }
                const uploadKey = `article/cover/${makeId()}/_w_${img.width}_h_${img.height}.${file.name.split('.').pop()}`
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
                    },() => this.saveStorage())
                })
            };
            img.src = file.preview
        })
    }
    _saveStorage() {
        const {
            title, cover, tags, category, gallery,authorId, contentState
        } = this.state
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
            contentState, title, cover, tags, category, gallery,authorId
        } = this.state
        const options = {
            blockRenderers: {
                atomic: (block) => {
                    const entity = contentState.getEntity(block.getEntityAt(0))
                    const data = entity.getData()
                    if (data.type === 'image') {
                        return `<figure><img src="${data.src}" style="width:${data.size}" /></figure>`
                    } else if (data.type === 'video') {
                    	if(data.src) {
                        	return `<figure><video width="100%" src="${data.src}" poster="${data.poster}" controls /></figure>`
                    	}else {
                    		return `<figure>${data.html}</figure>`
                    	}
                    } else {
                    	return null
                    }
                },
            }
        }
        const raw = convertToRaw(contentState)
        const html = stateToHTML(contentState,options)
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
            if(this.props.params.id) {
                data.id = this.props.params.id
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
                            this.context.router.push('/page')
                        })
                    }
                })
        })
    }
    render() {
        const options = [
            { value: 'review', label: '评测' },
            { value: 'news', label: '新闻' },
            { value: 'info', label: '情报' },
            { value: 'interview', label: '访谈' },
            { value: 'essay', label: '随笔' },
            { value: 'knowledge', label: '干货' }
        ]
        const { cover,title,tags,category,authorId,dialogSubmit,gallery } = this.state
        return (
            <div className="editarticle">
                <div className="edit-section">
                    <Dropzone className="upload-cover" onDrop={this.onDropCover}>
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
                <PlayDraftEditor
                    onChangeEditor={this.onChangeEditor}
                />
                <div className="edit-section">
                    <p className="title">添加标签</p>
                    <TagsInput value={tags} onChange={(tags) => this.setState({tags},() => this.saveStorage())} />
                </div>
                <div className="edit-section">
                    <p className="title">文章分类</p>
                    <Select
                    name="form-field-name"
                    value={category}
                    options={options}
                    clearable={false}
                    onChange={(newValue) => this.setState({category:newValue.value},() => this.saveStorage())}
                    />
                </div>
                <div className="edit-section">
                    <p className="title">作者ID</p>
                    <input type="text" value={authorId} className="form-control" onChange={(e) => this.setState({authorId:e.target.value},() => this.saveStorage())}/>
                </div>
                <div className="edit-section">
                    <button className="btn btn-primary" onClick={this.publish.bind(this)}>发布文章</button>
                </div>
                {
                    dialogSubmit ?
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
