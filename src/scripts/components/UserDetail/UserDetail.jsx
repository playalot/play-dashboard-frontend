import React,{ Component } from 'react'
import { Link } from 'react-router'
import {
    Row, Col, Modal, Tab, Tabs, ButtonToolbar
} from 'react-bootstrap'
const _ = require('lodash')
import Moment from 'moment'
import Switch from 'rc-switch'
import PostPanel from '../PostPanel/index'

export default class UserDetail extends Component{
    constructor(props) {
        super(props)
        this.state = {
            filter: '',
            showModal: false, 
            showImage: '',
            selectedPost: null
        }
        this.fetchMorePosts = this._fetchMorePosts.bind(this)
        this.openImage = (img) => this.setState({ showModal: true, showImage: img })
        this.closeImage = () => this.setState({ showModal: false })

        this.openClass = (post) => this.setState({ selectedPost: post })
        this.closeClass = () => this.setState({ selectedPost: null })

        this.setClassification = (pid,cid) => this._setClassification(pid,cid)
        this.removeClassification = (pid,c) => this._removeClassification(pid,c)
        //文章
        this.togglePub = (id) => this.props.togglePub(id)
        this.toggleRec = (id) => this.props.toggleRec(id)
        this.deleteArticle = this._deleteArticle.bind(this)
    }
    componentWillMount() {
        this.props.fetchUserInfo(this.props.params.id)
        this.props.fetchUserPost(this.props.params.id)
        if(!this.props.classLoaded){
            this.props.fetchTagClass()
        }
        this.props.fetchUserPage(this.props.params.id)
    }
    componentWillUnmount() {
        this.props.clearPost()
    }
    _fetchMorePosts() {
        this.props.fetchUserPost(this.props.params.id)
    }
    _setClassification(pid, cid) {
        this.state.selectedPost.cls.push(cid)
        this.props.setClassification(pid, cid)
    }
    _removeClassification(pid, c) {
        let index = this.state.selectedPost.cls.indexOf(c)
        index !== -1 ? this.state.selectedPost.cls.splice(index, 1) : null
        this.props.removeClassification(pid, c)
    }
    _deleteArticle(id) {
      if (confirm('删除这个文章?')) {
        this.props.deleteArticle(id)
      }
    }
    render() {

        let modal = (<div></div>)
        if (this.state.selectedPost !== null) {
            let cls = _.filter(this.props.classifications, function(c){
              return this.state.selectedPost.cls.indexOf(c.id) === -1
            }.bind(this))
            modal = (
              <div>
                <Modal className='modal-container' animation={false} show={true} onHide={this.closeClass}>
                   <Modal.Body>
                      <strong>已选类别</strong>
                      <div>
                          {
                            this.state.selectedPost.cls.map(function(c){
                              return (
                                <span key={'t_c_m_'+c} 
                                onClick={ () => this.removeClassification( this.state.selectedPost.id, c) }
                                className="label label-warning label-margin" >{_.isEmpty(this.props.classifications) ? c : this.props.classifications[c].name}</span>);
                            }, this)
                          }
                      </div>
                      <strong>全部类别</strong>
                      <div>
                        {
                          cls.map((c,key) => {
                            return (
                              <span key={'c_m_'+key} 
                              className='label label-info label-margin' 
                              bsStyle='success' 
                              onClick={() => this.setClassification(this.state.selectedPost.id, c.id) }>{c.name}</span>
                            )
                          })
                        }
                      </div>
                    </Modal.Body>
                </Modal>
              </div>
          )
        }
        if (this.props.user.id && this.props.pages) {
            const { user, posts, pages } = this.props
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
                                <div className="load-more-btn" onClick={this.fetchMorePosts}>Load More</div>
                              </Row>
                            </Tab>
                            <Tab eventKey={2} title="Pages">
                              <div className="table-responsive">
                                <table className="table table-striped">
                                  <tbody>
                                    {pages.map((page) => {
                                      let isPubClass = page.isPub === true ? 'btn bg-orange btn-sm' : 'btn btn-sm'
                                      let recommendClass = page.isRec === true ? 'btn bg-orange btn-sm' : 'btn btn-sm'
                                      return (
                                        <tr key={page.id}>
                                          <td><img style={{width:'400px'}} src={page.cover} className="img-thumbnail"/></td>
                                          <td>{page.title}</td>
                                          <td>{page.category}</td>
                                          <td>
                                            {
                                              // page.tags.map((tag,index) => {
                                              //   return (<span className="label label-info label-margin" key={`tag_${index}`}>{tag}</span>)
                                              // })
                                            }
                                          </td>
                                          <td>{page.counts.views} views</td>
                                          <td>{Moment.unix(page.created / 1000).fromNow()}</td>
                                          <td>
                                            <Switch onChange={value => this.props.setCoverType(value,page.id)}
                                              checkedChildren={'L'}
                                              unCheckedChildren={'S'}
                                              checked={page.coverType === 'l'}
                                            />
                                          </td>
                                          <td><Link to={`/page/edit/${page.id}` }><span style={{color:'#333'}} className="btn btn-sm"><i className="fa fa-edit"></i></span></Link></td>
                                          <td><span style={{color:'#333'}} onClick={() => this.toggleRec(page.id)} className={recommendClass}><i className="fa fa-thumbs-o-up"></i></span></td>
                                          <td><span style={{color:'#333'}} onClick={() => this.togglePub(page.id)} className={isPubClass}><i className="fa fa-eye"></i></span></td>
                                          <td><span style={{color:'#333'}} onClick={() => this.deleteArticle(page.id)} className="btn btn-sm"><i className="fa fa-trash"></i></span></td>
                                          <td><a target="_blank" href={`http://www.playalot.cn/page/${page.id}.html`}>预览</a></td>
                                        </tr>
                                      )
                                    })}
                                    <tr></tr>
                                  </tbody>
                                </table>
                              </div>
                            </Tab>
                            <Tab eventKey={3} title="Settings">
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
                    <div>
                      <Modal show={this.state.showModal} onHide={this.closeImage}>
                        <Modal.Body>
                          <img className="image-modal" src={this.state.showImage}/>
                        </Modal.Body>
                      </Modal>
                    </div>
                    {modal}
                </div>
            )
        }else{
            return (<Row></Row>)
        }
    }
}


