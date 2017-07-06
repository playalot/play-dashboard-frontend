import React,{ Component } from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, Modal, ButtonToolbar,FormControl } from 'react-bootstrap'
import CDN from '../../widgets/cdn'
import PostPanels from '../PostPanels'
import PagePanel from '../PagePanel'
import PlayAccount from '../Common/PlayAccount'
import Request from 'superagent'
export default class extends Component{
	constructor(props) {
		super(props)
		this.state = {
			userId:this.props.match.params.id,
			filter: '',
			dialogApprove:false,
			note:'',
			user:{},
			currentPage:'info'
		}
		this.setActive = this._setActive.bind(this)
		this.approve = this._approve.bind(this)
	}
	componentWillMount() {
		if(!this.props.classLoaded){
			this.props.fetchTagClass()
		}
		const { userId } = this.state 
		Request
            .get(`/api/user/${userId}`)
            .end((err,res) => {
				this.setState({
					user:res.body,
					type:res.body.verify ? res.body.verify.type : 'master'
				})
            })
		this.props.getUserPost(userId)
		this.props.getUserPage(userId)
	}
	componentWillUnmount() {
		this.props.clearPost()
		this.props.clearPage()
	}
	_approve() {
		const { userId,type,note } = this.state
		this.props.approveUser(userId,type,note)
		this.setState({
			note:'',dialogApprove:false
		})
	}
	_setActive() {
		if(this.props.user.isActive) {
			if (confirm('确定屏蔽这个用户吗?')) {
				this.props.setActive(this.state.userId)
			}
		}else {
			if (confirm('确定解除屏蔽吗?')) {
				this.props.setActive(this.state.userId)
			}
		}
		
	}
	render() {
		const { dialogApprove,note,type,currentPage,user } = this.state
		return (
			<div className="content">
				<Row>
					
				</Row>
				<Row>
					{
						user.id ?
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
						:null
					}
				</Row>
				<Row>
					<Col xs={12}>
						<ul className="play-tabs clearfix" style={{backgroundColor:'white'}}>
							<li onClick={() => this.setState({currentPage:'info'})} className={currentPage === 'info' ? 'active' : ''}>Info</li>
							<li onClick={() => this.setState({currentPage:'posts'})} className={currentPage === 'posts' ? 'active' : ''}>Posts</li>
							<li onClick={() => this.setState({currentPage:'pages'})} className={currentPage === 'pages' ? 'active' : ''}>Pages</li>
						</ul>
						{
							(() => {
								switch (currentPage) {
								case "info":
									return (
										<div style={{backgroundColor:'white',padding:10}}>
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
												<div className="col-sm-10" style={{padding:7}}>
													{
														type ?
														<span style={{marginRight:15}}>{type}</span>
														:null
													}
													<button onClick={() => this.setState({dialogApprove:true})} className="btn btn-xs green">
														{
															type ? '修改' : '添加'
														}
													</button>
												</div>
											</div>
											<div className="row">
												<div className="col-sm-2 sm-2-label">
													<b>Level</b>
												</div>
												<div className="col-sm-10" style={{padding:7}}>
													<span className="btn yellow-gold btn-xs btn-outline">LV {user.level}</span>
												</div>
											</div>
											<div className="row">
												<div className="col-sm-2 sm-2-label">
													<b>Gender</b>
												</div>
												<div className="col-sm-10" style={{padding:7}}>
													<span>
														{
															user.gender === 'm' ?
															<i style={{color:'deepskyblue'}} className="fa fa-mars"></i>
															:<i style={{color:'pink'}} className="fa fa-venus"></i>
														}
													</span>
												</div>
											</div>
											<div className="row">
												<div className="col-sm-2 sm-2-label">
													<b>Accounts</b>
												</div>
												<div className="col-sm-10" style={{padding:7}}>
													{
														user.id ?
														<PlayAccount accounts={user.accounts} />
														:<span></span>
													}
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
												<div className="col-sm-10" style={{padding:7}}>
													<button onClick={this.setActive} className="btn red btn-xs"><i className="fa fa-eye-slash">&nbsp;</i>{user.isActive?'ban':'activate'}</button>
												</div>
											</div>
										</div>
									);
								case "posts":
									return (
										<div  style={{backgroundColor:'white'}}>
											<PostPanels/>
										</div>

									)
								case "pages":
									return (
										<div>
											<PagePanel/>
										</div>

									)
								default: return null;
								}
							})()
						}
					</Col>
				</Row>
				{
					dialogApprove ?
					<div className="play-modal" onClick={() => this.setState({dialogApprove:false})}>
						<div className="play-dialog" onClick={e => e.stopPropagation()}>
							<p className="dialog-title">添加认证</p>
							<span onClick={() => this.setState({dialogApprove:false})} className="dialog-close">×</span>
							<div>
								<FormControl componentClass="select" value={type} onChange={e => this.setState({type:e.target.value})}>
									<option value="master">达人玩家</option>
									<option value="custom">代工定制</option>
									<option value="designer">设计师</option>
									<option value="brand">品牌商家</option>
									<option value="media">KOL自媒体</option>
								</FormControl>
								<h5 style={{marginTop:20}}>认证信息</h5>
								<input onChange={(e) => this.setState({note:e.target.value})} type="text" className="form-control" />
							</div>
							<div className="dialog-footer">
								<button className="btn btn-primary pull-right" onClick={this.approve}>添加</button>
							</div>
						</div>
					</div>
					: null
				}
			</div>
		)
	}
}

