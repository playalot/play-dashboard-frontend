import React,{ Component } from 'react'
import { Link } from 'react-router-dom'
import { Col, ButtonToolbar } from 'react-bootstrap'
import Moment from 'moment'
import CopyToClipboard from 'react-copy-to-clipboard'
import Masonry from 'react-masonry-component'

const _ = require('lodash')

export default class PostPanel extends Component{
	constructor(props) {
	  	super(props)
	  	this.toggleRecommend = () => this.props.toggleRecommend(this.props.post.id)
	  	this.toggleBlock = () => this.props.toggleBlock(this.props.post.id)
	  	this.toggleR18 = () => this.props.toggleR18(this.props.post.id)
	  	this.removeTag = (id) => confirm('删除这个标签?') && this.props.removeTag(this.props.post.id,id)
	  	this.removeToy = () => confirm('删除这个玩具标签?') && this.props.removeToy(this.props.post.id)
	  	this.deletePost = () => confirm('删除这个post?') && this.props.deletePost(this.props.post.id)
	  	this.addTag = this._addTag.bind(this)
	  	this.addToy = this._addToy.bind(this)
	}
	_addToy() {
		let id = prompt('输入玩具ID')
		if (id) {
			this.props.addToy(this.props.post.id,id)
		}
	}
	_addTag() {
		let text = prompt('输入标签')
		if (text) {
			this.props.addTag(this.props.post.id,text)
		}
	}
	formatUrl(images) {
		images.map((image) => {
			image.src = image.url
		})
		return images
	}
	render() {
		const { post } = this.props
		const btnClass = 'btn btn-sm'
		return(
			<Col xs={12} sm={4} lg={3}>
				<div className="portlet bordered light" style={{padding:'12px 5px 15px 5px'}}>
					<div className="portlet-title" style={{marginBottom:0}}>
						<div className="d-flex">
							<Link to={`/user/${post.user.id}`}>
								<img style={{maxWidth:40}} className="img-circle" src={ post.user.avatar } alt="User Image" />
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
							<div>
								<video style={{width:'100%'}} src={post.video.url} controls></video>
							</div>
							:<div>
								<div>
									<ImgLoad src={post.photos[0].url640} onClick={() => this.props.openImage(this.formatUrl(post.photos),0) } />
								</div>
								{
									post.photos.length === 1 ? null :
									<div className="play-posts-preview-box pt-2">
										{
											post.photos.slice(1, post.photos.length).map((photo, i) => {
												return (
													<div className="play-posts-preview" key={`post_${post.id}_${i}`}>
														<img src={photo.url320} alt="Photo"
															onClick={() => this.props.openImage(this.formatUrl(post.photos),i+1) } />
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
						<div className="">
							{post.tags.map(t => <span key={`post_${post.id}_t_${t.id}`} className='label label-info label-margin'><Link to={'/tag/'+t.id}>{t.text}</Link>{" "}<i className="fa fa-close" onClick={ () => this.removeTag(t.id)}></i></span>)}
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
						<div className="">
							{post.cls.map(c => <span key={`post_${post.id}_c_${c}`} className="label label-warning label-margin" >{_.isEmpty(this.props.classifications) ? c : this.props.classifications[c].name}</span>)}
						</div>
						<div className="clearfix">
							<ButtonToolbar className="pull-right">
								<span onClick={ this.toggleRecommend } className={`${btnClass} ${post.isRec ? 'yellow-casablanca':''}`}><i className="fa fa-thumbs-o-up"></i></span>
								<CopyToClipboard text={post.id} onCopy={() => null}>
									<span className="btn btn-sm"><i className="fa fa-copy"></i></span>
								</CopyToClipboard>
								<span onClick={ this.addToy } className="btn btn-sm"><i className="fa fa-plus"></i></span>
								<span onClick={ this.addTag } className="btn btn-sm"><i className="fa fa-tag"></i></span>
								<span onClick={ () => this.props.openClass( post ) } className="btn btn-sm"><i className="fa fa-th-large"></i></span>
								<span onClick={ () => this.props.removeAllClassification(post.id) } className="btn btn-sm"><i className="fa fa-chain-broken"></i></span>
								<span onClick={ this.toggleR18 } className={`${btnClass} ${post.isR18 ? 'yellow-casablanca':''}`}><i className="fa fa-venus-mars"></i></span>
								<span onClick={ this.toggleBlock } className={`${btnClass} ${post.isBlk ? 'yellow-casablanca':''}`}><i className="fa fa-eye-slash"></i></span>
								<span onClick={ this.deletePost } className="post-caption-btn btn btn-sm"><i className="fa fa-trash"></i></span>
							</ButtonToolbar>
						</div>
					</div>
				</div>
	        </Col>
		)
	}
}

class ImgLoad extends Component{
	constructor(props) {
	  	super(props)
	  	this.state = {
	  		loaded:false
	  	}
	}
	componentWillMount() {
		const {src} = this.props
		let w,h
		try{
			w = /_w_\d{1,}/.exec(src)[0].replace('_w_','')
			h = /_h_\d{1,}/.exec(src)[0].replace('_h_','')
			
		}catch(e){
			console.error(e)
			w = 0
			h = 0
		}
		this.setState({
			scale:`${h/w*100}%`
		})
		const img = new Image()
		img.src = src
		img.onload = () => {
			this.setState({
				loaded:true
			})
		}
	}
	render() {
		return (
			<div style={{width:'100%',height:0,paddingBottom:`${this.state.scale}`,background:'rgb(238,237,235)',position:'relative'}}>
				{
					this.state.loaded ?
					<img src={this.props.src} onClick={this.props.onClick} alt="photo" style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',objectFit:'contain'}} />
					:null
				}
			</div>
		)
	}
}