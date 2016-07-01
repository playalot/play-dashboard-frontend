var React = require('react');
var Reflux = require('reflux');
var Link = require('react-router').Link;
var Cookie = require('react-cookie');
var Col = require('react-bootstrap').Col;
var Tooltip = require('react-bootstrap').Tooltip;
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;
var OverlayTrigger = require('react-bootstrap').OverlayTrigger;
var PostActions = require('../actions/postactions');
var TagClassStore = require('../stores/tagclassstore');
var Moment = require('moment');
var _ = require('lodash');
var If = require('../widgets/if');

var PostPanel = React.createClass({
  mixins: [Reflux.connect(TagClassStore, 'classifications')],
  propTypes: {
    post: React.PropTypes.object,
    openImage: React.PropTypes.func,
    openClass: React.PropTypes.func,
    showUser: React.PropTypes.bool
  },
  getDefaultProps: function() {
    return { showUser: true };
  },
  deletePost: function() {
    if (confirm('删除这个post?')) {
      PostActions.deletePost(this.props.post.id);
    }
  },
  toggleRecommendPost: function() {
    PostActions.toggleRecommendPost(this.props.post.id);
  },
  toggleBlockPost: function() {
    PostActions.toggleBlockPost(this.props.post.id);
  },
  toggleR18Post: function() {
    PostActions.toggleR18Post(this.props.post.id);
  },
  addSku: function() {
    var id = prompt('输入玩具ID');
    if (id) {
      PostActions.addSku(this.props.post.id, id);
    }
  },
  addTag: function() {
    var text = prompt('输入标签');
    if (text) {
      PostActions.addTag(this.props.post.id, text);
    }
  },
  removeTag: function(id) {
    if (confirm('删除这个标签?')) {
      PostActions.removeTag(this.props.post.id, id);
    }
  },
  nothing: function() {
    console.log('nothing happened');
  },
  render: function() {
    var recommendClass = 'btn btn-sm';
    if (this.props.post.isRecommended === true) {
      recommendClass = 'btn bg-orange btn-sm';
    }
    var invisibleClass = 'btn btn-sm';
    if (this.props.post.isBlocked === true) {
      invisibleClass = 'btn bg-orange btn-sm';
    }

    var r18Class = 'btn btn-sm';
    if (this.props.post.isR18 === true) {
      r18Class = 'btn bg-orange btn-sm';
    }

    var skuDiv = "";
    if (this.props.post.sku !== 'undefined' && this.props.post.sku !== null) {
      skuDiv  = (<Link to={'/sku/'+this.props.post.sku.id+'/edit'}><span className='label label-success label-margin'>{this.props.post.sku.name.substring(0, 25)+'...'}</span></Link>);
    }

    var contentDiv = '';
    if (this.props.post.video !== null) {
      contentDiv = (
        <div className="box-body no-padding" style={{paddingBottom:'2px !important'}}>
          <div >
            <video className="" src={this.props.post.video.url} controls></video>
          </div>
        </div>);
    }
    if (this.props.post.video === null) {
      contentDiv = (<div className="box-body no-padding" style={{paddingBottom:'2px !important'}}>
        <div>
          <img className="img-responsive" src={this.props.post.photos[0].url} alt="Photo" onClick={ this.props.openImage.bind(null, this.props.post.photos[0].url) } />
        </div>
        <div className="panel-photos">
          {this.props.post.photos.slice(1, this.props.post.photos.length).map(function (photo, i) {
            return (<div key={'p_'+this.props.post.id+'_'+i}  className="pull-left"><img className="img-responsive panel-photos-small" src={photo.url} alt="Photo" onClick={ this.props.openImage.bind(null, photo.url) } /></div>);
          }, this)}
        </div>
      </div>);
    }

    return (
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
                return (<span key={'p_'+this.props.post.id+'_t_'+t.id} className='label label-info label-margin' bsStyle='success'><Link to={'/tag/'+t.id}>{t.text}</Link>{" "}<i className="fa fa-close" onClick={this.removeTag.bind(this, t.id)}></i></span>);
              },this)}
              {skuDiv}
            </div>
            <div className="box-body no-top-padding">
              {this.props.post.cls.map(function(c){
                return (<span key={'p_'+this.props.post.id+'_c_'+c} className="label label-warning label-margin" >{_.isEmpty(this.state.classifications) ? c : this.state.classifications[c].name}</span>);
              }, this)}
            </div>
            <div className="box-footer">
              <ButtonToolbar className="pull-right">
                <span onClick={ this.addSku } className="btn btn-sm"><i className="fa fa-plus"></i></span>
                <span onClick={ this.addTag } className="btn btn-sm"><i className="fa fa-tag"></i></span>
                <span onClick={ this.props.openClass.bind(null, this.props.post) } className="btn btn-sm"><i className="fa fa-th-large"></i></span>
                <span onClick={ this.toggleR18Post } className={r18Class}><i className="fa fa-venus-mars"></i></span>
                <span onClick={ this.toggleBlockPost } className={invisibleClass}><i className="fa fa-eye-slash"></i></span>
                <span onClick={ this.toggleRecommendPost } className={recommendClass}><i className="fa fa-thumbs-o-up"></i></span>
                <span onClick={ this.deletePost } className="post-caption-btn btn btn-sm"><i className="fa fa-trash"></i></span>
              </ButtonToolbar>
            </div>
          </div>
        </Col>
    );
  }
});

  module.exports = PostPanel;
