import React,{ Component } from 'react'
import { Link } from 'react-router'
import {
	Row, Col, Modal, Form, FormGroup, InputGroup, FormControl, Button
} from 'react-bootstrap'
const _ = require('lodash')
import ReactPaginate from 'react-paginate'
import PostPanel from '../PostPanel/index'

export default class Post extends Component{
	constructor(props) {
	  	super(props)
	  	this.state = {
			filter: '',
			query: '',
			showModal: false,
			showImage: '',
			selectedPost: null,
			photos:[],
			imageIndex:0,
	  	}
	  	this.onChangeQuery = (e) => this.setState({ query: e.target.value })
	  	this.onChangeFilter = (e) => this.setState({ filter: e.target.value })
	  	this.openClass = (post) => this.setState({ selectedPost: post })
	  	this.closeClass = () => this.setState({ selectedPost: null })
	  	this.openImage = (photos,i) => this.setState({ showModal: true, showImage: photos[i]['url'],photos,imageIndex:i })
	  	this.closeImage = () => this.setState({ showModal: false,photos:[] })
	  	this.changeImage = (num) => {
	  		let { photos, imageIndex } = this.state
	  		imageIndex = imageIndex+num+photos.length
	  		let showImage = photos[imageIndex%photos.length]['url']
	  		this.setState({showImage,imageIndex})
	  	}

	  	this.setPostClassification = (pid,cid) => this._setPostClassification(pid,cid)
	  	this.removePostClassification = (pid,c) => this._removePostClassification(pid,c)

	  	this.search = this._search.bind(this)
	  	this.goPage = this._goPage.bind(this)
	}
	componentWillMount() {
		if(!this.props.classLoaded){
			this.props.fetchTagClass()
		}
		const { page,filter,query } = this.props
		if(page) {
			this.context.router.push(`/post?page=${page}`)
			this.setState({filter,query})
		}else{
			this.props.getPost(this.props.location.query.page)
		}
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
	_search() {
		this.context.router.push(`/post?page=0`)
		this.props.getPostBy(this.state.filter,this.state.query.trim())
	}
	_goPage(page) {
		this.context.router.push(`/post?page=${page}`)
		this.props.getPost(page)
	}
	render() {
		let modal = (<div></div>)
	    if (this.state.selectedPost !== null) {
	      	let cls = _.filter(this.props.classifications, function(c){
	        	return this.state.selectedPost.cls.indexOf(c.id) === -1
	      	}.bind(this))
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
			<div className="content">
	          <div className="page-header">
	            <Form inline onSubmit={(e) => e.preventDefault()}>
	              <FormGroup>
	                <div className="btn-group">
					  <button type="button" className="btn btn-default"><Link to="/video/edit">发布视频</Link></button>
					  <button onClick={() => this.props.getUnCls()} type="button" className="btn btn-default">未定义标签</button>
					</div>
	              </FormGroup>
				  {' '}
	              <FormGroup>
	                <FormControl componentClass="select" placeholder="select" value={this.state.filter} onChange={this.onChangeFilter}>
	                  <option value="">全部</option>
	                  <option value="isRec">推荐</option>
	                  <option value="isR18">R18</option>
	                  <option value="isBlk">屏蔽</option>
	                </FormControl>
	              </FormGroup>
				  {' '}
	              <FormGroup>
	                <InputGroup>
	                  <FormControl type="text" placeholder="Search by Tag" value={this.state.query} onKeyDown={e => e.keyCode === 13 && this.search()}  onChange={this.onChangeQuery} />
	                  <InputGroup.Button>
	                    <Button onClick={this.search}>搜索</Button>
	                  </InputGroup.Button>
	                </InputGroup>
	              </FormGroup>
	            </Form>
	          </div>
	          <Row>
	          	{
	          		this.props.posts ?
	            	this.props.posts.map(post => {
		              	return (
		                  <PostPanel key={'p_'+post.id} post={post} openImage={this.openImage} openClass={this.openClass}/>
		              	)
		            })
		            :null
	          	}
	          </Row>
	          <Row style={{textAlign:'center'}}>
	          	<ReactPaginate 
	          		previousLabel={<span>&laquo;</span>}
					nextLabel={<span>&raquo;</span>}
					breakLabel={<span>...</span>}
					breakClassName={"break-me"}
					pageNum={this.props.totalPages}
					marginPagesDisplayed={2}
					pageRangeDisplayed={5}
					clickCallback={obj => this.goPage(obj.selected)}
					containerClassName={"pagination"}
					subContainerClassName={"pages pagination"}
					forceSelected={this.props.location.query.page ? parseInt(this.props.location.query.page) : 0}
					activeClassName={"active"} />
	          </Row>
	          <div>
	            <Modal show={this.state.showModal} onHide={this.closeImage}>
	              <Modal.Body>
	              	<span className="image-modal-left" onClick={() => this.changeImage(-1)}><i className="glyphicon glyphicon-chevron-left"></i></span>
	                <img className="image-modal" onClick={this.closeImage} src={this.state.showImage}/>
	              	<span className="image-modal-right" onClick={() => this.changeImage(1)}><i className="glyphicon glyphicon-chevron-right"></i></span>
	              </Modal.Body>
	            </Modal>
	          </div>
	          {modal}
	        </div>
		)
	}
}

Post.contextTypes = {
  	router : React.PropTypes.object
}
