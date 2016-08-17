import React,{ Component } from 'react'
import { Link } from 'react-router'
import {
	Col, ButtonToolbar, 
} from 'react-bootstrap'
import Moment from 'moment'
const _ = require('lodash')

export default class PostPanel extends Component{
	constructor(props) {
	  	super(props);
	
	  	this.state = {}
	  	this.toggleRecommend = this._toggleRecommend.bind(this)
	  	this.toggleBlock = this._toggleBlock.bind(this)
	  	this.toggleR18 = this._toggleR18.bind(this)
	  	this.addTag = this._addTag.bind(this)
	  	this.removeTag = this._removeTag.bind(this)
	  	this.addSku = this._addSku.bind(this)
	  	this.deletePost = this._deletePost.bind(this)
	}
	componentWillMount() {
	}
	_deletePost() {
		if (confirm('删除这个post?')) {
			this.props.deletePost(this.props.post.id)
		}
	}
	_toggleRecommend() {
		this.props.toggleRecommend(this.props.post.id)
	}
	_toggleBlock() {
		this.props.toggleBlock(this.props.post.id)
	}
	_toggleR18() {
		this.props.toggleR18(this.props.post.id)
	}
	_addSku() {
		let id = prompt('输入玩具ID')
		if (id) {
			this.props.addSku(this.props.post.id,id)
		}
	}
	_addTag() {
		let text = prompt('输入标签')
		if (text) {
			this.props.addTag(this.props.post.id,text)
		}
	}
	_removeTag(id) {
		if (confirm('删除这个标签?')) {
			this.props.removeTag(this.props.post.id,id)
		}
	}
	render() {
		let recommendClass = this.props.post.isRec === true ? 'btn bg-orange btn-sm' : 'btn btn-sm'
		let invisibleClass = this.props.post.isBlk === true ? 'btn bg-orange btn-sm' : 'btn btn-sm'
		let r18Class = this.props.post.isR18 === true ? 'btn bg-orange btn-sm' : 'btn btn-sm'


	    let skuDiv = ''
	    if (this.props.post.toys !== undefined && this.props.post.toys !== null) {
	      	skuDiv  = (
	      		<Link to={'/sku/'+this.props.post.toys.id+'/edit'}>
	      			<span className='label label-success label-margin'>{this.props.post.toys.name.substring(0, 25)+'...'}</span>
	      		</Link>
	      	)
	    }
	    let contentDiv = ''
	    if (this.props.post.video !== null) {
	      	contentDiv = (
		        <div className="box-body no-padding" style={{paddingBottom:'2px !important'}}>
		          	<div >
		            	<video className="" src={this.props.post.video.url} controls></video>
		          	</div>
		        </div>
	        )
	    }
	    if (this.props.post.video === null) {
	      	contentDiv = (
	      		<div className="box-body no-padding" style={{paddingBottom:'2px !important'}}>
			        <div>
			          	<img className="img-responsive" src={this.props.post.photos[0].url} alt="Photo" onClick={ this.props.openImage.bind(null, this.props.post.photos[0].url) } />
			        </div>
			        <div className="panel-photos">
			          	{
			          		this.props.post.photos.slice(1, this.props.post.photos.length).map(function (photo, i) {
			            		return (
			            			<div key={'p_'+this.props.post.id+'_'+i}  className="pull-left">
			            				<img className="img-responsive panel-photos-small" 
			            					src={photo.url} alt="Photo" 
			            					onClick={ this.props.openImage.bind(null, photo.url) } />
			            			</div>)
			          		}, this)
			          	}
			        </div>
		      	</div>
	      	)
	    }
		return(
			<Col className="col" xs={12} sm={3} lg={3} id={this.props.post.id}>
	          <div className="box box-solid">
	            <div className="box-header with-border">
	              <div className="user-block">
	                <Link to={'/user/'+this.props.post.user.id}>
	                  <img className="img-circle" src={ this.props.post.user.avatar } alt="User Image" />
	                </Link>
	                <span className="username"><Link to={'/user/'+this.props.post.user.id}>{ this.props.post.user.nickname }</Link></span>
	                <span className="description">{ Moment.unix(this.props.post.created / 1000).fromNow() }</span>
	              </div>
	            </div>
	            {contentDiv}
	            <div className="box-body no-top-padding">
	              <p style={{color:"#999"}}>{this.props.post.caption}</p>
	            </div>
	            <div className="box-body no-top-padding">
	              {this.props.post.tags.map(function (t) {
	                return (<span key={'p_'+this.props.post.id+'_t_'+t.id} className='label label-info label-margin' bsStyle='success'><Link to={'/tag/'+t.id}>{t.text}</Link>{" "}<i className="fa fa-close" onClick={ () => this.removeTag(t.id)}></i></span>);
	              },this)}
	              {skuDiv}
	            </div>
	            <div className="box-body no-top-padding">
	              {this.props.post.cls.map(function(c){
	                return (<span key={'p_'+this.props.post.id+'_c_'+c} className="label label-warning label-margin" >{_.isEmpty(this.props.classifications) ? c : this.props.classifications[c].name}</span>);
	              }, this)}
	            </div>
	            <div className="box-footer">
	              <ButtonToolbar className="pull-right">
	                <span onClick={ this.addSku } className="btn btn-sm"><i className="fa fa-plus"></i></span>
	                <span onClick={ this.addTag } className="btn btn-sm"><i className="fa fa-tag"></i></span>
	                <span onClick={ this.props.openClass.bind(null, this.props.post) } className="btn btn-sm"><i className="fa fa-th-large"></i></span>
	                <span onClick={ this.toggleR18 } className={r18Class}><i className="fa fa-venus-mars"></i></span>
	                <span onClick={ this.toggleBlock } className={invisibleClass}><i className="fa fa-eye-slash"></i></span>
	                <span onClick={ this.toggleRecommend } className={recommendClass}><i className="fa fa-thumbs-o-up"></i></span>
	                <span onClick={ this.deletePost } className="post-caption-btn btn btn-sm"><i className="fa fa-trash"></i></span>
	              </ButtonToolbar>
	            </div>
	          </div>
	        </Col>
		)
	}
}