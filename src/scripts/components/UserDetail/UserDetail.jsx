import React,{ Component } from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, Modal, ButtonToolbar,FormControl } from 'react-bootstrap'
import CDN from '../../widgets/cdn'
import PostPanels from '../PostPanels'
import PagePanel from '../PagePanel'
import PlayAccount from '../Common/PlayAccount'
import Request from 'superagent'
import ReactPaginate from 'react-paginate'


export default class extends Component{
	constructor(props) {
		super(props)
		this.state = {
			userId:this.props.match.params.id,
			filter: '',
			dialogApprove:false,
			note:'',
			type:'master',
			user:{},
			currentPage:'posts',
			postPage:0,
			replyContent:'',
		}
		this.setActive = this._setActive.bind(this)
		this.approve = this._approve.bind(this)
		this.goPage = this._goPage.bind(this)
		this.sendReply = this._sendReply.bind(this)
		this.showReplyModal = () => {
			$('#replyModal').modal('show')
		}
		this.zhuxiao = this._zhuxiao.bind(this)
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
	componentDidMount() {
		$('#replyModal').on('hidden.bs.modal', (e) => {
			this.setState({
				replyContent:''
			})
		})
	}
	_approve() {
		const { userId,note,type } = this.state
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
	_goPage(postPage) {
		this.setState({ postPage })
		this.props.getUserPost(this.state.userId,postPage)
	}
	_sendReply() {
		const { replyContent,userId } = this.state
		Request.post(`/api/user/${userId}/reply`)
		.send({
			content:replyContent
		})
		.end((err,res) => {
			if(err) {
				Toastr.error(`通知失败。`)
			}else{
				Toastr.success(`已通知～`)
				$('#replyModal').modal('hide')
			}
		})
	}
	_zhuxiao() {
		if (confirm('确定注销吗?')) {
			Request.post(`/api/user/${this.state.userId}/remove`)
			.end((err,res) => {
				if(err) {
					Toastr.error(`注销用户失败。`)
				}else{
					Toastr.success(`注销用户成功`)
				}
			})
		}
	}
	render() {
		const { dialogApprove,note,type } = this.state
		const { user } = this.props
		return (
			<div>
				<div className="row p-3">
					<div className="col-sm-4 bg-white p-3">
						{
							user.id ?
							<div className="d-flex flex-column align-items-center">
								<img className="avatar120" src={user.avatar} alt="User Avatar" />
								<h4 className="text-info my-3"><strong>{ user.nickname }</strong></h4>
								<div className="row">
									<div className="col-4 text-center">
										<h4 className="text-primary"><strong>{user.counts.posts}</strong></h4>
										<strong className="text-muted">图片</strong>
									</div>
									<div className="col-4 text-center">
										<h4 className="text-primary"><strong>{user.counts.followers}</strong></h4>
										<strong className="text-muted">粉丝</strong>
									</div>
									<div className="col-4 text-center">
										<h4 className="text-primary"><strong>{user.counts.following}</strong></h4>
										<strong className="text-muted">关注</strong>
									</div>
								</div>
							</div>
							:null
						}
					</div>
					<div className="col-sm-8 bg-white ml-auto p-3">
						<div className="row">
							<label className="col-3 col-form-label font-weight-bold">Approval</label>
							<div className=" col-9 d-flex align-items-center">
								{
									user.verify && user.verify.type ?
									<span style={{marginRight:15}}>{user.verify.type}</span>
									:null
								}
								<button onClick={() => this.setState({dialogApprove:true})} className="btn btn-sm btn-success">
									{
										user.verify && user.verify.type ? '修改' : '添加'
									}
								</button>
							</div>
						</div>
						<div className="row">
							<label className="col-3 col-form-label font-weight-bold">Level</label>
							<div className=" col-9 d-flex align-items-center">
								<span className="badge badge-warning text-white">LV {user.level}</span>
							</div>
						</div>
						<div className="row">
							<label className="col-3 col-form-label font-weight-bold">Gender</label>
							<div className=" col-9 d-flex align-items-center">
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
							<label className="col-3 col-form-label font-weight-bold">Accounts</label>
							<div className=" col-9 d-flex align-items-center">
								{
									user.id ?
									<PlayAccount accounts={user.accounts} />
									:<span></span>
								}
							</div>
						</div>
						<div className="row">
							<label className="col-3 col-form-label font-weight-bold">Introduction</label>
							<div className=" col-9 d-flex align-items-center">
								{ user.bio ? user.bio : '这家伙很懒' }
							</div>
						</div>
						<div className="row">
							<label className="col-3 col-form-label font-weight-bold">Chat</label>
							<div className=" col-9 d-flex align-items-center">
								<button className="btn btn-sm btn-primary mr-1" onClick={() => this.props.setTouid(user.id,user.avatar)}>私信</button>
								<button className="btn btn-sm btn-primary" onClick={this.showReplyModal}>通知</button>
							</div>
						</div>
						<div className="row">
							<label className="col-3 col-form-label font-weight-bold">Active</label>
							<div className=" col-9 d-flex align-items-center">
								<button onClick={this.setActive} className="btn btn-sm btn-warning mr-1"><i className="fa fa-eye-slash">&nbsp;</i>{user.isActive?'ban':'activate'}</button>
								<button onClick={this.zhuxiao} className="btn btn-sm btn-danger">注销</button>
							</div>
						</div>
					</div>
				</div>
				<div className="bg-white p-3">
					<div className="d-flex justify-content-end align-items-center">
						<ul style={{borderBottom:'transparent'}} className="nav nav-tabs m-tabs-line m-tabs-line--2x m-tabs-line--info" role="tablist">
							<li className="nav-item m-tabs__item">
								<a className="nav-link m-tabs__link active" data-toggle="tab" href="#user_posts" role="tab">
									图片
								</a>
							</li>
							<li className="nav-item m-tabs__item">
								<a className="nav-link m-tabs__link" data-toggle="tab" href="#user_pages" role="tab">
									文章
								</a>
							</li>
						</ul>
					</div>
					<div className="tab-content">
						<div className="tab-pane active" id="user_posts" role="tabpanel">
							<PostPanels/>
							<ReactPaginate 
								previousLabel={<span>&laquo;</span>}
								nextLabel={<span>&raquo;</span>}
								breakLabel={<a>...</a>}
								breakClassName={"break-me"}
								pageCount={this.props.totalPages}
								marginPagesDisplayed={2}
								pageRangeDisplayed={5}
								onPageChange={obj => this.goPage(obj.selected)}
								containerClassName={"pagination"}
								subContainerClassName={"pages pagination"}
								forcePage={this.state.postPage}
								activeClassName={"active"} />
						</div>
						<div className="tab-pane" id="user_pages" role="tabpanel">
							<PagePanel/>
						</div>
					</div>
				</div>
				{
					dialogApprove ?
					<div className="play-modal" onClick={() => this.setState({dialogApprove:false})}>
						<div className="play-dialog" onClick={e => e.stopPropagation()}>
							<p className="dialog-title">添加认证</p>
							<span onClick={() => this.setState({dialogApprove:false})} className="dialog-close">×</span>
							<div>
								<select className="form-control" value={type} onChange={e => this.setState({type:e.target.value})}>
									<option value="master">达人玩家</option>
									<option value="custom">代工定制</option>
									<option value="designer">设计师</option>
									<option value="brand">品牌商家</option>
									<option value="media">KOL自媒体</option>
								</select>
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
				<div className="modal fade" id="replyModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
					<div className="modal-dialog" role="document">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title" id="exampleModalLabel">通知内容</h5>
									<button type="button" className="close" data-dismiss="modal" aria-label="Close">
									<span aria-hidden="true">&times;</span>
								</button>
							</div>
							<div className="modal-body">
								<textarea value={this.state.replyContent} onChange={(e) => this.setState({replyContent:e.target.value})} className="w-100" name="" id="" cols="30" rows="5"></textarea>
							</div>
							<div className="modal-footer">
								<button onClick={this.sendReply} type="button" className="btn btn-outline-primary">发送</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

