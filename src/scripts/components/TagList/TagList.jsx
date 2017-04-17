import React,{ Component } from 'react'
import PropTypes from 'prop-types'
const _ = require('lodash')
import {
	Col, Row, Modal, Form, FormGroup, InputGroup, FormControl, Button, ButtonToolbar
} from 'react-bootstrap'
import { Link } from 'react-router'
import CDN from '../../widgets/cdn'
import ReactPaginate from 'react-paginate'
export default class TagList extends Component{
	constructor(props) {
	  	super(props)
	  	this.state = {
	  		query:'',
	  		type:'',
	  		selectedTag: null,
	  	}
	  	this.onChangeType = (e) => this.setState({ type:e.target.value })

	  	this.setTagClassification = (tid,cid) => this._setTagClassification(tid,cid)
	  	this.removeTagClassification = (tid,c) => this._removeTagClassification(tid,c)
	  	this.openTag = (tag) => this.setState({ selectedTag: tag })
	  	this.closeTag = (tag) => this.setState({ selectedTag: null })

	  	this.recommendTag = (tid) => this._recommendTag(tid)
	  	this.deleteTag = (tid) => this._deleteTag(tid)
	    this.goPage = this._goPage.bind(this)
	    this.search = this._search.bind(this)
	}
	componentWillMount() {
		if(!this.props.classLoaded){
			this.props.fetchTagClass()
		}
		const { page,query,type } = this.props
		if(typeof page === 'number') {
			this.context.router.push(`/tag?page=${page}`)
			this.setState({type,query})
		}else{
			this.props.getTag(this.props.location.query.page)
		}
	}
	_setTagClassification(tid,cid) {
		this.state.selectedTag.cls.push(cid)
		this.props.setClassification(tid,cid)
	}
	_removeTagClassification(tid,c) {
		let index = this.state.selectedTag.cls.indexOf(c)
		index !== -1 ? this.state.selectedTag.cls.splice(index,1) : null
		this.props.removeClassification(tid,c)
	}
	_recommendTag(tid) {
		if (confirm('推荐这个标签?')) {
			this.props.recommendTag(tid)
    	}
	}
	_deleteTag(tid) {
		if (confirm('删除这个标签?')) {
			this.props.deleteTag(tid)
    	}
	}
	_goPage(page) {
		this.context.router.push(`/tag?page=${page}`)
		this.props.getTag(page)
	}
	_search() {
		this.context.router.push(`/tag?page=0`)
		this.props.getTagBy(this.state.type,this.state.query.trim())
	}
	render() {
		let modal = (<div></div>)
    	if (this.state.selectedTag !== null) {
	      	let cls = _.filter(this.props.classifications, function(c){
	        	return this.state.selectedTag.cls.indexOf(c.id) === -1
	      	}.bind(this))
	      	modal = (
		        <div>
		         	<Modal className='modal-container' animation={false} show={true} onHide={this.closeTag}>
			           <Modal.Body>
			             	<strong>已选类别</strong>
			             	<div>
				               	{
				               		this.state.selectedTag.cls.map(function(c){
					                 	return (
					                 		<span key={'t_c_m_'+c}
					                 		onClick={ () => this.removeTagClassification( this.state.selectedTag.id, c) }
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
					             			onClick={() => this.setTagClassification(this.state.selectedTag.id, c.id) }>{c.name}</span>
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
		                <FormControl componentClass="select" placeholder="select" value={this.state.type} onChange={this.onChangeType}>
							<option value="">全部</option>
							<option value="company">品牌</option>
							<option value="series">系列</option>
							<option value="topic">话题</option>
							<option value="person">人物</option>
						</FormControl>
		              </FormGroup>
					  {' '}
		              <FormGroup style={{marginLeft:10}}>
		                <InputGroup>
		                  <FormControl type="text" placeholder='输入标签关键字' onKeyDown={e => e.keyCode === 13 && this.search()} value={this.state.query} onChange={(e) => this.setState({query:e.target.value})} />
		                  <InputGroup.Button>
		                    <Button onClick={this.search}>搜索</Button>
		                  </InputGroup.Button>
		                </InputGroup>
		              </FormGroup>
		            </Form>  
		    	</div>
		        <Row>
		          	{
		          		this.props.tags.map( (tag) => {
				            return (
				              <Col xs={6} sm={3} lg={3} key={'u_'+tag.id}>
				                <div className="box box-widget">
				                  <div className="box-header with-border">
				                    <h3 className="box-title" style={{display:"block"}}>{tag.text}</h3>
				                    <span className="tag-info"> {tag.counts.posts + ' 照片 ' + tag.counts.follows + ' 关注'} </span>
				                  </div>
				                  <div className="box-body">
				                    <img src={tag.image?CDN.show(tag.image):''} className="img-responsive"/>
				                    <p>
				                      {tag.cls.map((c) => {
				                        return (<span key={'t_c_'+tag.id+'_'+c} className="label label-warning label-margin" >{_.isEmpty(this.props.classifications) ? c : this.props.classifications[c].name}</span>);
				                      })}
				                    </p>
				                  </div>
				                  <div className="box-footer">
				                    <ButtonToolbar className="pull-right">
				                      <Link to={'/tag/'+tag.id}><span className="btn btn-sm"><i className="fa fa-edit"></i></span></Link>
				                      <span className="btn btn-sm" onClick={ () => this.recommendTag(tag.id)}><i className="fa fa-bookmark-o"></i></span>
				                      <span className="btn btn-sm" onClick={ () => this.openTag(tag)}><i className="fa fa-th-large"></i></span>
				                      <span className="btn btn-sm" onClick={ () => this.deleteTag(tag.id) }><i className="fa fa-trash"></i></span>
				                    </ButtonToolbar>
				                  </div>
				                </div>
				              </Col>
				            )
			          	})
		      		}
		        </Row>
		        <Row style={{textAlign:'center'}}>
		          <ReactPaginate
	          		previousLabel={<span>&laquo;</span>}
					nextLabel={<span>&raquo;</span>}
					breakLabel={<span>...</span>}
					breakClassName={"break-me"}
					pageCount={this.props.totalPages}
					marginPagesDisplayed={2}
					pageRangeDisplayed={5}
					onPageChange={obj => this.goPage(obj.selected)}
					containerClassName={"pagination"}
					subContainerClassName={"pages pagination"}
					forcePage={this.props.location.query.page ? parseInt(this.props.location.query.page) : 0}
					activeClassName={"active"} />
		        </Row>
		        {modal}
	        </div>
		)
	}
}


TagList.contextTypes = {
  	router : PropTypes.object
}
