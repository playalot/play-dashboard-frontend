import React,{ Component } from 'react'

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
            <div className="page-header navbar navbar-fixed-top">
                <div className="page-header-inner ">
                    <div className="page-logo">
                        <a href="#">
                            <img style={{maxWidth:86,filter:'invert(1)'}} className="logo-default" src="http://www.playalot.cn/assets/images/a64ada1d3b0ec825a0ba1d9fc4dee6c3-nav_lg.png" alt=""/>
                        </a>
                        <div className="menu-toggler sidebar-toggler">
                            <span></span>
                        </div>
                    </div>
                    <a href="javascript:;" className="menu-toggler responsive-toggler" data-toggle="collapse" data-target=".navbar-collapse">
                        <span></span>
                    </a>
                    <div className="top-menu">
                        <ul className="nav navbar-nav pull-right">
                            <li className="dropdown dropdown-user">
                                <a href="javascript:;" className="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
                                    <img alt="" className="img-circle" src={avatar} />
                                    <span className="username username-hide-on-mobile">{nickName}</span>
                                    <i className="fa fa-angle-down"></i>
                                </a>
                                <ul className="dropdown-menu dropdown-menu-default">
                                    <li>
                                        <a>
                                            <i className="fa fa-envelope"></i> {email}
                                        </a>
                                    </li>
                                    <li className="divider"> </li>
                                    <li>
                                        <a onClick={this.signOut}>
                                            <i className="fa fa-key"></i> Log Out </a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}