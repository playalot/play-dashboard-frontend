import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Moment from 'moment'
import Lightbox from 'react-images'
import Request from 'superagent'
import Immutable from 'immutable'
import { ButtonToolbar,Modal } from 'react-bootstrap'
import CopyToClipboard from 'react-copy-to-clipboard'
import PlayPreImage from '../Common/PlayPreImage'

const _ = require('lodash')

export default class Post extends Component {
    constructor(props) {
        super(props)
        this.state = {
            post:Immutable.fromJS({}),

            lightboxIsOpen:false,
			images:[],
            currentImage:0,

            classModal:false,

            videoUrl:''
            
        }
        this.openImage = (images,currentImage) => this.setState({ lightboxIsOpen: true,images:this.formatImage(images),currentImage})
        this.closeLightbox = () => this.setState({lightboxIsOpen:false,images:[]})
        

        this.addTag = this._addTag.bind(this)
        this.removeTag = this._removeTag.bind(this)

        this.addToy = this._addToy.bind(this)
        this.removeToy = this._removeToy.bind(this)

        this.toggleR18 = this._toggleR18.bind(this)
        this.toggleBlk = this._toggleBlk.bind(this)
        this.toggleRec = this._toggleRec.bind(this)

        this.setPostClassification = this._setPostClassification.bind(this)
        this.removePostClassification = this._removePostClassification.bind(this)
        this.removeAllClassification = this._removeAllClassification.bind(this)

        this.deletePost = this._deletePost.bind(this)
    }


    formatImage(images) {
        return images.map(image => {
            image.src = image.url
            return image
        })
    }
    componentWillMount() {
        if(!this.props.loaded){
			this.props.fetchTagClass()
        }
        Request.get(`/api/post/${this.props.match.params.id}`)
        .end((err,res) => {
            this.setState({
                post:Immutable.fromJS(res.body)
            })
        })
    }
    _addTag() {
        let text = prompt('输入标签')
		if (text) {
            Request
            .post(`/api/post/${this.props.match.params.id}/tag/${text}`)
            .end((err, res) => {
                this.setState((prevState) => {
                    return {
                        post:prevState.post.update('tags',tags => tags.push(Immutable.fromJS(res.body)))
                    }
                })
            })
		}
    }
    _removeTag(tid) {
        Request
            .del(`/api/post/${this.props.match.params.id}/tag/${tid}`)
            .end(() => {
                this.setState((prevState) => {
                    return {
                        post:prevState.post.updateIn(['tags'],tags => {
                            return tags.delete(tags.findKey((tag) => {
                                return tag.get('id') === tid
                            }))
                        })
                    }
                })
            })
    }
    _addToy() {
        let id = prompt('输入玩具ID')
		if (id) {
            Request
            .post(`/api/post/${this.props.match.params.id}/toy/${id}`)
            .end((err, res) => {
                this.setState((prevState) => {
                    return {
                        post:prevState.post.set('toys',[res.body])
                    }
                })
            })
		}
    }
    _removeToy() {
        Request
        .del(`/api/post/${this.props.match.params.id}/toy`)
        .end(() => {
            this.setState((prevState) => {
                return {
                    post:prevState.post.set('toys',[])
                }
            })
        })
    }

