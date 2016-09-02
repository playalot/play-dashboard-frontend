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
	}
	componentWillMount() {
		if(!this.props.loaded){
			this.props.fetchArticle()
		}
	}
	delete() {
		Request
            .post(`/api/page/57c92668170000bc07c7ba63/publish`)
            .send({
            	public:false
            })
            .end(function(err, res) {
            	alert('ok')
            })
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
	                  return (
	                    <tr key={article.id}>
	                      <td><img style={{width:'70px'}} src={article.cover} className="img-thumbnail"/></td>
	                      <td>{article.title}</td>
	                      <td>{article.author}</td>
	                      <td>{article.category}</td>
	                      <td>{article.tags.join()}</td>
	                      <td>{article.counts.views} views</td>
	                      <td>{Moment.unix(article.created / 1000).fromNow()}</td>
	                      <td><Link to={`/article/edit/${article.id}` }><span style={{color:'#333'}} className="btn btn-sm"><i className="fa fa-edit"></i></span></Link></td>
	                      <td><span style={{color:'#333'}} onClick={() => this.togglePub(article.id)} className={isPubClass}><i className="fa fa-check"></i></span></td>
	                      <td><a target="_blank" href={`http://www.playalot.cn/article/${article.id}.html`}>预览</a></td>
	                    </tr>
	                  )
	                })}
	                <tr></tr>
	              </tbody>
	            </table>
	          </div>
	          <Row>
	          	<div onClick={this.delete}>delte</div>
	            <div className="load-more-btn" onClick={this.fetchMoreArticle}>Load More</div>
	          </Row>
	        </div>
		)
	}
}