import React,{ Component } from 'react'
import { Link,NavLink } from 'react-router-dom'


export default class extends Component{
    render() {
        return(
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
        )
    }
}