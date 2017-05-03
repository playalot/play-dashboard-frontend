import React,{ Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
export default class App extends Component{
	constructor(props) {
	  	super(props)
	  	this.state = {}
	  	this.signOut = () => {
	  		if(confirm('确定登出吗?')){
	  			
	  		}
	  	}
	}
	componentWillMount() {
		if(!this.props.loaded) {
			this.props.fetchInfo()
		}
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
		                <li className="dropdown user-menu messages-menu">
		                  <ul className="dropdown-menu">
		                    <li className="header">Select a fake user <span className="btn btn-sm" ><i className="fa fa-plus"></i></span></li>
		                    <li>
		                    </li>
		                  </ul>
		                </li>
		                <li><a  style={{borderLeft:'none'}}>{email}</a></li>
		                <li>
		                  <a onClick={this.signOut}><i className="fa fa-sign-out"></i></a>
		                </li>
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
		              <li><Link to="/home" activeClassName="active"><i className="fa fa-dashboard"></i><span>概况</span></Link></li>
		              <li>
		                <a href="#">
		                  <i className="fa fa-calendar-plus-o"></i>
		                  <span>推荐</span>
		                  <i className="fa fa-angle-left pull-right"></i>
		                </a>
		                <ul className="treeview-menu" style={{top:43}}>
		                  <li><Link to="/recommendhome" activeClassName="active"><i className="fa fa-circle-o"></i><span>首页推荐管理</span></Link></li>
		                  <li><Link to="/explorepage" activeClassName="active"><i className="fa fa-circle-o"></i><span>发现页管理</span></Link></li>
		                </ul>
		              </li>
		              <li><Link to="/post" activeClassName="active"><i className="fa fa-camera"></i><span>图片</span></Link></li>
		              <li><Link to="/page" activeClassName="active"><i className="fa fa-edit"></i><span>文章</span></Link></li>
		              <li><Link to="/user" activeClassName="active"><i className="fa fa-users"></i><span>用户</span></Link></li>
		              <li><Link to="/toy" activeClassName="active"><i className="fa fa-rocket"></i><span>玩具</span></Link></li>
		              <li>
		                <a href="#">
		                  <i className="fa fa-shopping-cart"></i>
		                  <span>商家</span>
		                  <i className="fa fa-angle-left pull-right"></i>
		                </a>
		                <ul className="treeview-menu" style={{top:43}}>
		                  <li><Link to="/sku" activeClassName="active"><i className="fa fa-circle-o"></i><span>商品</span></Link></li>
		                  <li><Link to="/order" activeClassName="active"><i className="fa fa-circle-o"></i><span>订单</span></Link></li>
		                </ul>
		              </li>
		              <li><Link to="/trade" activeClassName="active"><i className="fa fa-handshake-o"></i><span>二手交易</span></Link></li>
					  
					  <li><Link to="/tag" activeClassName="active"><i className="fa fa-tags"></i><span>标签</span></Link></li>
		              <li><Link to="/sticker" activeClassName="active"><i className="fa fa-paw"></i><span>贴纸</span></Link></li>
		              <li><Link to="/notification" activeClassName="active"><i className="fa fa-volume-up"></i><span>推送</span></Link></li>
		              <li><Link to="/tools" activeClassName="active"><i className="fa fa-wrench"></i><span>工具</span></Link></li>
		              <li>
		                <a href="#">
		                  <i className="fa fa-info-circle"></i>
		                  <span>投诉</span>
		                  <i className="fa fa-angle-left pull-right"></i>
		                </a>
		                <ul className="treeview-menu" style={{top:43}}>
		                  <li><Link to="/report" activeClassName="active"><i className="fa fa-circle-o"></i><span>举报</span></Link></li>
		                  <li><Link to="/feedback" activeClassName="active"><i className="fa fa-circle-o"></i><span>反馈</span></Link></li>
		                </ul>
		              </li>
		            </ul>
		          </section>
		        </div>

		        <div className="content-wrapper">
		          {this.props.children}
		        </div>

		        <footer className="main-footer">
		          <div className="pull-right hidden-xs">
		            {'version 1.0.0'}
		          </div>
		          Copyright &copy; 2015 Play Co. Ltd All rights reserved.
		        </footer>

		        <aside className="control-sidebar control-sidebar-dark">
		          <ul className="nav nav-tabs nav-justified control-sidebar-tabs">
		            <li className="active"><a href="#control-sidebar-home-tab" data-toggle="tab"><i className="fa fa-user"></i></a></li>
		            <li><a href="#control-sidebar-settings-tab" data-toggle="tab"><i className="fa fa-gears"></i></a></li>
		          </ul>
		          <div className="tab-content">
		            <div className="tab-pane active" id="control-sidebar-home-tab">
		              <h3 className="control-sidebar-heading">Fake user info</h3>
		              <a href="/signIn">测试登录入口</a>
		            </div>
		            <div className="tab-pane" id="control-sidebar-stats-tab">Stats Tab Content</div>
		            <div className="tab-pane" id="control-sidebar-settings-tab">
		              <form method="post">
		                <h3 className="control-sidebar-heading">General Settings</h3>
		                <div className="form-group">
		                  <label className="control-sidebar-subheading">
		                    Report panel usage
		                  </label>
		                  <p>Some information about this general settings option</p>
		                </div>
		              </form>
		            </div>
		          </div>
		        </aside>
		        <div className="control-sidebar-bg"></div>
		    </div>
		)
	}
}
App.propTypes = {
  	children: PropTypes.element.isRequired
}
