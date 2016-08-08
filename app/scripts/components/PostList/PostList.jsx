import React,{ Component } from 'react'
import { Link } from 'react-router'
import {
	Row, Col, Modal, Form, FormGroup, InputGroup, FormControl, Button
} from 'react-bootstrap'

import PostPanel from '../PostPanel/index.js'
const _ = require('lodash')
// import PostPanel from '../postpanel'

export default class Post extends Component{
	constructor(props) {
	  	super(props)
	  	this.state = {
			filter: '',
			query: '',
			showModal: false,
			showImage: '',
			selectedPost: null
	  	}
	  	this.onChangeQuery = (e) => this.setState({ query: e.target.value })
	  	this.onChangeFilter = (e) => this.setState({ filter: e.target.value })
	  	this.openImage = (img) => this.setState({ showModal: true, showImage: img })
	  	this.openClass = (post) => this.setState({ selectedPost: post })
	  	this.closeClass = () => this.setState({ selectedPost: null })
	  	this.closeImage = () => this.setState({ showModal: false })

	  	this.setPostClassification = (pid,cid) => this._setPostClassification(pid,cid)
	  	this.removePostClassification = (pid,c) => this._removePostClassification(pid,c)

	  	this.search = this._search.bind(this)
	}
	componentWillMount() {
		this.search()
		this.props.fetchTagClass()
	}
	_setPostClassification(pid,cid) {
		this.state.selectedPost.cls.push(cid)
		this.props.setPostClassification(pid,cid)
	}
	_removePostClassification(pid,c) {
		let index = this.state.selectedPost.cls.indexOf(c)
		index !== -1 ? this.state.selectedPost.cls.splice(index,1) : null
		this.props.removePostClassification(pid,c)
	}
	_search() {
		this.props.fetchPost(this.state.filter,this.state.query.trim())
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
				               		this.state.selectedPost.cls.map(function(c){
					                 	return (
					                 		<span key={'t_c_m_'+c} 
					                 		onClick={ () => this.removePostClassification( this.state.selectedPost.id, c) }
					                 		className="label label-warning label-margin" >{_.isEmpty(this.props.classifications) ? c : this.props.classifications[c].name}</span>);
					               	}, this)
				               	}
			             	</div>
			             	<strong>全部类别</strong>
				            <div>
					            {
					             	cls.map((c,key) => {
					             		return (
					             			<span key={'c_m_'+key} 
					             			className='label label-info label-margin' 
					             			bsStyle='success' 
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
	            <Form inline>
	              <FormGroup>
	                <Col smOffset={2} style={{marginRight: '25px'}}>
	                  <Link to="/video/edit"><Button bsStyle='success'>发布视频</Button></Link>
	                </Col>
	              </FormGroup>
	              <FormGroup>
	                <FormControl componentClass="select" placeholder="select" value={this.state.filter} onChange={this.onChangeFilter}>
	                  <option value="">全部</option>
	                  <option value="isRec">推荐</option>
	                  <option value="isR18">R18</option>
	                  <option value="isBlk">屏蔽</option>
	                </FormControl>
	              </FormGroup>
	              <FormGroup>
	                <InputGroup>
	                  <FormControl type="text" placeholder='Search by Tag' value={this.state.query} onChange={this.onChangeQuery} />
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
	            	this.props.posts.map(function (post) {
		              return (
		                <PostPanel key={'p_'+post.id} post={post} openImage={this.openImage} openClass={this.openClass}/>
		              );
		            }, this):null

	          			
	          	}
	    
	          </Row>
	          <Row>
	            <div className="load-more-btn" onClick={this.search}>Load More</div>
	          </Row>
	          <div>
	            <Modal show={this.state.showModal} onHide={this.closeImage}>
	              <Modal.Body>
	                <img className="image-modal" src={this.state.showImage}/>
	              </Modal.Body>
	            </Modal>
	          </div>
	          {modal}
	        </div>
		)
	}
}