import React,{ Component } from 'react'
import { Link } from 'react-router'
import {
  Row, Col, Modal, Tab, Tabs, ButtonToolbar
} from 'react-bootstrap'

import PostPanel from '../PostPanel/index.js'

export default class UserDetail extends Component{
    constructor(props) {
        super(props)
    
        this.state = {
            filter: '',
            showModal: false, 
            showImage: '',
            selectedPost: null
        }
        this.openImage = (img) => this.setState({ showModal: true, showImage: img })
        this.closeImage = () => this.setState({ showModal: false })
        this.openClass = (post) => this.setState({ selectedPost: post })
    }
    componentWillMount() {
        this.props.fetchUserInfo(this.props.params.id)
        this.props.fetchUserPost(this.props.params.id)
    }
    render() {
        if (this.props.user.id && this.props.posts.length) {
            const user = this.props.user
            const posts = this.props.posts
            return (
                <div className="content">
                    <Row>
                        <div className="col-md-12">
                          <div className="box box-widget widget-user">
                            <div className="widget-user-header bg-black" style={{background: "url('"+user.cover+"') center center"}}>
                              <h3 className="widget-user-username">{user.nickname}</h3>
                              <h5 className="widget-user-desc">{user.bio}</h5>
                            </div>
                            <div className="widget-user-image">
                              <img className="img-circle" src={user.avatar} alt="User Avatar" />
                            </div>
                            <div className="box-footer">
                              <div className="row">
                                <div className="col-sm-4 border-right">
                                  <div className="description-block">
                                    <h5 className="description-header">{user.counts.posts}</h5>
                                    <span className="description-text">POSTS</span>
                                  </div>
                                </div>
                                <div className="col-sm-4 border-right">
                                  <div className="description-block">
                                    <h5 className="description-header">{user.counts.followers}</h5>
                                    <span className="description-text">FOLLOWERS</span>
                                  </div>
                                </div>
                                <div className="col-sm-4">
                                  <div className="description-block">
                                    <h5 className="description-header">{user.counts.following}</h5>
                                    <span className="description-text">FOLLOWING</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                    </Row>
                    <Row>
                        <Col className="col" xs={12} sm={12} lg={12}>
                          <Tabs defaultActiveKey={1} className="nav-tabs-custom">
                            <Tab eventKey={1} title="Posts">
                              <Row className="photo-columns">
                                {
                                    posts.map(function (post) {
                                        return (
                                            <PostPanel key={'p_'+post.id} post={post} openImage={this.openImage} openClass={this.openClass}/>
                                        )
                                    }, this)
                                }
                              </Row>
                              <Row>
                                <div className="load-more-btn">Load More</div>
                              </Row>
                            </Tab>
                            <Tab eventKey={2} title="Settings">
                              <form className="form-horizontal">
                                <div className="form-group">
                                  <label for="inputName" className="col-sm-2 control-label">Nickname</label>
                                  <div className="col-sm-10">
                                    <input type="text" className="form-control" placeholder="Nickname" value={user.nickname}  />
                                  </div>
                                </div>
                                <div className="form-group">
                                  <label for="inputEmail" className="col-sm-2 control-label">Email</label>
                                  <div className="col-sm-10">
                                    <input type="email" className="form-control" placeholder="Email" value={user.email}  />
                                  </div>
                                </div>
                                <div className="form-group">
                                  <label for="inputMobile" className="col-sm-2 control-label">Mobile</label>
                                  <div className="col-sm-10">
                                    <input type="text" className="form-control" id="inputName" placeholder="Mobile" value={user.mobile}  />
                                  </div>
                                </div>
                                <div className="form-group">
                                  <div className="col-sm-offset-2 col-sm-10">
                                    <ButtonToolbar>
                                      <button className="btn btn-primary" >Submit</button>
                                      <button className="btn btn-danger" ><i className="fa fa-exclamation"></i>{user.isActive?'ban':'activate'}</button>
                                    </ButtonToolbar>
                                  </div>
                                </div>
                              </form>
                            </Tab>
                          </Tabs>
                        </Col>
                    </Row>

                </div>
            )
        }else{
            return (<Row></Row>)
        }
    }
}


var Reflux = require('reflux');
var UserDetailStore = require('../../stores/userdetailstore');
var UserDetailActions = require('../../actions/userdetailactions');

