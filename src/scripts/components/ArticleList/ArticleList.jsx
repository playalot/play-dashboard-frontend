import React,{Component} from 'react'
import {Link} from 'react-router'
import {Row, Button} from 'react-bootstrap'
import Moment from 'moment'


export default class ArticleList extends Component{
	constructor(props) {
	  	super(props);
	
	  	this.state = {};
	  	this.fetchMoreArticle = () => this.props.fetchArticleMore()
	}
	componentWillMount() {
		if(!this.props.loaded){
			this.props.fetchArticle()
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
	                  return (
	                    <tr key={article.id}>
	                      <td><Link to={'/article/edit?id='+article.id }><img style={{width:'70px'}} src={article.cover} className="img-thumbnail"/></Link></td>
	                      <td>{article.title}</td>
	                      <td>{article.author}</td>
	                      <td>{article.category}</td>
	                      <td>{article.tags.join()}</td>
	                      <td>{article.counts.views} views</td>
	                      <td>{Moment.unix(article.created / 1000).fromNow()}</td>
	                      <td><a href={'/article/'+article.id+'/preview'}>预览</a></td>
	                    </tr>
	                  );
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