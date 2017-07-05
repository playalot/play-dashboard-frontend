import React,{ Component } from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, Modal, Tab, Tabs, ButtonToolbar } from 'react-bootstrap'
const _ = require('lodash')
import Select from 'react-select'

import CDN from '../../widgets/cdn'
import PostPanels from '../PostPanels'
import PagePanel from '../PagePanel'
export default class extends Component{
	constructor(props) {
		super(props)
		this.state = {
				userId:this.props.match.params.id,
				filter: '',
				dialogApprove:false,
				type:'master',
				note:'',
		}

		this.setActive = this._setActive.bind(this)
		this.approve = this._approve.bind(this)
	}
	componentWillMount() {
		if(!this.props.classLoaded){
				this.props.fetchTagClass()
		}
		const { userId } = this.state 
		this.props.fetchUserInfo(userId)
		this.props.getUserPost(userId)
		this.props.getUserPage(userId)
	}
	componentWillUnmount() {
		this.props.clearPost()
		this.props.clearPage()
	}
	_approve() {
		const { id } = this.props.user
		const { type,note } = this.state
		this.props.approveUser(id,type,note)
		this.setState({
			note:'',dialogApprove:false
		})
	}
	renderAccounts(accounts) {
		return (
			<span>
				{
					accounts.map( acc => {
						if (acc.providerID === "weibo") {
								return <a href={'http://weibo.com/'+acc.providerKey} style={{color:'#E71D34', marginRight: '5px'}}><i className="fa fa-weibo fa-lg"></i></a>
						} else if (acc.providerID === "mobile") {
								return <a style={{color:'#55acee', marginRight: '5px'}}><i className="fa fa-mobile-phone fa-lg" title={acc.providerKey}  ></i></a>
						} else if (acc.providerID === 'qq') {
							return <a style={{color:'rgb(21,167,240)', marginRight: '5px'}}><i className="fa fa-qq fa-lg"></i></a>
						} else if (acc.providerID === 'wechat') {
							return <a style={{color:'rgb(73,190,56)', marginRight: '5px'}}><i className="fa fa-wechat fa-lg"></i></a>
						}
				})
				}
			</span>
		)
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
		const { user } = this.props
		const { dialogApprove,note,type } = this.state
		const options = [
      { value: 'master', label: '达人玩家' },
      { value: 'custom', label: '代工定制' },
      { value: 'designer', label: '设计师' },
      { value: 'brand', label: '品牌商家' },
			{ value: 'media', label: 'KOL自媒体' }
    ]
		return (
			<div className="content">
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
					<Col className="col" xs={12} sm={12} lg={12}>
						<Tabs defaultActiveKey={1} className="nav-tabs-custom">
							<Tab eventKey={1} title="Posts">
								<Row>
									<PostPanels openImage={this.openImage} openClass={this.openClass}/>
								</Row>
							</Tab>
							<Tab eventKey={2} title="Pages">
								<PagePanel></PagePanel>
							</Tab>
							<Tab eventKey={3} title="Info">
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
									<div className="col-sm-10" style={{padding:7,fontSize:12}}>
										<span className="label label-info">{user.approval}</span>
										<span className="btn btn-sm"  style={{marginLeft:'5px'}} onClick={() => this.setState({dialogApprove:true})}><i className="fa fa-edit"></i></span>
									</div>
								</div>
								<div className="row">
									<div className="col-sm-2 sm-2-label">
										<b>Level</b>
									</div>
									<div className="col-sm-10" style={{padding:7,fontSize:12}}>
										<span className="label label-warning">lv{user.level}</span>
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
										<span>{user.id && this.renderAccounts(user.accounts)}</span>
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
									<div className="col-sm-10">
										<button onClick={this.setActive} className="btn btn-danger"><i className="fa fa-eye-slash">&nbsp;</i>{user.isActive?'ban':'activate'}</button>
									</div>
								</div>
							</Tab>
						</Tabs>
					</Col>
				</Row>
				{
					dialogApprove ?
					<div className="play-modal">
						<div className="play-dialog">
							<p className="dialog-title">添加认证</p>
							<span onClick={() => this.setState({dialogApprove:false})} className="dialog-close">×</span>
							<div>
								<Select
									name="form-field-name"
									value={type}
									options={options}
									clearable={false}
									onChange={(newValue) => this.setState({type:newValue.value})}
								/>
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

