import React,{ Component } from 'react'
import { Link } from 'react-router'
import {
	Col, ButtonToolbar,
} from 'react-bootstrap'
import Moment from 'moment'
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
	render() {
		const { post } = this.props
		let isRecClass = post.isRec === true ? 'btn bg-orange btn-sm' : 'btn btn-sm'
		let isBlkClass = post.isBlk === true ? 'btn bg-orange btn-sm' : 'btn btn-sm'
		let isR18Class = post.isR18 === true ? 'btn bg-orange btn-sm' : 'btn btn-sm'
	    let skuDiv = ''
	    let contentDiv = ''
	    if (post.toy !== undefined && post.toy !== null) {
	      	skuDiv  = (
	      		<span className='label label-success label-margin'>
		      		<Link to={'/toy/'+post.toy.id+'/edit'}>{post.toy.name.substring(0, 25)+'...'}
		      		</Link>
		      		<i className="fa fa-close" onClick={ () => this.removeToy()}></i>
	      		</span>
	      	)
	    }
	    if (post.video !== null) {
	      	contentDiv = (
		        <div className="box-body no-padding" style={{paddingBottom:'2px !important'}}>
		          	<div >
		            	<video className="" src={post.video.url} controls></video>
		          	</div>
		        </div>
	        )
	    }
	    if (post.video === null) {
	      	contentDiv = (
	      		<div className="box-body no-padding" style={{paddingBottom:'2px !important'}}>
			        <div>
			          	<ImgLoad src={post.photos[0].url640} onClick={() => this.props.openImage(post.photos,0) } />
			        </div>
			        {
			        	post.photos.length === 1 ? null :
			        	<PanelPosts>
				        	{
				        		post.photos.slice(1, post.photos.length).map((photo, i) => {
				            		return (
			            				<img key={'p_'+post.id+'_'+i} className="img-responsive panel-photos-small"
			            					src={photo.url320} alt="Photo"
			            					onClick={() => this.props.openImage(post.photos,i+1) } />
			            			)
				          		})
				        	}
				        </PanelPosts>
			        }
			        
		      	</div>
	      	)
	    }
		return(
			<Col className="col" style={{padding:10}} xs={12} sm={4} lg={3}>
	          <div className="box box-solid">
	            <div className="box-header with-border">
	              <div className="user-block">
	                <Link to={'/user/'+post.user.id}>
	                  <img className="img-circle" src={ post.user.avatar } alt="User Image" />
	                </Link>
	                <span className="username"><Link to={'/user/'+post.user.id}>{ post.user.nickname }</Link></span>
	                <span className="description">{ Moment.unix(post.created / 1000).fromNow() }</span>
	              </div>
	            </div>
	            {contentDiv}
	            <div className="box-body no-top-padding">
	              <p style={{color:"#999"}}>{post.caption}</p>
	            </div>
	            <div className="box-body no-top-padding">
	              {post.tags.map(t => <span key={'p_'+post.id+'_t_'+t.id} className='label label-info label-margin'><Link to={'/tag/'+t.id}>{t.text}</Link>{" "}<i className="fa fa-close" onClick={ () => this.removeTag(t.id)}></i></span>)}
	              {skuDiv}
	            </div>
	            <div className="box-body no-top-padding">
	              {post.cls.map(c => <span key={'p_'+post.id+'_c_'+c} className="label label-warning label-margin" >{_.isEmpty(this.props.classifications) ? c : this.props.classifications[c].name}</span>)}
	            </div>
	            <div className="box-footer">
	              <ButtonToolbar className="pull-right">
	                <span onClick={ this.addToy } className="btn btn-sm"><i className="fa fa-plus"></i></span>
	                <span onClick={ this.addTag } className="btn btn-sm"><i className="fa fa-tag"></i></span>
	                <span onClick={ this.props.openClass.bind(null, post) } className="btn btn-sm"><i className="fa fa-th-large"></i></span>
	                <span onClick={ () => this.props.removeAllClassification(post.id) } className="btn btn-sm"><i className="fa fa-chain-broken"></i></span>
	                <span onClick={ this.toggleR18 } className={isR18Class}><i className="fa fa-venus-mars"></i></span>
	                <span onClick={ this.toggleBlock } className={isBlkClass}><i className="fa fa-eye-slash"></i></span>
	                <span onClick={ this.toggleRecommend } className={isRecClass}><i className="fa fa-thumbs-o-up"></i></span>
	                <span onClick={ this.deletePost } className="post-caption-btn btn btn-sm"><i className="fa fa-trash"></i></span>
	              </ButtonToolbar>
	            </div>
	          </div>
	        </Col>
		)
	}
}

class PanelPosts extends Component {
	constructor(props) {
	  	super(props)
	  	this.state = {}
	}
	componentDidMount() {
		this.setState({
			height:this.pp.offsetWidth / 8
		})
	}
	render() {
		return(
			<div className="play-panel-photos" ref={pp => this.pp = pp} style={{height:this.state.height}}>
				{this.props.children}
			</div>

		)
	}
}

class ImgLoad extends Component{
	constructor(props) {
	  	super(props)
	  	this.state = {
	  		// height:0,
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
	componentDidMount(){
		// this.setState({
		// 	height:this.m.offsetWidth
		// })
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

		// if(this.state.loaded){
		// 	return(
		// 		<img className="img-responsive" src={this.props.src} alt="Photo" onClick={this.props.onClick} />
		// 	)
		// }else{
		// 	return(
		// 		<div ref={(m) => this.m = m} style={{width:'100%',height:this.state.height,background:'rgb(238,237,235)'}}></div>
		// 	)
		// }
		
	}
}