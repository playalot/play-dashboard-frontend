import React,{ Component } from 'react'
import { Route,Link,Switch,NavLink } from 'react-router-dom'

import PlayMainHeader from '../Common/PlayMainHeader'
import PlayWeekPage from '../Common/PlayWeekPage'

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

import Post from '../Post'
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

import PlayAliBaichuan from '../Common/PlayAliBaichuan'

export default class App extends Component{
	render() {
		return (
			<div className="m-grid m-grid--hor m-grid--root m-page">
				<header className="m-grid__item    m-header "  data-minimize-mobile="hide" data-minimize-offset="200" data-minimize-mobile-offset="200" data-minimize="minimize" >
					  <div className="m-container m-container--fluid m-container--full-height">
						  <div className="m-stack m-stack--ver m-stack--desktop">
							  <div className="m-stack__item m-brand  m-brand--skin-dark ">
								  <div className="m-stack m-stack--ver m-stack--general">
									  <div className="m-stack__item m-stack__item--middle m-brand__logo">
										  <a href="/" className="m-brand__logo-wrapper">
											  <img alt="" style={{maxWidth:86,filter:'invert(1)'}} src="http://www.playalot.cn/assets/images/a64ada1d3b0ec825a0ba1d9fc4dee6c3-nav_lg.png"/>
										  </a>
									  </div>
									  <div className="m-stack__item m-stack__item--middle m-brand__tools">
										  <a href="javascript:;" id="m_aside_left_minimize_toggle" className="m-brand__icon m-brand__toggler m-brand__toggler--left m--visible-desktop-inline-block ">
											  <span></span>
										  </a>
										  <a href="javascript:;" id="m_aside_left_offcanvas_toggle" className="m-brand__icon m-brand__toggler m-brand__toggler--left m--visible-tablet-and-mobile-inline-block">
											  <span></span>
										  </a>
										  <a id="m_aside_header_menu_mobile_toggle" href="javascript:;" className="m-brand__icon m-brand__toggler m--visible-tablet-and-mobile-inline-block">
											  <span></span>
										  </a>
										  <a id="m_aside_header_topbar_mobile_toggle" href="javascript:;" className="m-brand__icon m--visible-tablet-and-mobile-inline-block">
											  <i className="flaticon-more"></i>
										  </a>
									  </div>
								  </div>
							  </div>
							  <div className="m-stack__item m-stack__item--fluid m-header-head" id="m_header_nav">
								  <div id="m_header_topbar" className="m-topbar  m-stack m-stack--ver m-stack--general">
									  <div className="m-stack__item m-topbar__nav-wrapper">
										  <ul className="m-topbar__nav m-nav m-nav--inline">
											  <li className="m-nav__item m-topbar__user-profile m-topbar__user-profile--img  m-dropdown m-dropdown--medium m-dropdown--arrow m-dropdown--header-bg-fill m-dropdown--align-right m-dropdown--mobile-full-width m-dropdown--skin-light" data-dropdown-toggle="click">
												  <a href="/" className="m-nav__link m-dropdown__toggle">
													  <span className="m-topbar__userpic">
														  <img src="http://img.playalot.cn/user/photo/575C_1470650473_w_84_h_85_576d0cbd1c00003700c1c32b.jpg?imageView2/2/w/120/q/90" className="m--img-rounded m--marginless m--img-centered" alt=""/>
													  </span>
													  <span className="m-topbar__username m--hide">
														  Nick
													  </span>
												  </a>
												  <div className="m-dropdown__wrapper">
													  <span className="m-dropdown__arrow m-dropdown__arrow--right m-dropdown__arrow--adjust"></span>
													  <div className="m-dropdown__inner">
														  <div className="m-dropdown__header m--align-center" style={{background: `url(http://img.playalot.cn/user/photo/575C_1470650473_w_84_h_85_576d0cbd1c00003700c1c32b.jpg?imageView2/2/w/120/q/90)`, backgroundSize: 'cover'}}>
															  <div className="m-card-user m-card-user--skin-dark">
																  <div className="m-card-user__pic">
																	  <img src="http://img.playalot.cn/user/photo/575C_1470650473_w_84_h_85_576d0cbd1c00003700c1c32b.jpg?imageView2/2/w/120/q/90" className="m--img-rounded m--marginless" alt=""/>
																  </div>
																  <div className="m-card-user__details">
																	  <span className="m-card-user__name m--font-weight-500">
																		  Mark Andre
																	  </span>
																	  <a href="" className="m-card-user__email m--font-weight-300 m-link">
																		  mark.andre@gmail.com
																	  </a>
																  </div>
															  </div>
														  </div>
														  <div className="m-dropdown__body">
															  <div className="m-dropdown__content">
																  <ul className="m-nav m-nav--skin-light">
																	  <li className="m-nav__section m--hide">
																		  <span className="m-nav__section-text">
																			  Section
																		  </span>
																	  </li>
																	  <li className="m-nav__item">
																		  <a href="header/profile.html" className="m-nav__link">
																			  <i className="m-nav__link-icon flaticon-profile-1"></i>
																			  <span className="m-nav__link-title">
																				  <span className="m-nav__link-wrap">
																					  <span className="m-nav__link-text">
																						  My Profile
																					  </span>
																					  <span className="m-nav__link-badge">
																						  <span className="m-badge m-badge--success">
																							  2
																						  </span>
																					  </span>
																				  </span>
																			  </span>
																		  </a>
																	  </li>
																	  <li className="m-nav__item">
																		  <a href="header/profile.html" className="m-nav__link">
																			  <i className="m-nav__link-icon flaticon-share"></i>
																			  <span className="m-nav__link-text">
																				  Activity
																			  </span>
																		  </a>
																	  </li>
																	  <li className="m-nav__item">
																		  <a href="header/profile.html" className="m-nav__link">
																			  <i className="m-nav__link-icon flaticon-chat-1"></i>
																			  <span className="m-nav__link-text">
																				  Messages
																			  </span>
																		  </a>
																	  </li>
																	  <li className="m-nav__separator m-nav__separator--fit"></li>
																	  <li className="m-nav__item">
																		  <a href="header/profile.html" className="m-nav__link">
																			  <i className="m-nav__link-icon flaticon-info"></i>
																			  <span className="m-nav__link-text">
																				  FAQ
																			  </span>
																		  </a>
																	  </li>
																	  <li className="m-nav__item">
																		  <a href="header/profile.html" className="m-nav__link">
																			  <i className="m-nav__link-icon flaticon-lifebuoy"></i>
																			  <span className="m-nav__link-text">
																				  Support
																			  </span>
																		  </a>
																	  </li>
																	  <li className="m-nav__separator m-nav__separator--fit"></li>
																	  <li className="m-nav__item">
																		  <a href="snippets/pages/user/login-1.html" className="btn m-btn--pill    btn-secondary m-btn m-btn--custom m-btn--label-brand m-btn--bolder">
																			  Logout
																		  </a>
																	  </li>
																  </ul>
															  </div>
														  </div>
													  </div>
												  </div>
											  </li>
										  </ul>
									  </div>
								  </div>
							  </div>
						  </div>
					  </div>
			</header>
			<div className="m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body">
			  <div id="m_aside_left" className="m-grid__item	m-aside-left  m-aside-left--skin-dark ">
						  <div id="m_ver_menu" className="m-aside-menu  m-aside-menu--skin-dark m-aside-menu--submenu-skin-dark " data-menu-vertical="true" data-menu-scrollable="false" data-menu-dropdown-timeout="500">
							  <ul className="m-menu__nav  m-menu__nav--dropdown-submenu-arrow ">
								  <li className="m-menu__section">
									  <h4 className="m-menu__section-text">
										  菜单
									  </h4>
									  <i className="m-menu__section-icon flaticon-more-v3"></i>
								  </li>
								  <li className="m-menu__item  " aria-haspopup="true" >
									  <NavLink activeClassName="m-menu__item--active" className="m-menu__link " to="/home">
									  		<i className=" m-menu__link-icon icon-home"></i>
										 	<span className="m-menu__link-title">
											  	<span className="m-menu__link-wrap">
												  	<span className="m-menu__link-text">
													  	概况
												  	</span>
											  	</span>
										  </span>
									  </NavLink>
								  </li>
								  <li className="m-menu__item  " aria-haspopup="true" >
									  <NavLink activeClassName="m-menu__item--active" className="m-menu__link " to="/explorepage">
									  		<i className=" m-menu__link-icon icon-directions"></i>
										 	<span className="m-menu__link-title">
											  	<span className="m-menu__link-wrap">
												  	<span className="m-menu__link-text">
													  	推荐
												  	</span>
											  	</span>
										  </span>
									  </NavLink>
								  </li>
								  <li className="m-menu__item  " aria-haspopup="true" >
									  <NavLink activeClassName="m-menu__item--active" className="m-menu__link " to="/posts">
									  		<i className=" m-menu__link-icon icon-camera"></i>
										 	<span className="m-menu__link-title">
											  	<span className="m-menu__link-wrap">
												  	<span className="m-menu__link-text">
													  	图片
												  	</span>
											  	</span>
										  </span>
									  </NavLink>
								  </li>
								  <li className="m-menu__item  " aria-haspopup="true" >
									  <NavLink activeClassName="m-menu__item--active" className="m-menu__link " to="/pages">
									  		<i className=" m-menu__link-icon icon-pencil"></i>
										 	<span className="m-menu__link-title">
											  	<span className="m-menu__link-wrap">
												  	<span className="m-menu__link-text">
													  	文章
												  	</span>
											  	</span>
										  </span>
									  </NavLink>
								  </li>
								  <li className="m-menu__item  " aria-haspopup="true" >
									  <NavLink activeClassName="m-menu__item--active" className="m-menu__link " to="/users">
									  		<i className=" m-menu__link-icon icon-users"></i>
										 	<span className="m-menu__link-title">
											  	<span className="m-menu__link-wrap">
												  	<span className="m-menu__link-text">
													  	用户
												  	</span>
											  	</span>
										  </span>
									  </NavLink>
								  </li>
								  <li className="m-menu__item  " aria-haspopup="true" >
									  <NavLink activeClassName="m-menu__item--active" className="m-menu__link " to="/toys">
									  		<i className=" m-menu__link-icon icon-rocket"></i>
										 	<span className="m-menu__link-title">
											  	<span className="m-menu__link-wrap">
												  	<span className="m-menu__link-text">
													  	玩具
												  	</span>
											  	</span>
										  </span>
									  </NavLink>
								  </li>
								  <li className="m-menu__item  m-menu__item--submenu" aria-haspopup="true"  data-menu-submenu-toggle="hover">
									  <a  href="#" className="m-menu__link m-menu__toggle">
										  <i className="m-menu__link-icon icon-basket"></i>
										  <span className="m-menu__link-text">
											  商家
										  </span>
										  <i className="m-menu__ver-arrow la la-angle-right"></i>
									  </a>
									  <div className="m-menu__submenu">
									  <span className="m-menu__arrow"></span>
										<ul className="m-menu__subnav">
											<li className="m-menu__item " aria-haspopup="true" >
												<NavLink  to="/skus" className="m-menu__link ">
													<i className="m-menu__link-bullet m-menu__link-bullet--dot">
														<span></span>
													</i>
													<span className="m-menu__link-text">
														商品
													</span>
												</NavLink>
											</li>
											<li className="m-menu__item " aria-haspopup="true" >
												<NavLink  to="/orders" className="m-menu__link ">
													<i className="m-menu__link-bullet m-menu__link-bullet--dot">
														<span></span>
													</i>
													<span className="m-menu__link-text">
														订单
													</span>
												</NavLink>
											</li>
											
										</ul>
								  	</div>
								  </li>
								  <li className="m-menu__item  " aria-haspopup="true" >
									  <NavLink activeClassName="m-menu__item--active" className="m-menu__link " to="/trades">
									  		<i className=" m-menu__link-icon icon-cup"></i>
										 	<span className="m-menu__link-title">
											  	<span className="m-menu__link-wrap">
												  	<span className="m-menu__link-text">
													  	二手交易
												  	</span>
											  	</span>
										  </span>
									  </NavLink>
								  </li>
								  <li className="m-menu__item  " aria-haspopup="true" >
									  <NavLink activeClassName="m-menu__item--active" className="m-menu__link " to="/tags">
									  		<i className=" m-menu__link-icon icon-tag"></i>
										 	<span className="m-menu__link-title">
											  	<span className="m-menu__link-wrap">
												  	<span className="m-menu__link-text">
													  标签
												  	</span>
											  	</span>
										  </span>
									  </NavLink>
								  </li>
								  <li className="m-menu__item  " aria-haspopup="true" >
									  <NavLink activeClassName="m-menu__item--active" className="m-menu__link " to="/stickers">
									  		<i className=" m-menu__link-icon icon-ghost"></i>
										 	<span className="m-menu__link-title">
											  	<span className="m-menu__link-wrap">
												  	<span className="m-menu__link-text">
													  贴纸
												  	</span>
											  	</span>
										  </span>
									  </NavLink>
								  </li>
								  <li className="m-menu__item  " aria-haspopup="true" >
									  <NavLink activeClassName="m-menu__item--active" className="m-menu__link " to="/tools">
									  		<i className=" m-menu__link-icon icon-wrench"></i>
										 	<span className="m-menu__link-title">
											  	<span className="m-menu__link-wrap">
												  	<span className="m-menu__link-text">
													  工具
												  	</span>
											  	</span>
										  </span>
									  </NavLink>
								  </li>
								  <li className="m-menu__item  " aria-haspopup="true" >
									  <NavLink activeClassName="m-menu__item--active" className="m-menu__link " to="/feedbacks">
									  		<i className=" m-menu__link-icon icon-info"></i>
										 	<span className="m-menu__link-title">
											  	<span className="m-menu__link-wrap">
												  	<span className="m-menu__link-text">
													  投诉
												  	</span>
											  	</span>
										  </span>
									  </NavLink>
								  </li>
							  </ul>
						  </div>
			  		</div>
					<div className="m-grid__item m-grid__item--fluid m-wrapper">
						<div className="m-content">
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

								<Route path="/post/:id" component={Post}/>
								<Route path="/tools" component={Tools}/>
								<Route path="/weekpage" component={PlayWeekPage}/>

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
		return (
			
			<div className="page-wrapper">
				<PlayMainHeader/>
				<PlayAliBaichuan/>
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

								<Route path="/post/:id" component={Post}/>
								<Route path="/tools" component={Tools}/>
								<Route path="/weekpage" component={PlayWeekPage}/>

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
