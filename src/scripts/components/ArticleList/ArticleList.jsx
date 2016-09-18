import React,{Component} from 'react'
import {Link} from 'react-router'
import {Row, Button} from 'react-bootstrap'
import Moment from 'moment'
import Request from 'superagent'


export default class ArticleList extends Component{
	constructor(props) {
	  	super(props);
	
	  	this.state = {};
	  	this.fetchMoreArticle = () => this.props.fetchArticleMore()
	  	this.togglePub = (id) => this.props.togglePub(id)
	  	this.deleteArticle = this._deleteArticle.bind(this)
	  	this.toggleRecommend = (id) => this.props.toggleRecommend(id)
	}
	componentWillMount() {
		if(!this.props.loaded){
			this.props.fetchArticle()
		}
	}
	_deleteArticle(id) {
		if (confirm('删除这个文章?')) {
			this.props.deleteArticle(id)
		}
	}
	render() {
		return(
			<div className="content">
	          <div className="page-header">
	            <Link to="/article/edit"><Button bsStyle='success'>发布文章</Button></Link>
	          </div>
	          <div className="table-responsive">
	            <table className="table table-striped">
	              <tbody>
	                {this.props.articles.map((article) => {
	                	let isPubClass = article.isPub === true ? 'btn bg-orange btn-sm' : 'btn btn-sm'
	                	let recommendClass = article.isRec === true ? 'btn bg-orange btn-sm' : 'btn btn-sm'
	                  return (
	                    <tr key={article.id}>
	                      <td><img style={{width:'70px'}} src={article.cover} className="img-thumbnail"/></td>
	                      <td>{article.title}</td>
	                      <td>{article.author}</td>
	                      <td>{article.category}</td>
	                      <td>
	                      	{
	                      		article.tags.map((tag,index) => {
	                      			return (<span className="label label-info label-margin" key={`tag_${index}`}>{tag}</span>)
	                      		})
	                      	}
	                      </td>
	                      <td>{article.counts.views} views</td>
	                      <td>{Moment.unix(article.created / 1000).fromNow()}</td>
	                      <td><Link to={`/article/edit/${article.id}` }><span style={{color:'#333'}} className="btn btn-sm"><i className="fa fa-edit"></i></span></Link></td>
	                      <td><span style={{color:'#333'}} onClick={() => this.toggleRecommend(article.id)} className={recommendClass}><i className="fa fa-thumbs-o-up"></i></span></td>
	                      <td><span style={{color:'#333'}} onClick={() => this.togglePub(article.id)} className={isPubClass}><i className="fa fa-check"></i></span></td>
	                      <td><span style={{color:'#333'}} onClick={() => this.deleteArticle(article.id)} className="btn btn-sm"><i className="fa fa-trash"></i></span></td>
	                      <td><a target="_blank" href={`http://www.playalot.cn/article/${article.id}.html`}>预览</a></td>
	                    </tr>
	                  )
	                })}
	                <tr></tr>
	              </tbody>
	            </table>
	          </div>
	          <Row>
	            <div className="load-more-btn" onClick={this.fetchMoreArticle}>Load More</div>
	          </Row>
	        </div>
		)
	}
}