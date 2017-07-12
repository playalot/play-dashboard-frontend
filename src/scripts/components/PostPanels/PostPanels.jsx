import React,{ Component } from 'react'
import Masonry from 'react-masonry-component'
import Lightbox from 'react-images'
import { Modal } from 'react-bootstrap'
import PostPanel from '../PostPanel'

const _ = require('lodash')
export default class extends Component {
	constructor(props) {
		super(props)
		this.state = {
			selectedPost: null,
			lightboxIsOpen:false,
			images:[],
			currentImage:0,
		}

		this.openImage = (images,currentImage) => this.setState({ lightboxIsOpen: true,images,currentImage})
		this.closeLightbox = () => this.setState({lightboxIsOpen:false,images:[]})

		this.openClass = (post) => this.setState({ selectedPost: post })
		this.closeClass = () => this.setState({ selectedPost: null })

		this.setPostClassification = (pid,cid) => this._setPostClassification(pid,cid)
		this.removePostClassification = (pid,c) => this._removePostClassification(pid,c)
		this.resize = () => { this.masonry.layout() }
	}
	componentWillMount() {
		if(!this.props.classLoaded){
			this.props.fetchTagClass()
		}
		$(window).on('resize',this.resize)
	}
	componentWillUnmount() {
		$(window).off('resize',this.resize)
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
												className="label label-warning label-margin" >{_.isEmpty(this.props.classifications) ? c : this.props.classifications[c].name}</span>);
										})
									}
							</div>
							<strong>全部类别</strong>
							<div>
								{
									cls.map((c,key) => {
										return (
											<span key={'c_m_'+key}
											className='label label-info label-margin'
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
			<div>
				<Masonry ref={(c) => this.masonry = this.masonry || c.masonry} options={{transitionDuration: 0}}>
					{
						this.props.posts ?
						this.props.posts.map(post => {
							return (
								<PostPanel key={`post_${post.id}`} post={post} openImage={this.openImage} openClass={this.openClass}/>
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
			</div>
		)
	}
}