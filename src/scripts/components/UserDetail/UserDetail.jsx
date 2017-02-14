import React,{ Component } from 'react'
import { Link } from 'react-router'
import {
    Row, Col, Modal, Tab, Tabs, ButtonToolbar
} from 'react-bootstrap'
const _ = require('lodash')
import Moment from 'moment'
import Switch from 'rc-switch'
import PostPanel from '../PostPanel/userIndex'
import UserPage from './UserPage'
import CDN from '../../widgets/cdn'
import ReactPaginate from 'react-paginate'
export default class UserDetail extends Component{
    constructor(props) {
        super(props)
        this.state = {
            filter: '',
            showModal: false, 
            showImage: '',
            selectedPost: null
        }
        this.openImage = (photos,i) => {
            this.setState({ showModal: true, showImage: photos[i]['url'],photos,imageIndex:i })
        }
        this.changeImage = (num) => {
            let { photos, imageIndex } = this.state
            imageIndex = imageIndex+num+photos.length 
            let showImage = photos[imageIndex%photos.length]['url']
            this.setState({showImage,imageIndex})
        }
        this.closeImage = () => this.setState({ showModal: false })

        this.openClass = (post) => this.setState({ selectedPost: post })
        this.closeClass = () => this.setState({ selectedPost: null })

        this.setClassification = (pid,cid) => this._setClassification(pid,cid)
        this.removeClassification = (pid,c) => this._removeClassification(pid,c)
        this.setActive = this._setActive.bind(this)
        this.goPage = this._goPage.bind(this)

        this.approve = this._approve.bind(this)
    }
    componentWillMount() {
        this.props.fetchUserInfo(this.props.params.id)
        if(!this.props.classLoaded){
            this.props.fetchTagClass()
        }
        this.props.getUserPost(this.props.params.id,this.props.location.query.page)
    }
    _approve(id) {
      let txt = prompt('输入认证信息')
      if (txt) {
        this.props.approveUser(id,txt)
      }
    }
    renderAccounts(accounts) {
      return (
        <span>
          {
            accounts.map( acc => {
              if (acc.providerID === "weibo") {
                  return <a href={'http://weibo.com/'+acc.providerKey} style={{color:'#E71D34', marginRight: '5px'}}><i className="fa fa-weibo fa-lg"></i></a>
              } else if (acc.providerID === "mobile") {
                  return <a style={{color:'#55acee', marginRight: '5px'}}><i className="fa fa-mobile-phone fa-lg" title={acc.providerKey}  ></i></a>
              } else if (acc.providerID === 'qq') {
                return <a style={{color:'rgb(21,167,240)', marginRight: '5px'}}><i className="fa fa-qq fa-lg"></i></a>
              } else if (acc.providerID === 'wechat') {
                return <a style={{color:'rgb(73,190,56)', marginRight: '5px'}}><i className="fa fa-wechat fa-lg"></i></a>
              }
          })
          }
        </span>
      )
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
    _setActive() {
      if(this.props.user.isActive) {
        if (confirm('确定屏蔽这个用户吗?')) {
          this.props.setActive(this.props.params.id)
        }
      }else {
        if (confirm('确定解除屏蔽吗?')) {
          this.props.setActive(this.props.params.id)
        }
      }
      
    }
    _goPage(page) {
      this.context.router.push(`/user/${this.props.params.id}?page=${page}`)
      this.props.getUserPost(this.props.params.id,page)
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
        const { user, posts, pages } = this.props
        if (user.id) {
          let gender = user.gender === 'm' ? 
          <i style={{color:'deepskyblue'}} className="fa fa-mars"></i>
          :<i style={{color:'pink'}} className="fa fa-venus"></i>
          return (
              <div className="content">
                  <Row>
                      <div className="col-md-12">
                        <div className="box box-widget widget-user">
                          <div className="widget-user-header bg-black" style={{background: "url('"+CDN.show(user.cover ? user.cover : 'default_cover.jpg')+"') center center"}}>
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
                                  posts.map( post => <PostPanel key={'p_'+post.id} post={post} openImage={this.openImage} openClass={this.openClass}/>)
                              }
                            </Row>
                            <Row style={{textAlign:'center'}}>
                              <ReactPaginate 
                                previousLabel={<span>&laquo;</span>}
                                nextLabel={<span>&raquo;</span>}
                                breakLabel={<span>...</span>}
                                breakClassName={"break-me"}
                                pageCount={this.props.totalPages}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={5}
                                onPageChange={obj => this.goPage(obj.selected)}
                                containerClassName={"pagination"}
                                subContainerClassName={"pages pagination"}
                                forcePage={this.props.location.query.page ? parseInt(this.props.location.query.page) : 0}
                                activeClassName={"active"} />
                            </Row>
                          </Tab>
                          <Tab eventKey={2} title="Pages">
                              <UserPage id={this.props.params.id}/>
                          </Tab>
                          <Tab eventKey={3} title="Info">
                            <div className="row">
                              <div className="col-sm-2 sm-2-label">
                                <b>Nickname</b>
                              </div>
                              <div className="col-sm-10" style={{padding:7}}>
                                { user.nickname }
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-sm-2 sm-2-label">
                                <b>Approval</b>
                              </div>
                              <div className="col-sm-10" style={{padding:7,fontSize:12}}>
                                <span className="label label-info">{user.approval}</span>
                                <span className="btn btn-sm"  style={{marginLeft:'5px'}} onClick={() => this.approve(this.props.params.id)}><i className="fa fa-edit"></i></span>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-sm-2 sm-2-label">
                                <b>Level</b>
                              </div>
                              <div className="col-sm-10" style={{padding:7,fontSize:12}}>
                                <span className="label label-warning">lv{user.level}</span>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-sm-2 sm-2-label">
                                <b>Gender</b>
                              </div>
                              <div className="col-sm-10" style={{padding:7}}>
                                <span>{gender}</span>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-sm-2 sm-2-label">
                                <b>Accounts</b>
                              </div>
                              <div className="col-sm-10" style={{padding:7}}>
                                <span>{this.renderAccounts(user.accounts)}</span>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-sm-2 sm-2-label">
                                <b>Introduction</b>
                              </div>
                              <div className="col-sm-10" style={{padding:7}}>
                                { user.bio ? user.bio : '这家伙很懒' }
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-sm-2 sm-2-label">
                                <b>Active</b>
                              </div>
                              <div className="col-sm-10">
                                <button onClick={this.setActive} className="btn btn-danger"><i className="fa fa-eye-slash">&nbsp;</i>{user.isActive?'ban':'activate'}</button>
                              </div>
                            </div>
                          </Tab>
                        </Tabs>
                      </Col>
                  </Row>
                  <div>
                    <Modal show={this.state.showModal} onHide={this.closeImage}>
                      <Modal.Body>
                        <span className="image-modal-left" onClick={() => this.changeImage(-1)}><i className="glyphicon glyphicon-chevron-left"></i></span>
                        <img className="image-modal" onClick={this.closeImage} src={this.state.showImage}/>
                        <span className="image-modal-right" onClick={() => this.changeImage(1)}><i className="glyphicon glyphicon-chevron-right"></i></span>
                      </Modal.Body>
                    </Modal>
                  </div>
                  {modal}
              </div>
          )
        }else{
          return <Row></Row>
        }
    }
}


UserDetail.contextTypes = {
    router : React.PropTypes.object
}
