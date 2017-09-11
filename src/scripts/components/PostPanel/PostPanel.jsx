import React,{ Component } from 'react'
import { Link } from 'react-router-dom'
import { Col, ButtonToolbar } from 'react-bootstrap'
import Moment from 'moment'
import CopyToClipboard from 'react-copy-to-clipboard'
import Masonry from 'react-masonry-component'
import PlayPreImage from '../Common/PlayPreImage'

const _ = require('lodash')

export default class PostPanel extends Component{
	constructor(props) {
		super(props)
		this.state = {
			videoUrl:'',
			sharePost:false,
		}
	  	this.toggleRecommend = () => this.props.toggleRecommend(this.props.post.id)
	  	this.toggleBlock = () => this.props.toggleBlock(this.props.post.id)
	  	this.toggleR18 = () => this.props.toggleR18(this.props.post.id)
	  	this.removeTag = (id) => confirm('删除这个标签?') && this.props.removeTag(this.props.post.id,id)
	  	this.removeToy = () => confirm('删除这个玩具标签?') && this.props.removeToy(this.props.post.id)
	  	this.deletePost = () => confirm('删除这个post?') && this.props.deletePost(this.props.post.id)
	  	this.addTag = this._addTag.bind(this)
		this.addToy = this._addToy.bind(this)
				
		this.sharePost = () => this.setState({sharePost:true}) 
		this.sendMsg = (touid) => {
			WKIT.switchTouid({
	            touid,
	        });
			WKIT.sendMsg({
				touid,
				msg:`小伙伴你好~(*´▽｀)ノ因您搬运官方图片存在不规范操作，所以来通知一下~
				
				如果搬运官方图片时一定要打上搬运标签，而且要是有文字信息的 例如发售日 售价 开订日期 也一定都要写在描述上面 绝不能只搬运图片呦
				
				其他玩家的作品要是想转载的话，就一定要获得授权，不然是不允许转到玩具控平台的，玩具姬看到后会马上删掉哦٩(×̯×)۶ 
				`
			})
		}
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
			<Col xs={12} sm={4} lg={3} className="p-2">
				<div className="m-portlet m-portlet--mobile mb-2">
					<div className="m-portlet__head p-3">
						<div className="m-portlet__head-caption">
							<div className="d-flex">
								<Link to={`/user/${post.user.id}`}>
									<img style={{maxWidth:40}} className="rounded-circle" src={ post.user.avatar } alt="User Image" />
								</Link>
								<div className="d-flex flex-column pl-2">
									<span><Link to={`/user/${post.user.id}`}>{ post.user.nickname }</Link></span>
									<small className="text-muted">{ Moment.unix(post.created / 1000).fromNow() }</small>
								</div>
							</div>

						</div>
					</div>
					<div className="m-portlet__body p-3">
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
									<PlayPreImage src={post.preview} onClick={() => this.props.openImage(this.formatUrl(post.photos),0) } />
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
							{post.tags.map(t => <span key={`post_${post.id}_t_${t.id}`} className='m-badge m-badge--info m-badge--wide label-margin'><Link to={'/tag/'+t.id}>{t.text}</Link>{" "}<i className="fa fa-close" onClick={ () => this.removeTag(t.id)}></i></span>)}
							{
								post.toys.length ?
								<span className='m-badge m-badge--success m-badge--wide'>
									<Link to={'/toy/'+post.toys[0].id}>{post.toys[0].name.substring(0, 25)+'...'}
									</Link>
									<i className="fa fa-close" onClick={ () => this.removeToy()}></i>
								</span>
								:null
							}
						</div>
						<div className="">
							{post.cls.map(c => <span key={`post_${post.id}_c_${c}`} className="m-badge m-badge--warning m-badge--wide text-white" >{_.isEmpty(this.props.classifications) ? c : this.props.classifications[c].name}</span>)}
						</div>
						<div className="d-flex p-2 justify-content-around">
							<span>评论 : {post.counts && post.counts.comments || 0}</span>
							<span>喜欢 : {post.counts && post.counts.likes || 0}</span>
							<span>观看 : {post.counts && post.counts.views || 0}</span>
						</div>
						<div className="clearfix">
							<ButtonToolbar className="pull-right">
								<span onClick={() => this.props.toggleRecommend(post.id,!post.isRec)} className={`${btnClass} ${post.isRec ? 'btn-warning':''}`}><i className="fa fa-thumbs-o-up"></i></span>
								<CopyToClipboard text={post.id} onCopy={() => null}>
									<span className="btn btn-sm"><i className="fa fa-copy"></i></span>
								</CopyToClipboard>
								<span onClick={ () => this.setState({sharePost:true}) } className="btn btn-sm"><i className="fa fa-share-square-o"></i></span>
								<span onClick={ this.addToy } className="btn btn-sm"><i className="fa fa-plus"></i></span>
								<span onClick={ this.addTag } className="btn btn-sm"><i className="fa fa-tag"></i></span>
								<span onClick={ () => this.props.openClass( post ) } className="btn btn-sm"><i className="fa fa-th-large"></i></span>
								<span onClick={ () => this.props.removeAllClassification(post.id,post.cls) } className="btn btn-sm"><i className="fa fa-chain-broken"></i></span>
								<span onClick={() => this.props.toggleR18(post.id,!post.isR18) } className={`${btnClass} ${post.isR18 ? 'btn-warning':''}`}><i className="fa fa-venus-mars"></i></span>
								<span onClick={() => this.props.toggleBlock(post.id,!post.isBlk)} className={`${btnClass} ${post.isBlk ? 'btn-warning':''}`}><i className="fa fa-eye-slash"></i></span>
								<div className="btn-group">
									<span className="btn btn-sm" data-toggle="dropdown">
										<i className="fa fa-paper-plane"></i>
									</span>
									<ul className="dropdown-menu">
										<li><a onClick={() => this.sendMsg(post.user.id)}>盗图 通知</a></li>
									</ul>
								</div>
								
								<span onClick={ this.deletePost } className="post-caption-btn btn btn-sm"><i className="fa fa-trash"></i></span>
							</ButtonToolbar>
						</div>
					</div>
				</div>
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
				{
					this.state.sharePost ?
					<div className="play-modal"  onClick={() => this.setState({sharePost:false})}>
						<div className="play-dialog" onClick={e => e.stopPropagation()}>
							<p>{`#play玩具控app用户美图推荐!# ${post.user.nickname}： ${post.caption ||''} http://www.playalot.cn/post/${post.id}`}</p>
							<div>
								{
									post.photos.map((photo,i) => {
										return <img key={`photo_picker-${i}`} style={{width:80,height:80,margin:'0 5px 5px 0'}} src={photo.url.split('?')[0]} alt=""/>
									})
								}
							</div>
						</div>
					</div>
					: null
				}
	        </Col>
		)
	}
}