var UserDetails = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  mixins: [Reflux.connect(UserDetailStore, 'userDetail')],
  getInitialState: function() {
    return { filter: '', showModal: false, showImage: '', user: null };
  },
  componentDidMount: function() {
    $.get('/api/user/'+this.props.params.id, function(data) {
      if (this.isMounted()) {
        UserDetailActions.updateUserId(this.props.params.id);
        this.setState({ user : data });
      }
    }.bind(this));
  },
  close: function() {
    this.setState({ showModal: false });
  },
  openImage: function(img) {
    console.log('show image: ' + img);
    var url = img.split('?')[0];
    this.setState({ showModal: true, showImage: url });
  },
  openClass: function(post) {
  },
  refreshUserCount: function() {
    UserDetailActions.refreshUserCount();
  },
  changeNickname: function(event) {
    var user = this.state.user;
    user.nickname = event.target.value;
    UserDetailActions.changeForm(user);
  },
  changeEmail: function(event) {
    var user = this.state.user;
    user.email = event.target.value;
    UserDetailActions.changeForm(user);
  },
  changeMobile: function(event) {
    var user = this.state.user;
    user.mobile = event.target.value;
    UserDetailActions.changeForm(user);
  },
  updateUserInfo: function() {
    var data = {};
    if (this.state.user.nickname.trim() !== '') {
      data.nickname = this.state.user.nickname.trim();
    }
    if (this.state.user.email.trim() !== '') {
      data.email = this.state.user.email.trim();
    }
    if (this.state.user.mobile.trim() !== '') {
      data.mobile = this.state.user.mobile.trim();
    }
    console.log(data);
    UserDetailActions.updateUserInfo(data);
  },
  setActive: function() {
    if (confirm('Are you sure to delete this user??? The user will never be recovered again!')) {
      UserDetailActions.setActive(this.props.params.id, !this.state.user.isActive);
    }
  },
  fetchMorePosts: function() {
    UserDetailActions.fetchUserPosts();
  },
  render: function() {
    if (this.state.user) {
      return (
        <div className="content">
          <Row>
            <div className="col-md-12">
              <div className="box box-widget widget-user">
                <div className="widget-user-header bg-black" style={{background: "url('"+this.state.user.cover+"') center center"}}>
                  <h3 className="widget-user-username">{this.state.user.nickname}</h3>
                  <h5 className="widget-user-desc">{this.state.user.bio}</h5>
                </div>
                <div className="widget-user-image">
                  <img className="img-circle" src={this.state.user.avatar} alt="User Avatar" />
                </div>
                <div className="box-footer">
                  <div className="row">
                    <div className="col-sm-4 border-right">
                      <div className="description-block">
                        <h5 className="description-header">{this.state.user.counts.posts}</h5>
                        <span className="description-text">POSTS</span>
                      </div>
                    </div>
                    <div className="col-sm-4 border-right">
                      <div className="description-block">
                        <h5 className="description-header">{this.state.user.counts.followers}</h5>
                        <span className="description-text">FOLLOWERS</span>
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className="description-block">
                        <h5 className="description-header">{this.state.user.counts.following}</h5>
                        <span className="description-text">FOLLOWING</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Row>
          <Row>
            <Col className="col" xs={12} sm={12} lg={12}>
              <Tabs defaultActiveKey={1} className="nav-tabs-custom">
                <Tab eventKey={1} title="Posts">
                  <Row className="photo-columns">
                    {this.state.userDetail.postlist.map(function (post) {
                      return (
                        <PostPanel key={'p_'+post.id} post={post} openImage={this.openImage} openClass={this.openClass}/>
                      );
                    }, this)}
                  </Row>
                  <Row>
                    <div className="load-more-btn" onClick={this.fetchMorePosts}>Load More</div>
                  </Row>
                </Tab>
                <Tab eventKey={2} title="Settings">
                  <form className="form-horizontal">
                    <div className="form-group">
                      <label for="inputName" className="col-sm-2 control-label">Nickname</label>
                      <div className="col-sm-10">
                        <input type="text" className="form-control" placeholder="Nickname" value={this.state.user.nickname} onChange={this.changeNickname} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label for="inputEmail" className="col-sm-2 control-label">Email</label>
                      <div className="col-sm-10">
                        <input type="email" className="form-control" placeholder="Email" value={this.state.user.email} onChange={this.changeEmail} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label for="inputMobile" className="col-sm-2 control-label">Mobile</label>
                      <div className="col-sm-10">
                        <input type="text" className="form-control" id="inputName" placeholder="Mobile" value={this.state.user.mobile} onChange={this.changeMobile} />
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="col-sm-offset-2 col-sm-10">
                        <ButtonToolbar>
                          <button className="btn btn-primary" onClick={this.updateUserInfo}>Submit</button>
                          <button className="btn btn-danger" onClick={this.setActive}><i className="fa fa-exclamation"></i>{this.state.user.isActive?'ban':'activate'}</button>
                        </ButtonToolbar>
                      </div>
                    </div>
                  </form>
                </Tab>
              </Tabs>
            </Col>
          </Row>

          <div>
            <Modal show={this.state.showModal} onHide={this.close}>
              <Modal.Body>
                <img className="image-modal" src={this.state.showImage}/>
              </Modal.Body>
            </Modal>
          </div>
        </div>
      );
    } else {
      return (<Row></Row>);
    }
  }
});