    _toggleR18(r18) {
        Request
        .post(`/api/post/${this.props.match.params.id}/r18`)
        .send({ r18 })
        .end(() => {
            this.setState((prevState) => {
                return {
                    post:prevState.post.set('isR18',r18)
                }
            })
        })
    }
    _toggleBlk(block) {
        Request
        .post(`/api/post/${this.props.match.params.id}/block`)
        .send({ block })
        .end(() => {
            this.setState((prevState) => {
                return {
                    post:prevState.post.set('isBlk',block)
                }
            })
        })
    }
    _toggleRec(recommend) {
        Request
        .post(`/api/post/${this.props.match.params.id}/recommend`)
        .send({ recommend })
        .end(() => {
            this.setState((prevState) => {
                return {
                    post:prevState.post.set('isRec',recommend)
                }
            })
        })
    }
    _setPostClassification(id) {
        Request
        .post(`/api/post/${this.props.match.params.id}/class/${id}`)
        .end((err, res) => {
            this.setState((prevState) => {
                return {
                    post:prevState.post.updateIn(['cls'],cls => {
                        return cls.push(id)
                    })
                }
            })
        })
	}
	_removePostClassification(id) {
        Request
        .del(`/api/post/${this.props.match.params.id}/class/${id}`)
        .end((err, res) => {
            this.setState((prevState) => {
                return {
                    post:prevState.post.updateIn(['cls'],cls => {
                        return cls.delete(cls.findKey((cl) => {
                            return cl === id
                        }))
                    })
                }
            })
        })
    }
    _removeAllClassification(cls) {
        Promise.all(cls.map((c) => {
            return Request.del(`/api/post/${this.props.match.params.id}/class/${c}`)
        }))
        .then(() => {
            this.setState((prevState) => {
                return {
                    post:prevState.post.updateIn(['cls'],cls => {
                        return cls.clear()
                    })
                }
            })
        })
    }
    _deletePost() {
        if(confirm('删除这个post?')){
            Request
            .del(`/api/post/${this.props.match.params.id}`)
            .end((err, res) => {
                this.props.history.goBack()
            })
        }
        
    }
    render() {
        const post = this.state.post.toJS()
        if(!post.user) return null
        return (
            <div className="portlet bordered light" style={{maxWidth:768,margin:'0 auto'}}>
                <div className="portlet-title">
                    <div className="d-flex">
                        <Link to={`/user/${post.user.id}`}>
                            <img style={{width:40,height:40}} className="img-circle" src={ post.user.avatar } alt="User Image" />
                        </Link>
                        <div className="d-flex flex-column pl-2">
                            <span><Link to={`/user/${post.user.id}`}>{ post.user.nickname }</Link></span>
                            <small className="text-muted">{ Moment.unix(post.created / 1000).fromNow() }</small>
                        </div>
                    </div>
                </div>
                <div className="portlet-body">
                        {
                        post.video ?
                        <div style={{position:'relative'}}>
                            <PlayPreImage src={post.preview} />
                            <div className="d-flex justify-content-center align-items-center" style={{position:'absolute',top:0,left:0,width:'100%',height:'100%'}}>
                                <span onClick={() => this.setState({videoUrl:post.video.url})} style={{fontSize:80,color:'rgba(255,255,255,.8)',cursor:'pointer'}} className="fa fa-play-circle-o">
                                </span>
                            </div>
                        </div>
                        :<div>
                            <div>
                                <PlayPreImage src={post.photos[0].url640} onClick={() => this.openImage(post.photos,0) } />
                            </div>
                            {
                                post.photos.length === 1 ? null :
                                <div className="play-posts-preview-box pt-2">
                                    {
                                        post.photos.slice(1, post.photos.length).map((photo, i) => {
                                            return (
                                                <div className="play-posts-preview" key={`post_${post.id}_${i}`}>
                                                    <img src={photo.url320} alt="Photo"
                                                        onClick={() => this.openImage(post.photos,i+1) } />
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            }
                            
                        </div>
                    }
                    {
                        post.caption ? <p className="text-muted mb-2">{post.caption}</p> : null
                    }
                    <div>

                        {
                            post.tags.map(t => {
                                return (
                                    <span key={`post_${post.id}_t_${t.id}`} className='label label-info label-margin'>
                                        <Link to={'/tag/'+t.id}>{t.text}</Link>
                                        {" "}
                                        <i className="fa fa-close" onClick={ () => this.removeTag(t.id)}></i>
                                    </span>
                                )
                            })
                        }
                        {
                            post.toys.length ?
                            <span className='label label-success label-margin'>
                                <Link to={'/toy/'+post.toys[0].id}>{post.toys[0].name.substring(0, 25)+'...'}
                                </Link>
                                <i className="fa fa-close" onClick={ () => this.removeToy()}></i>
                            </span>
                            :null
                        }
                    </div>
                    <div>
                        {post.cls.map(c => <span key={`post_${post.id}_c_${c}`} className="label label-warning label-margin" >{_.isEmpty(this.props.classifications) ? c : this.props.classifications[c].name}</span>)}
                    </div>
                    <div className="d-flex p-2 justify-content-around">
                        <span>评论 : {post.counts && post.counts.comments || 0}</span>
                        <span>喜欢 : {post.counts && post.counts.likes || 0}</span>
                        <span>观看 : {post.counts && post.counts.views || 0}</span>
                    </div>
                    <div className="clearfix">
                         <ButtonToolbar className="pull-right">
                             <span onClick={() => this.toggleRec(!post.isRec)} className={`btn btn-sm ${post.isRec ? 'yellow-casablanca':''}`}><i className="fa fa-thumbs-o-up"></i></span> 
                            <CopyToClipboard text={post.id} onCopy={() => null}>
                                <span className="btn btn-sm"><i className="fa fa-copy"></i></span>
                            </CopyToClipboard>
                            <span onClick={ this.addToy } className="btn btn-sm"><i className="fa fa-plus"></i></span>
                            <span onClick={ this.addTag } className="btn btn-sm"><i className="fa fa-tag"></i></span>
                            <span onClick={ () => this.setState({classModal:true}) } className="btn btn-sm"><i className="fa fa-th-large"></i></span>
                            <span onClick={ () => this.removeAllClassification(post.cls) } className="btn btn-sm"><i className="fa fa-chain-broken"></i></span>
                            <span onClick={ () => this.toggleR18(!post.isR18)} className={`btn btn-sm ${post.isR18 ? 'yellow-casablanca':''}`}><i className="fa fa-venus-mars"></i></span> 
                            <span onClick={ () => this.toggleBlk(!post.isBlk)} className={`btn btn-sm ${post.isBlk ? 'yellow-casablanca':''}`}><i className="fa fa-eye-slash"></i></span> 
                            <span onClick={ this.deletePost } className="post-caption-btn btn btn-sm"><i className="fa fa-trash"></i></span>
                        </ButtonToolbar> 
                    </div>
                </div>
                <Lightbox
					images={this.state.images}
					isOpen={this.state.lightboxIsOpen}
					currentImage={this.state.currentImage}
					onClickPrev={() => this.setState((prevState) => ({currentImage:prevState.currentImage - 1}) ) }
					onClickNext={() => this.setState((prevState) => ({currentImage:prevState.currentImage + 1}) ) }
					onClose={this.closeLightbox}
					backdropClosesModal={true}
					showCloseButton={false}
				/>
                <Modal className='modal-container' animation={false} show={this.state.classModal} onHide={() => this.setState({classModal:false})}>
                    <Modal.Body>
                        <strong>已选类别</strong>
                        <div>
                             {
                                post.cls.map((c) => {
                                    return (
                                        <span key={`post_cls_${c}`}
                                            onClick={ () => this.removePostClassification(c) }
                                            className="label label-warning label-margin" >
                                            {
                                                this.props.loaded && this.props.classifications[c]['name']
                                            }  
                                        </span>
                                    )
                                })
                            }  
                        </div>
                        <strong>全部类别</strong>
                        <div>
                            {
                                _.filter(this.props.classifications, (c) => {
                                    return post.cls.indexOf(c.id) === -1
                                }).map((c,key) => {
                                    return (
                                        <span key={`post_cls_all_${c.id}`}
                                            className='label label-info label-margin'
                                            onClick={() => this.setPostClassification(c.id) }>
                                            {c.name}
                                        </span>
                                    )
                                })
                            }
                        </div>
                    </Modal.Body>
                </Modal>
                {
					this.state.videoUrl ?
					<div className="play-modal"  onClick={() => this.setState({videoUrl:''})}>
						<div className="play-dialog" onClick={e => e.stopPropagation()}>
							<div>
								<video style={{width:'100%',maxHeight:500}} src={this.state.videoUrl} controls></video>
							</div>
						</div>
					</div>
					: null
				}
            </div>
        )
    }
}