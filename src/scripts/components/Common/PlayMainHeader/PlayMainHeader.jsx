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
                            <li>
                                <a data-toggle="dropdown" style={{padding:'10px 15px 10px 20px'}}>
                                    <img style={{width:'30px',marginRight:10}} src={avatar}  data-toggle="dropdown" className="img-circle"/>
                                    <i className="fa fa-angle-down"></i>
                                </a>
                                <ul className="dropdown-menu">
                                    <li><a style={{color:'#999',padding:'5px 20px'}}><i className="fa fa-envelope"></i>{email}</a></li>
                                    <li><a style={{color:'#999',padding:'5px 20px'}}><i className="fa fa-user"></i>{nickName}</a></li>
                                </ul>
                            </li>
                            <li><a onClick={this.signOut}><i className="fa fa-sign-out"></i></a></li>
                        </ul>
                    </div>
                </nav>
            </div>
        )
    }
}