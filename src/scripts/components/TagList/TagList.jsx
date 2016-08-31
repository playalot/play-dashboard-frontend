import React,{ Component } from 'react'
const _ = require('lodash')
import {
	Col, Row, Modal, Form, FormGroup, InputGroup, FormControl, Button, ButtonToolbar
} from 'react-bootstrap'
import { Link } from 'react-router'
import CDN from '../../widgets/cdn'
import If from '../../widgets/if'
import Autosuggest from 'react-autosuggest'

function renderSuggestion(suggestion) {
  return (
    <div className="search-item">
  		<img src={suggestion.image} alt=""/>
    	<span className="item-name">{suggestion.id}</span>
    	<span className="item-desc">{suggestion.text}</span>
  	</div>
  );
}
export default class TagList extends Component{
	constructor(props) {
	  	super(props)
	
	  	this.state = {
	  		query:'',
	  		filter:'',
	  		selectedTag: null,
	  		value: ''
	  	}
	  	this.onChangeFilter = (e) => this.setState({ 
	  		query: this.props.classifications[e.target.value].name,
	  		// filter:e.target.value 
	  	})
	  	this.onChangeQuery = (e) => this.setState({query:e.target.value})
	  	this.search = () => this.props.fetchTag(this.state.query)

	  	this.setTagClassification = (tid,cid) => this._setTagClassification(tid,cid)
	  	this.removeTagClassification = (tid,c) => this._removeTagClassification(tid,c)
	  	this.openTag = (tag) => this.setState({ selectedTag: tag })
	  	this.closeTag = (tag) => this.setState({ selectedTag: null })

	  	this.recommendTag = (tid) => this._recommendTag(tid)
	  	this.deleteTag = (tid) => this._deleteTag(tid)

	  	this.stop = (e) => {
	  		if(e.keyCode === 13){
	  			e.preventDefault()
	  			this.search()
	  		}
	  	}
	  	this.onChangeQ = (e,{newValue}) => this.setState({query:newValue})
	    this.onSuggestionsFetchRequested = ({value}) => this.props.fetchSuggestion(value)
	    this.onSuggestionsClearRequested = () => this.props.clearSuggestion()
	    this.onSuggestionSelected = (e,{suggestionValue}) => {
	    	this.search()
	    }
	}
  	renderSuggestion(suggestion) {
	  	return (
		    <div className="search-item">
		  		<img src={suggestion.image} alt=""/>
		    	<span className="item-name">{suggestion.id}</span>
		    	<span className="item-desc">{suggestion.text}</span>
		  	</div>
	  	)
	}
  	getSuggestionValue(suggestion) {
  		return suggestion.text;     
  	}
	componentWillMount() {
		this.props.fetchTag(this.state.query)
		if(!this.props.classLoaded){
			this.props.fetchTagClass()
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
	render() {
	    const inputProps = {
	      placeholder: 'Type a keyword',
	      value:this.state.query,
	      onChange: this.onChangeQ
	    }
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
	                <Autosuggest
				        suggestions={this.props.suggestions}
				        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
				        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
				        onSuggestionSelected={this.onSuggestionSelected}
				        getSuggestionValue={this.getSuggestionValue}
				        renderSuggestion={this.renderSuggestion}
				        focusFirstSuggestion={true}
				        inputProps={inputProps} />
	                <Button onClick={this.search}>搜索</Button>
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
		        <Row>
		          <div className="load-more-btn" onClick={this.search}>Load More</div>
		        </Row>
		        {modal}
	        </div>
		)
	}
}