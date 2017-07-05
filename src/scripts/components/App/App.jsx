import React,{ Component } from 'react'
import { Route,Link,Switch } from 'react-router-dom'

import Home from '../Home'
import ExplorePage from '../ExplorePage'
import RecommendHome from '../RecommendHome'
import PostList from '../PostList'
import PageList from '../PageList'
import UserList from '../UserList'
import TagList from '../TagList'
import ToyList from '../ToyList'
import TradeList from '../TradeList'
import StickerList from '../StickerList'
import SkuList from '../SkuList'
import OrderList from '../OrderList'
import ReportList from '../ReportList'
import FeedbackList from '../FeedbackList'

import Tools from '../Tools'

import UserDetail from '../UserDetail'
import EditTag from '../EditTag'
import EditToy from '../EditToy'
import EditSku from '../EditSku'
import EditRecommend from '../EditRecommend'

import EditSticker from '../EditSticker'
import EditStickerSet from '../EditStickerSet'
import EditShortVideo from '../EditShortVideo'

import OrderDetail from '../OrderDetail'
import OrderToyList from '../OrderToyList'
import OrderUserList from '../OrderUserList'

import EditPage from '../EditPage'


export default class App extends Component{
	constructor(props) {
    super(props)
      this.signOut = () => {
      if(confirm('确定登出吗?')){
        window.location.href = '/signOut'
      }
    }
	}
	componentWillMount() {
		!this.props.loaded && this.props.fetchInfo()
	}
	render() {
		const { nickName, avatar, email } = this.props.user
		return(
			<div className="wrapper">
        <div className="main-header">
          <a href="#" className="logo">
            <span className="logo-mini"><b>P</b></span>
            <span className="logo-lg"><b>Play</b></span>
          </a>
          <nav className="navbar navbar-static-top" role="navigation">
            <a className="sidebar-toggle" data-toggle="offcanvas" role="button">
              <span className="sr-only">Toggle navigation</span>
            </a>
            <div className="navbar-custom-menu">
              <ul className="nav navbar-nav">
                <li><a style={{borderLeft:'none'}}>{email}</a></li>
                <li><a onClick={this.signOut}><i className="fa fa-sign-out"></i></a></li>
              </ul>
            </div>
          </nav>
        </div>
        <div className="main-sidebar">
          <section className="sidebar">
            <div className="user-panel" style={avatar ? {}:{minHeight:40}}>
              <div className="pull-left image">
                {
                  avatar ?
                  <img src={avatar} className="img-circle" alt="User Image" />
                  :null
                }
              </div>
              <div className="pull-left info">
                <p>{nickName}</p>
                {
                  avatar ?
                  <a href="#"><i className="fa fa-circle text-success"></i> Online</a>
                  :null
                }
              </div>
            </div>
            <ul className="sidebar-menu">
              <li className="header">菜单</li>
              <li><Link to="/home"><i className="fa fa-dashboard"></i><span>概况</span></Link></li>
              <li>
                <a href="#">
                  <i className="fa fa-calendar-plus-o"></i>
                  <span>推荐</span>
                  <i className="fa fa-angle-left pull-right"></i>
                </a>
                <ul className="treeview-menu">
                  <li><Link to="/recommendhome"><i className="fa fa-circle-o"></i><span>首页推荐管理</span></Link></li>
                  <li><Link to="/explorepage"><i className="fa fa-circle-o"></i><span>发现页管理</span></Link></li>
                </ul>
              </li>
              <li><Link to="/posts"><i className="fa fa-camera"></i><span>图片</span></Link></li>
              <li><Link to="/pages"><i className="fa fa-edit"></i><span>文章</span></Link></li>
              <li><Link to="/users"><i className="fa fa-users"></i><span>用户</span></Link></li>
              <li><Link to="/toys"><i className="fa fa-rocket"></i><span>玩具</span></Link></li>
              <li>
                <a href="#">
                  <i className="fa fa-shopping-cart"></i>
                  <span>商家</span>
                  <i className="fa fa-angle-left pull-right"></i>
                </a>
                <ul className="treeview-menu">
                  <li><Link to="/skus"><i className="fa fa-circle-o"></i><span>商品</span></Link></li>
                  <li><Link to="/orders"><i className="fa fa-circle-o"></i><span>订单</span></Link></li>
                </ul>
              </li>
              <li><Link to="/trades"><i className="fa fa-handshake-o"></i><span>二手交易</span></Link></li>
              <li><Link to="/tags"><i className="fa fa-tags"></i><span>标签</span></Link></li>
              <li><Link to="/stickers"><i className="fa fa-paw"></i><span>贴纸</span></Link></li>
              <li><Link to="/tools"><i className="fa fa-wrench"></i><span>工具</span></Link></li>
              <li>
                <a href="#">
                  <i className="fa fa-info-circle"></i>
                  <span>投诉</span>
                  <i className="fa fa-angle-left pull-right"></i>
                </a>
                <ul className="treeview-menu">
                  <li><Link to="/reports"><i className="fa fa-circle-o"></i><span>举报</span></Link></li>
                  <li><Link to="/feedbacks"><i className="fa fa-circle-o"></i><span>反馈</span></Link></li>
                </ul>
              </li>
            </ul>
          </section>
        </div>
        <div className="content-wrapper">
          <Switch>
            <Route exact path="/" component={Home}/>
            <Route path="/home" component={Home}/>
            <Route path="/recommendhome" component={RecommendHome}/>
            <Route path="/explorepage" component={ExplorePage}/>
            <Route path="/posts" component={PostList}/>
            <Route path="/pages" component={PageList}/>
            <Route path="/users" component={UserList}/>
            <Route path="/toys" component={ToyList}/>
            <Route path="/tags" component={TagList}/>
            <Route path="/trades" component={TradeList}/>
            <Route path="/stickers" component={StickerList}/>
            <Route path="/skus" component={SkuList}/>
            <Route path="/orders" component={OrderList}/>
            <Route path="/reports" component={ReportList}/>
            <Route path="/feedbacks" component={FeedbackList}/>

            <Route path="/tools" component={Tools}/>

            <Route path="/user/:id" component={UserDetail}/>
            <Route path="/tag/:id" component={EditTag}/>
            <Route path="/toy/:id" component={EditToy}/>
            <Route path="/sku/:id" component={EditSku}/>
            <Route path="/page/edit" component={EditPage}/>
            <Route path="/recommend/:id" component={EditRecommend}/>
            <Route path="/sticker/:id/add" component={EditSticker}/>
            <Route path="/sticker/:id/edit" component={EditStickerSet}/>
            <Route path="/video/edit" component={EditShortVideo}/>
            <Route path="/order/edit/:id" component={OrderDetail}/>
            <Route path="/order/toy/:id" component={OrderToyList}/>
            <Route path="/order/user/:id" component={OrderUserList}/>
          </Switch>
        </div>
        <footer className="main-footer">
          <div className="pull-right hidden-xs">
            {'version 1.0.0'}
          </div>
          Copyright &copy; 2015 Play Co. Ltd All rights reserved.
        </footer>
        <div className="control-sidebar-bg"></div>
		  </div>
		)
	}
}