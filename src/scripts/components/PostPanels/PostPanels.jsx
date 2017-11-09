import React,{ Component } from 'react'
import Masonry from 'react-masonry-component'
import Lightbox from 'react-images'
import { Modal } from 'react-bootstrap'
import PostPanel from '../PostPanel'

import Request from 'superagent'

import { dateFormat } from '../../widgets'

const _ = require('lodash')
export default class extends Component {
	constructor(props) {
		super(props)
		this.state = {
			selectedPost: null,
			lightboxIsOpen:false,
			images:[],
			currentImage:0,
			currentPostId:null,
			commentContent:'',
			commentsPost:null
		}

		this.openImage = (images,currentImage) => this.setState({ lightboxIsOpen: true,images,currentImage})
		this.closeLightbox = () => this.setState({lightboxIsOpen:false,images:[]})

		this.openClass = (post) => this.setState({ selectedPost: post })
		this.closeClass = () => this.setState({ selectedPost: null })

		this.setPostClassification = (pid,cid) => this._setPostClassification(pid,cid)
		this.removePostClassification = (pid,c) => this._removePostClassification(pid,c)
		this.resize = () => { this.masonry.layout() }

		this.commentPost = (currentPostId) => { 
			this.setState({
				currentPostId
			},() => {
				$('#commentModal').modal('show')
			})
		}
		this.comment = this._comment.bind(this)
		this.showComments = this._showComments.bind(this)
	}
	componentWillMount() {
		if(!this.props.classLoaded){
			this.props.fetchTagClass()
		}
		// $(window).on('resize',this.resize)
	}
	componentDidMount() {
		$('#commentModal').on('hidden.bs.modal', (e) => {
			this.setState({
				currentPostId:null,
				commentContent:''
			})
		})
		$('#commentsModal').on('hidden.bs.modal', (e) => {
			this.setState({
				commentsPost:null,
			})
		})
	}
	_setPostClassification(pid,cid) {
		this.state.selectedPost.cls.push(cid)
		this.props.setClassification(pid,cid)
	}
	_removePostClassification(pid,c) {
		let index = this.state.selectedPost.cls.indexOf(c)
		index !== -1 ? this.state.selectedPost.cls.splice(index,1) : null
		this.props.removeClassification(pid,c)
	}
	_comment() {
		Request.post(`/api/post/${this.state.currentPostId}/comment`)
		.send({
			content:this.state.commentContent
		})
		.end((err,res) => {
			if(err) {
				Toastr.error(`评论失败。`)
			}else{
				Toastr.success(`评论成功～`)
				$('#commentModal').modal('hide')
			}
		})
	}
	_showComments(commentsPost) {
		this.setState({ commentsPost },() => {
			$('#commentsModal').modal('show')
		})
	}
	render() {
		let modal = null
		if (this.state.selectedPost !== null) {
			let cls = _.filter(this.props.classifications, (c) => {
				return this.state.selectedPost.cls.indexOf(c.id) === -1
			})
			modal = (
				<div>
					<Modal className='modal-container' animation={false} show={true} onHide={this.closeClass}>
						<Modal.Body>
							<strong>已选类别</strong>
							<div>
									{
										this.state.selectedPost.cls.map((c) => {
											return (
												<span key={'t_c_m_'+c}
												onClick={ () => this.removePostClassification( this.state.selectedPost.id, c) }
												className="m-badge m-badge--rounded m-badge--warning m-badge--wide m--margin-rt-3 text-white" >{_.isEmpty(this.props.classifications) ? c : this.props.classifications[c].name}</span>);
										})
									}
							</div>
							<strong>全部类别</strong>
							<div>
								{
									cls.map((c,key) => {
										return (
											<span key={'c_m_'+key}
											className='m-badge m-badge--rounded m-badge--warning m-badge--wide m--margin-rt-3 text-white'
											onClick={() => this.setPostClassification(this.state.selectedPost.id, c.id) }>{c.name}</span>
										)
									})
								}
							</div>
						</Modal.Body>
					</Modal>
				</div>
			)
		}
		return(
			<div className="w-100">
				<Masonry ref={(c) => this.masonry = this.masonry || c.masonry} options={{transitionDuration: 0}}>
					{
						this.props.posts ?
						this.props.posts.map(post => {
							return (
								<PostPanel key={`post_${post.id}`} post={post} showComments={this.showComments} commentPost={this.commentPost} openImage={this.openImage} openClass={this.openClass}/>
							)
						})
						:null
					}
				</Masonry>
				{modal}
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
				<div className="modal fade" id="commentModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
					<div className="modal-dialog" role="document">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title" id="exampleModalLabel">评论内容</h5>
									<button type="button" className="close" data-dismiss="modal" aria-label="Close">
									<span aria-hidden="true">&times;</span>
								</button>
							</div>
							<div className="modal-body">
								<textarea value={this.state.commentContent} onChange={(e) => this.setState({commentContent:e.target.value})} className="w-100" name="" id="" cols="30" rows="5"></textarea>
							</div>
							<div className="modal-footer">
								<button onClick={this.comment} type="button" className="btn btn-outline-primary">发送</button>
							</div>
						</div>
					</div>
				</div>
				<div className="modal fade" id="commentsModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
					{
						this.state.commentsPost ?
						<div className="modal-dialog" role="document">
							<div className="modal-content">
								<div className="modal-header">
									<h5 className="modal-title" id="exampleModalLabel">玩家评论</h5>
										<button type="button" className="close" data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<div className="modal-body">
									{
										this.state.commentsPost.comments.map((comment,i) => {
											return(
												<div key={comment.id} className="d-flex" style={{borderBottom:'1px solid #eee'}}>
													<img src={comment.user.avatar} className="avatar45" alt="avatar"/>
													<div className="d-flex flex-column px-3" style={{flex:1}}>
														<span className="text-primary">{comment.user.nickname}</span>
														<span className="text-muted">{dateFormat(comment.created)}</span>
														<span className="mt-2">{comment.text}</span>
													</div>
												</div>
											)
										})
									}
								</div>
							</div>
						</div>
						:null
					}
				</div>
			</div>
		)
	}
}