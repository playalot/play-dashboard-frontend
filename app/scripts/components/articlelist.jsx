import React from 'react'
import Reflux from 'reflux'
import {Link} from 'react-router'
import {Row, Button} from 'react-bootstrap'
import Moment from 'moment'
import ArticleStore from '../stores/articlestore'
import ArticleActions from '../actions/articleactions'

var ArticleList = React.createClass({
  mixins: [Reflux.connect(ArticleStore, 'articles')],
  getInitialState: function() {
    return { query: '' };
  },
  fetchMoreArticles: function() {
    ArticleActions.fetchArticleList(this.state.query);
  },
  render: function() {
    if (this.state.articles) {
      return (
        <div className="content">
          <div className="page-header">
            <Link to="/article/edit"><Button bsStyle='success'>发布文章</Button></Link>
          </div>
          <div className="table-responsive">
            <table className="table table-striped">
              <tbody>
                {this.state.articles.map(function(article) {
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
                },this)}
                <tr></tr>
              </tbody>
            </table>
          </div>
          <Row>
            <div className="load-more-btn" onClick={this.fetchMoreArticles}>Load More</div>
          </Row>
        </div>
      )
    } else {
      return (<Row></Row>);
    }
  }
});

module.exports = ArticleList;
