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
				<div className="page-container">
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
								<li className="nav-item">
									<NavLink className="nav-link" activeClassName="active" to="/home">
										<i className="icon-home"></i>
										<span className="title">概况</span>
									</NavLink>
								</li>
								<li className="nav-item">
									<NavLink className="nav-link" activeClassName="active" to="/explorepage">
										<i className="icon-directions"></i>
										<span className="title">推荐</span>
										<span className="arrow"></span>
									</NavLink>
								</li>
								<li className="nav-item">
									<NavLink className="nav-link" activeClassName="active" to="/posts">
										<i className="icon-camera"></i>
										<span className="title">图片</span>
									</NavLink>
								</li>
								<li className="nav-item">
									<NavLink className="nav-link" activeClassName="active" to="/pages">
										<i className="icon-pencil"></i>
										<span className="title">文章</span>
									</NavLink>
								</li>
								<li className="nav-item">
									<NavLink className="nav-link" activeClassName="active" to="/users">
										<i className="icon-users"></i>
										<span className="title">用户</span>
									</NavLink>
								</li>
								<li className="nav-item  ">
									<NavLink className="nav-link" activeClassName="active" to="/toys">
										<i className="icon-rocket"></i>
										<span className="title">玩具</span>
									</NavLink>
								</li>
								<li className="nav-item">
									<a href="javascript:;" className="nav-link nav-toggle">
										<i className="icon-basket"></i>
										<span className="title">商家</span>
										<span className="arrow"></span>
									</a>
									<ul className="sub-menu">
										<li className="nav-item">
											<NavLink className="nav-link" activeClassName="active" to="/skus">
												<span className="title">商品</span>
											</NavLink>
										</li>
										<li className="nav-item">
											<NavLink className="nav-link" activeClassName="active" to="/orders">
												<span className="title">订单</span>
											</NavLink>
										</li>
									</ul>
								</li>
								<li className="nav-item">
									<NavLink className="nav-link" activeClassName="active" to="/trades">
										<i className="icon-cup"></i>
										<span className="title">二手交易</span>
									</NavLink>
								</li>
								<li className="nav-item">
									<NavLink className="nav-link" activeClassName="active" to="/tags">
										<i className="icon-tag"></i>
										<span className="title">标签</span>
									</NavLink>
								</li>
								<li className="nav-item  ">
									<NavLink className="nav-link" activeClassName="active" to="/stickers">
										<i className="icon-ghost"></i>
										<span className="title">贴纸</span>
									</NavLink>
								</li>
								<li className="nav-item  ">
									<NavLink className="nav-link" activeClassName="active" to="/tools">
										<i className="icon-wrench"></i>
										<span className="title">工具</span>
									</NavLink>
								</li>
								<li className="nav-item  ">
									<NavLink className="nav-link" activeClassName="active" to="/feedbacks">
										<i className="icon-info"></i>
										<span className="title">投诉</span>
									</NavLink>
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
			</div>
		)
	}
}
