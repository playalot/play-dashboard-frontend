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
			currentPage:'posts'
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
				<Row style={{marginBottom:20}}>
					<Col sm={4}>
						{
							user.id ?
							<div className="play-user-detail">
								<img style={{maxWidth:120}} className="img-circle" src={user.avatar} alt="User Avatar" />
								<h4 className="text-info"><strong>{ user.nickname }</strong></h4>
								<Row>
									<Col xs={4} className="border-right">
										<div className="description-block">
											<h4 className="text-primary"><strong>{user.counts.posts}</strong></h4>
											<strong className="description-text text-muted">图片</strong>
										</div>
									</Col>
									<Col xs={4} className="border-right">
										<div className="description-block">
											<h4 className="text-primary"><strong>{user.counts.followers}</strong></h4>
											<strong className="description-text text-muted">粉丝</strong>
										</div>
									</Col>
									<Col xs={4} className="border-right">
										<div className="description-block">
											<h4 className="text-primary"><strong>{user.counts.following}</strong></h4>
											<strong className="description-text text-muted">关注</strong>
										</div>
									</Col>
								</Row>
							</div>
							:null
						}
					</Col>
					<Col sm={8}>
						<div style={{backgroundColor:'white',padding:'20px 0'}}>
							<Row>
								<Col xsOffset={1} sm={3} className="sm-2-label">
									<strong>Approval</strong>
								</Col>
								<Col sm={8} style={{padding:'7px 20px'}}>
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
								</Col>
							</Row>
							<Row>
								<Col xsOffset={1} sm={3} className="sm-2-label">
									<strong>Level</strong>
								</Col>
								<Col sm={8} style={{padding:'7px 20px'}}>
									<span className="btn yellow-gold btn-xs btn-outline">LV {user.level}</span>
								</Col>
							</Row>
							<Row>
								<Col xsOffset={1} sm={3} className="sm-2-label">
									<strong>Gender</strong>
								</Col>
								<Col sm={8} style={{padding:'7px 20px'}}>
									<span>
										{
											user.gender === 'm' ?
											<i style={{color:'deepskyblue'}} className="fa fa-mars"></i>
											:<i style={{color:'pink'}} className="fa fa-venus"></i>
										}
									</span>
								</Col>
							</Row>
							<Row>
								<Col xsOffset={1} sm={3} className="sm-2-label">
									<strong>Accounts</strong>
								</Col>
								<Col sm={8} style={{padding:'7px 20px'}}>
									{
										user.id ?
										<PlayAccount accounts={user.accounts} />
										:<span></span>
									}
								</Col>
							</Row>
							<Row>
								<Col xsOffset={1} sm={3} className="sm-2-label">
									<strong>Introduction</strong>
								</Col>
								<Col sm={8} style={{padding:'7px 20px'}}>
									{ user.bio ? user.bio : '这家伙很懒' }
								</Col>
							</Row>
							<Row>
								<Col xsOffset={1} sm={3} className="sm-2-label">
									<strong>Active</strong>
								</Col>
								<Col sm={8} style={{padding:'7px 20px'}}>
									<button onClick={this.setActive} className="btn red btn-xs"><i className="fa fa-eye-slash">&nbsp;</i>{user.isActive?'ban':'activate'}</button>
								</Col>
							</Row>
						</div>
					</Col>
				</Row>
				<div>
					<ul className="play-tabs clearfix" style={{backgroundColor:'white'}}>
						<li onClick={() => this.setState({currentPage:'posts'})} className={currentPage === 'posts' ? 'active' : ''}>Posts</li>
						<li onClick={() => this.setState({currentPage:'pages'})} className={currentPage === 'pages' ? 'active' : ''}>Pages</li>
					</ul>
					{
						(() => {
							switch (currentPage) {
							case "posts":
								return (
									<div  style={{backgroundColor:'#f9f9f9'}}>
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
				</div>
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

