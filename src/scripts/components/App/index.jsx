import React,{ Component } from 'react'
import { Route,Link,Switch,NavLink } from 'react-router-dom'

import PlayMainHeader from '../Common/PlayMainHeader'

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
	render() {
		return (
			<div className="page-wrapper">
				<PlayMainHeader/>
				<div className="clearfix"> </div>
				<div className="page-container" style={{backgroundColor:'rgb(66,118,164)'}}>
					<div className="page-sidebar-wrapper">
						<div className="page-sidebar navbar-collapse collapse">
							<ul className="page-sidebar-menu  page-header-fixed page-sidebar-menu-closed " data-keep-expanded="false" data-auto-scroll="true" data-slide-speed="200" style={{paddingTop:20}}>
								<li className="sidebar-toggler-wrapper hide">
									<div className="sidebar-toggler">
										<span></span>
									</div>
								</li>
								<li className="heading">
									<h3 className="uppercase">菜单</h3>
								</li>
								<li className="nav-item  ">
									<NavLink className="nav-link" activeClassName="active" to="/home">
										<i className="fa fa-dashboard"></i>
										<span className="title">概况</span>
									</NavLink>
								</li>
								<li className="nav-item  ">
									<a href="javascript:;" className="nav-link nav-toggle">
										<i className="fa fa-calendar-plus-o"></i>
										<span className="title">推荐</span>
										<span className="arrow"></span>
									</a>
									<ul className="sub-menu">
										<li className="nav-item  ">
											<NavLink className="nav-link" activeClassName="active" to="/recommendhome">
												<span className="title">首页推荐页管理</span>
											</NavLink>
										</li>
										<li className="nav-item  ">
											<NavLink className="nav-link" activeClassName="active" to="/explorepage">
												<span className="title">发现页管理</span>
											</NavLink>
										</li>
									</ul>
								</li>
								<li className="nav-item  ">
									<NavLink className="nav-link" activeClassName="active" to="/posts">
										<i className="fa fa-camera"></i>
										<span className="title">图片</span>
									</NavLink>
								</li>
								<li className="nav-item  ">
									<NavLink className="nav-link" activeClassName="active" to="/pages">
										<i className="fa fa-edit"></i>
										<span className="title">文章</span>
									</NavLink>
								</li>
								<li className="nav-item  ">
									<NavLink className="nav-link" activeClassName="active" to="/users">
										<i className="fa fa-users"></i>
										<span className="title">用户</span>
									</NavLink>
								</li>
								<li className="nav-item  ">
									<NavLink className="nav-link" activeClassName="active" to="/toys">
										<i className="fa fa-rocket"></i>
										<span className="title">玩具</span>
									</NavLink>
								</li>
								<li className="nav-item  ">
									<a href="javascript:;" className="nav-link nav-toggle">
										<i className="fa fa-shopping-cart"></i>
										<span className="title">商家</span>
										<span className="arrow"></span>
									</a>
									<ul className="sub-menu">
										<li className="nav-item  ">
											<NavLink className="nav-link" activeClassName="active" to="/skus">
												<span className="title">商品</span>
											</NavLink>
										</li>
										<li className="nav-item  ">
											<NavLink className="nav-link" activeClassName="active" to="/orders">
												<span className="title">订单</span>
											</NavLink>
										</li>
									</ul>
								</li>
								<li className="nav-item  ">
									<NavLink className="nav-link" activeClassName="active" to="/trades">
										<i className="fa fa-hand-peace-o"></i>
										<span className="title">二手交易</span>
									</NavLink>
								</li>
								<li className="nav-item  ">
									<NavLink className="nav-link" activeClassName="active" to="/tags">
										<i className="fa fa-tags"></i>
										<span className="title">标签</span>
									</NavLink>
								</li>
								<li className="nav-item  ">
									<NavLink className="nav-link" activeClassName="active" to="/stickers">
										<i className="fa fa-paw"></i>
										<span className="title">贴纸</span>
									</NavLink>
								</li>
								<li className="nav-item  ">
									<NavLink className="nav-link" activeClassName="active" to="/tools">
										<i className="fa fa-wrench"></i>
										<span className="title">工具</span>
									</NavLink>
								</li>
								<li className="nav-item  ">
									<a href="javascript:;" className="nav-link nav-toggle">
										<i className="fa fa-info-circle"></i>
										<span className="title">投诉</span>
										<span className="arrow"></span>
									</a>
									<ul className="sub-menu">
										<li className="nav-item  ">
											<NavLink className="nav-link" activeClassName="active" to="/reports">
												<span className="title">举报</span>
											</NavLink>
										</li>
										<li className="nav-item  ">
											<NavLink className="nav-link" activeClassName="active" to="/feedbacks">
												<span className="title">反馈</span>
											</NavLink>
										</li>
									</ul>
								</li>
							</ul>
						</div>
					</div>
					<div className="page-content-wrapper">
						<div className="page-content">
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
					</div>
				</div>
				<div className="page-footer" style={{backgroundColor:'rgb(66,118,164)'}}>
                	<div className="page-footer-inner"> Copyright &copy; 2015 Play Co. Ltd All rights reserved.
					</div>
					<div className="scroll-to-top">
						<i className="fa fa-arrow-up"></i>
					</div>
				</div>
			</div>
		)
	}
}