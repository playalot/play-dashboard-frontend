var React = require('react');
var Reflux = require('reflux');
var _ = require('lodash');
var Col = require('react-bootstrap').Col;
var Row = require('react-bootstrap').Row;
var Modal = require('react-bootstrap').Modal;
var Link = require('react-router').Link;
var Form = require('react-bootstrap').Form;
var FormGroup = require('react-bootstrap').FormGroup;
var InputGroup = require('react-bootstrap').InputGroup;
var FormControl = require('react-bootstrap').FormControl;
var Button = require('react-bootstrap').Button;
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;
var TagStore = require('../stores/tagstore');
var TagClassStore = require('../stores/tagclassstore');
var TagActions = require('../actions/tagactions');
import CDN from '../widgets/cdn';
var If = require('../widgets/if');

var TagList = React.createClass({
  mixins: [Reflux.connect(TagStore, 'taglist'), Reflux.connect(TagClassStore, 'classifications')],
  getInitialState: function() {
    return {
      query: '',
      selectedTag: null
    };
  },
  onChangeQuery: function(e) {
    this.setState({query: e.target.value});
  },
  fetchMoreTags: function() {
    TagActions.fetchTags(this.state.query);
  },
  search: function(e) {
    console.log('click query: ' + this.state.query);
    TagActions.fetchTags(this.state.query);
    e.preventDefault();
  },
  openTag: function(tag) {
    this.setState({ selectedTag: tag });
  },
  closeTag: function() {
    this.setState({ selectedTag: null });
  },
  setTagClassification: function(tid, cid) {
    TagActions.setTagClassification(tid, cid);
    return false;
  },
  removeTagClassification: function(tid, cid) {
    TagActions.removeTagClassification(tid, cid);
    return false;
  },
  deleteTag: function(id) {
    if (confirm('删除这个标签?')) {
      TagActions.deleteTag(id);
    }
  },
  recommend: function(id) {
    if (confirm('推荐这个标签?')) {
      TagActions.recommendTag(id);
    }
  },
  render: function() {
    var modal = (<div></div>);
    if (!_.isEmpty(this.state.classifications) && this.state.selectedTag !== null) {
      var cls = _.filter(this.state.classifications, function(c){
        return this.state.selectedTag.cls.indexOf(c.id) === -1;
      }.bind(this));
      modal = (
        <div>
         <Modal className='modal-container' animation={false} show={true} onHide={this.closeTag}>
           <Modal.Body>
             <strong>已选类别</strong>
             <div>
               {this.state.selectedTag.cls.map(function(c){
                 return (<span key={'t_c_m_'+c} className="label label-warning label-margin" onClick={this.removeTagClassification.bind(this, this.state.selectedTag.id, c)}>{_.isEmpty(this.state.classifications) ? c : this.state.classifications[c].name}</span>);
               }, this)}
             </div>
             <strong>全部类别</strong>
             <div>
             {_.map(cls, function (c, key) {
                return (<span key={'c_m_'+key} className='label label-info label-margin' bsStyle='success' onClick={this.setTagClassification.bind(this, this.state.selectedTag.id, c.id)}>{c.name}</span>);
             }.bind(this))}
             </div>
           </Modal.Body>
         </Modal>
       </div>
     );
    }

    return (
      <div className="content">
        <div className="page-header">
          <Form inline onSubmit={this.search}>
            <FormGroup>
              <If test={!_.isEmpty(this.state.classifications)}>
                <FormControl componentClass="select" placeholder="select" value={this.state.query} onChange={this.onChangeFilter}>
                  <option value="">All</option>
                  {_.map(this.state.classifications, function (c, key) {
                    return (<option key={'opt_'+c.id} value={c.id}>{c.name}</option>);
                  })}
                </FormControl>
              </If>
              <If test={_.isEmpty(this.state.classifications)}>
                <FormControl componentClass="select" placeholder="select" value={this.state.query} onChange={this.onChangeFilter}>
                  <option value="">All</option>
                </FormControl>
              </If>
            </FormGroup>
            <FormGroup>
              <InputGroup>
                <FormControl type="text" placeholder='搜索标签' value={this.state.query} onChange={this.onChangeQuery} />
                <InputGroup.Button>
                  <Button onClick={this.search}>搜索</Button>
                </InputGroup.Button>
              </InputGroup>
            </FormGroup>
          </Form>
        </div>
        <Row>
          {this.state.taglist.map(function(tag) {
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
                      {tag.cls.map(function(c){
                        return (<span key={'t_c_'+tag.id+'_'+c} className="label label-warning label-margin" >{_.isEmpty(this.state.classifications) ? c : this.state.classifications[c].name}</span>);
                      }, this)}
                    </p>
                  </div>
                  <div className="box-footer">
                    <ButtonToolbar className="pull-right">
                      <Link to={'/tag/'+tag.id}><span className="btn btn-sm"><i className="fa fa-edit"></i></span></Link>
                      <span className="btn btn-sm" onClick={this.recommend.bind(this, tag.id)}><i className="fa fa-bookmark-o"></i></span>
                      <span className="btn btn-sm" onClick={this.openTag.bind(this, tag)}><i className="fa fa-th-large"></i></span>
                      <span onClick={ this.deleteTag.bind(this, tag.id) } className="btn btn-sm"><i className="fa fa-trash"></i></span>
                    </ButtonToolbar>
                  </div>
                </div>
              </Col>
            );
          }.bind(this))}
        </Row>
        <Row>
          <div className="load-more-btn" onClick={this.fetchMoreTags}>Load More</div>
        </Row>
        {modal}
      </div>
    );

  }
});

module.exports = TagList;
