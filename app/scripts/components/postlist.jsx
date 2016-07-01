var React = require('react');
var Reflux = require('reflux');
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var Link = require('react-router').Link;
var Modal = require('react-bootstrap').Modal;
var Form = require('react-bootstrap').Form;
var FormGroup = require('react-bootstrap').FormGroup;
var InputGroup = require('react-bootstrap').InputGroup;
var FormControl = require('react-bootstrap').FormControl;
var Button = require('react-bootstrap').Button;
var PostStore = require('../stores/poststore');
var TagClassStore = require('../stores/tagclassstore');
var PostActions = require('../actions/postactions');
var PostPanel = require('./postpanel');

var PostList = React.createClass({
  mixins: [Reflux.connect(PostStore, 'postlist'), Reflux.connect(TagClassStore, 'classifications')],
  getInitialState: function() {
    return {
      filter: '',
      query: '',
      showModal: false,
      showImage: '',
      selectedPost: null
    };
  },
  onChangeQuery: function(e) {
    this.setState({query: e.target.value});
  },
  onChangeFilter: function(e) {
    this.setState({filter: e.target.value});
  },
  closeImage: function() {
    this.setState({ showModal: false });
  },
  openImage: function(img) {
    this.setState({ showModal: true, showImage: img });
  },
  openClass: function(post) {
    this.setState({ selectedPost: post });
  },
  closeClass: function() {
    this.setState({ selectedPost: null });
  },
  setPostClassification: function(pid, cid) {
    PostActions.setPostClassification(pid, cid);
    return false;
  },
  removePostClassification: function(pid, cid) {
    PostActions.removePostClassification(pid, cid);
    return false;
  },
  fetchMorePosts: function() {
    PostActions.fetchPostList(this.state.filter, this.state.query.trim());
  },
  search: function(e) {
    PostActions.fetchPostList(this.state.filter, this.state.query.trim());
    e.preventDefault();
  },
  render: function() {
    var modal = (<div></div>);
    if (this.state.selectedPost !== null) {
      var cls = _.filter(this.state.classifications, function(c){
        return this.state.selectedPost.cls.indexOf(c.id) === -1;
      }.bind(this));
      modal = (
        <div>
         <Modal className='modal-container' animation={false} show={true} onHide={this.closeClass}>
           <Modal.Body>
             <strong>已选类别</strong>
             <div>
               {this.state.selectedPost.cls.map(function(c){
                 return (<span key={'t_c_m_'+c} className="label label-warning label-margin" onClick={this.removePostClassification.bind(this, this.state.selectedPost.id, c)}>{_.isEmpty(this.state.classifications) ? c : this.state.classifications[c].name}</span>);
               }, this)}
             </div>
             <strong>全部类别</strong>
             <div>
             {_.map(cls, function (c, key) {
                return (<span key={'c_m_'+key} className='label label-info label-margin' bsStyle='success' onClick={this.setPostClassification.bind(this, this.state.selectedPost.id, c.id)}>{c.name}</span>);
             }.bind(this))}
             </div>
           </Modal.Body>
         </Modal>
       </div>
     );
    }
    if (this.state.postlist) {
      return (
        <div className="content">
          <div className="page-header">
            <Form inline onSubmit={this.search}>
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
            {this.state.postlist.map(function (post) {
              return (
                <PostPanel key={'p_'+post.id} post={post} openImage={this.openImage} openClass={this.openClass}/>
              );
            }, this)}
          </Row>
          <Row>
            <div className="load-more-btn" onClick={this.fetchMorePosts}>Load More</div>
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
      );
    } else {
      return (<Row></Row>);
    }
  }
});

module.exports = PostList;
