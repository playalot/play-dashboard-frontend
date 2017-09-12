import React,{ Component } from 'react'
import { Link } from 'react-router-dom'
import Request from 'superagent'
export default class extends Component {
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
            <header className="m-grid__item m-header "  data-minimize-mobile="hide" data-minimize-offset="200" data-minimize-mobile-offset="200" data-minimize="minimize" >
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
                            <div id="m_header_menu" className="m-header-menu m-aside-header-menu-mobile m-aside-header-menu-mobile--offcanvas  m-header-menu--skin-light m-header-menu--submenu-skin-light m-aside-header-menu-mobile--skin-dark m-aside-header-menu-mobile--submenu-skin-dark "  >
                                <ul className="m-menu__nav  m-menu__nav--submenu-arrow ">
                                    <li className="m-menu__item  m-menu__item--submenu m-menu__item--rel"  data-menu-submenu-toggle="click" aria-haspopup="true">
                                        <a  href="#" className="m-menu__link m-menu__toggle">
                                            <i className="m-menu__link-icon flaticon-add"></i>
                                            <span className="m-menu__link-text">
                                                Actions
                                            </span>
                                            <i className="m-menu__hor-arrow la la-angle-down"></i>
                                            <i className="m-menu__ver-arrow la la-angle-right"></i>
                                        </a>
                                        <div className="m-menu__submenu m-menu__submenu--classic m-menu__submenu--left">
                                            <span className="m-menu__arrow m-menu__arrow--adjust"></span>
                                            <ul className="m-menu__subnav">
                                                <li className="m-menu__item "  aria-haspopup="true">
                                                    <Link  to="/video/edit" className="m-menu__link ">
                                                        <i className="m-menu__link-icon icon-camcorder"></i>
                                                        <span className="m-menu__link-text">
                                                            发布视频
                                                        </span>
                                                    </Link>
                                                </li>
                                                <li className="m-menu__item "  aria-haspopup="true">
                                                    <Link  to="/page/edit" className="m-menu__link ">
                                                        <i className="m-menu__link-icon icon-book-open"></i>
                                                        <span className="m-menu__link-text">
                                                            发布文章
                                                        </span>
                                                    </Link>
                                                </li>
                                                <hr/>
                                                <li className="m-menu__item "  data-redirect="true" aria-haspopup="true">
                                                    <a  href="header/actions.html" className="m-menu__link ">
                                                        <i className="m-menu__link-icon flaticon-diagram"></i>
                                                        <span className="m-menu__link-title">
                                                            <span className="m-menu__link-wrap">
                                                                <span className="m-menu__link-text">
                                                                    Generate Reports
                                                                </span>
                                                                <span className="m-menu__link-badge">
                                                                    <span className="m-badge m-badge--success">
                                                                        2
                                                                    </span>
                                                                </span>
                                                            </span>
                                                        </span>
                                                    </a>
                                                </li>
                                                <li className="m-menu__item  m-menu__item--submenu"  data-menu-submenu-toggle="hover" aria-haspopup="true">
                                                    <a  href="#" className="m-menu__link m-menu__toggle">
                                                        <i className="m-menu__link-icon flaticon-business"></i>
                                                        <span className="m-menu__link-text">
                                                            Manage Orders
                                                        </span>
                                                        <i className="m-menu__hor-arrow la la-angle-right"></i>
                                                        <i className="m-menu__ver-arrow la la-angle-right"></i>
                                                    </a>
                                                    <div className="m-menu__submenu m-menu__submenu--classic m-menu__submenu--right">
                                                        <span className="m-menu__arrow "></span>
                                                        <ul className="m-menu__subnav">
                                                            <li className="m-menu__item "  data-redirect="true" aria-haspopup="true">
                                                                <a  href="header/actions.html" className="m-menu__link ">
                                                                    <span className="m-menu__link-text">
                                                                        Latest Orders
                                                                    </span>
                                                                </a>
                                                            </li>
                                                            <li className="m-menu__item "  data-redirect="true" aria-haspopup="true">
                                                                <a  href="header/actions.html" className="m-menu__link ">
                                                                    <span className="m-menu__link-text">
                                                                        Pending Orders
                                                                    </span>
                                                                </a>
                                                            </li>
                                                            <li className="m-menu__item "  data-redirect="true" aria-haspopup="true">
                                                                <a  href="header/actions.html" className="m-menu__link ">
                                                                    <span className="m-menu__link-text">
                                                                        Processed Orders
                                                                    </span>
                                                                </a>
                                                            </li>
                                                            <li className="m-menu__item "  data-redirect="true" aria-haspopup="true">
                                                                <a  href="header/actions.html" className="m-menu__link ">
                                                                    <span className="m-menu__link-text">
                                                                        Delivery Reports
                                                                    </span>
                                                                </a>
                                                            </li>
                                                            <li className="m-menu__item "  data-redirect="true" aria-haspopup="true">
                                                                <a  href="header/actions.html" className="m-menu__link ">
                                                                    <span className="m-menu__link-text">
                                                                        Payments
                                                                    </span>
                                                                </a>
                                                            </li>
                                                            <li className="m-menu__item "  data-redirect="true" aria-haspopup="true">
                                                                <a  href="header/actions.html" className="m-menu__link ">
                                                                    <span className="m-menu__link-text">
                                                                        Customers
                                                                    </span>
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </li>
                                                <li className="m-menu__item  m-menu__item--submenu"  data-menu-submenu-toggle="hover" aria-haspopup="true">
                                                    <a  href="#" className="m-menu__link m-menu__toggle">
                                                        <i className="m-menu__link-icon flaticon-chat-1"></i>
                                                        <span className="m-menu__link-text">
                                                            Customer Feedbacks
                                                        </span>
                                                        <i className="m-menu__hor-arrow la la-angle-right"></i>
                                                        <i className="m-menu__ver-arrow la la-angle-right"></i>
                                                    </a>
                                                    <div className="m-menu__submenu m-menu__submenu--classic m-menu__submenu--right">
                                                        <span className="m-menu__arrow "></span>
                                                        <ul className="m-menu__subnav">
                                                            <li className="m-menu__item "  data-redirect="true" aria-haspopup="true">
                                                                <a  href="header/actions.html" className="m-menu__link ">
                                                                    <span className="m-menu__link-text">
                                                                        Customer Feedbacks
                                                                    </span>
                                                                </a>
                                                            </li>
                                                            <li className="m-menu__item "  data-redirect="true" aria-haspopup="true">
                                                                <a  href="header/actions.html" className="m-menu__link ">
                                                                    <span className="m-menu__link-text">
                                                                        Supplier Feedbacks
                                                                    </span>
                                                                </a>
                                                            </li>
                                                            <li className="m-menu__item "  data-redirect="true" aria-haspopup="true">
                                                                <a  href="header/actions.html" className="m-menu__link ">
                                                                    <span className="m-menu__link-text">
                                                                        Reviewed Feedbacks
                                                                    </span>
                                                                </a>
                                                            </li>
                                                            <li className="m-menu__item "  data-redirect="true" aria-haspopup="true">
                                                                <a  href="header/actions.html" className="m-menu__link ">
                                                                    <span className="m-menu__link-text">
                                                                        Resolved Feedbacks
                                                                    </span>
                                                                </a>
                                                            </li>
                                                            <li className="m-menu__item "  data-redirect="true" aria-haspopup="true">
                                                                <a  href="header/actions.html" className="m-menu__link ">
                                                                    <span className="m-menu__link-text">
                                                                        Feedback Reports
                                                                    </span>
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </li>
                                                <li className="m-menu__item "  data-redirect="true" aria-haspopup="true">
                                                    <a  href="header/actions.html" className="m-menu__link ">
                                                        <i className="m-menu__link-icon flaticon-users"></i>
                                                        <span className="m-menu__link-text">
                                                            Register Member
                                                        </span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div id="m_header_topbar" className="m-topbar  m-stack m-stack--ver m-stack--general">
                                <div className="m-stack__item m-topbar__nav-wrapper">
                                    <ul className="m-topbar__nav m-nav m-nav--inline">
                                        <li className="m-nav__item m-topbar__user-profile m-topbar__user-profile--img  m-dropdown m-dropdown--medium m-dropdown--arrow m-dropdown--header-bg-fill m-dropdown--align-right m-dropdown--mobile-full-width m-dropdown--skin-light" data-dropdown-toggle="click">
                                            <a href="/" className="m-nav__link m-dropdown__toggle">
                                                <span className="m-topbar__userpic">
                                                    <img src={avatar} className="m--img-rounded m--marginless m--img-centered" alt=""/>
                                                </span>
                                            </a>
                                            <div className="m-dropdown__wrapper">
                                                <div className="m-dropdown__inner">
                                                    <div className="m-dropdown__header m--align-center" style={{background:avatar, backgroundSize: 'cover'}}>
                                                        <div className="m-card-user m-card-user--skin-dark">
                                                            <div className="m-card-user__pic">
                                                                <img src={avatar} className="m--img-rounded m--marginless" alt=""/>
                                                            </div>
                                                            <div className="m-card-user__details">
                                                                <span className="m-card-user__name m--font-weight-500">
                                                                    {nickName}
                                                                </span>
                                                                <a href="" className="m-card-user__email m--font-weight-300 m-link">
                                                                    {email}
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
                                                                    <a onClick={this.signOut} className="btn m-btn--pill    btn-secondary m-btn m-btn--custom m-btn--label-brand m-btn--bolder">
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
        )
    }
}