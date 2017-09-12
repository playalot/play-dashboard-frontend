import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
	Row, Form, FormGroup, FormControl, Button, InputGroup,
} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Moment from 'moment'
import ReactPaginate from 'react-paginate'
import Request from 'superagent'
import PlayAccount from '../Common/PlayAccount'
import { parsePage } from '../../widgets/parse'

export default class UserList extends Component{
	constructor(props) {
  	super(props)

  	this.state = {
  		filter:'',
      filterType:'',
  		dialogApprove:false,
  		type:'master',
  		note:'',
  		curId:''
  	}
  	this.onChangeQuery = (e) => this.setState({filter:e.target.value})
  	this.recommend = (id) => this.props.recommendUser(id)
  	this.approve = this._approve.bind(this)

  	this.search = this._search.bind(this)
  	this.goPage = this._goPage.bind(this)
	}
	componentWillMount() {
		const { page,filter,filterType } = this.props
		if(typeof page === 'number') {
			this.props.history.push(`/users?page=${page}`)
			this.setState({filter,filterType})
		}else{
			const ppage = parsePage(this.props.location.search)
			this.goPage(ppage)
		}
	}
	_approve() {
		const { type,note,curId } = this.state
		this.props.approveUser(curId,type,note)
		this.setState({
			curId:'',note:'',dialogApprove:false
		})
	}
	_search() {
    const { filter, filterType } = this.state
		this.props.history.push(`/users?page=0`)
		this.props.getUserBy(filter.trim(),filterType)
	}
	_goPage(page) {
		this.props.history.push(`/users?page=${page}`)
		this.props.getUser(page)
	}
	render() {
		const { dialogApprove,note,type,filterType } = this.state
		return(
			<div className="content">
        <div className="page-header">
          <Form inline onSubmit={(e) => e.preventDefault()}>
            <FormGroup>
              <FormControl componentClass="select" value={filterType} onChange={(e) => this.setState({filterType:e.target.value},() => this.search())}>
                <option value="">全部</option>
                <option value="master">达人玩家</option>
                <option value="custom">代工定制</option>
                <option value="designer">设计师</option>
                <option value="brand">品牌</option>
              </FormControl>
            </FormGroup>
            {' '}
            <FormGroup>
              <InputGroup>
                <FormControl type="text" placeholder='搜索用户名或手机号' value={this.state.filter} onKeyDown={e => e.keyCode === 13 && this.search()} onChange={this.onChangeQuery} />
                <InputGroup.Button>
                  <Button onClick={this.search}>搜索</Button>
                </InputGroup.Button>
              </InputGroup>
            </FormGroup>
          </Form>
        </div>
        <div className="table-responsive" style={{paddingBottom:50}}>
          <table className="table table-striped">
            <thead><tr><th></th><th>用户名</th><th>等级</th><th>照片数</th><th>点赞数</th><th>绑定账号</th><th>所在地</th><th>最近登陆</th><th></th></tr></thead>
            <tbody>
              {this.props.users.map((user,index) => {
                return (
                  <tr key={`user-list_${user.id }`}>
                    <td>
                  	<div className="btn-group">
										  <img className="avatar45" src={user.avatar}  data-toggle="dropdown"/>
										  <ul className="dropdown-menu">
										    <li><a onClick={() => this.props.history.push(`/user/${user.id}`)}>查看<small>({user.nickname})</small></a></li>
										    <li><a onClick={() => this.props.setTouid(user.id,user.avatar)}>私信</a></li>
										  </ul>
										</div>
                    </td>
                    <td> <Link to={`/user/${user.id}`}>{user.nickname} {user.approval ? <span style={{color:'gold'}} className="fa fa-vimeo"></span> :null} </Link></td>
                    <td>Lv.{user.level}</td>
                    <td>{user.counts.posts}</td>
                    <td>{user.counts.likes}</td>
                    <td>
											<PlayAccount accounts={user.accounts} />
										</td>
                    <td>{user.location ? `${user.location.province}-${user.location.city}` : ''}</td>
                    <td>{Moment.unix(user.lastSeen / 1000).fromNow()}</td>
                    <td>
                    	<button className="btn btn-primary green btn-outline" style={{marginLeft:'5px'}} onClick={() => this.setState({curId:user.id,dialogApprove:true})}>加认证</button>
                    </td>
                  </tr>
                );
              })}
              <tr></tr>
            </tbody>
          </table>
        </div>
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
						forcePage={parsePage(this.props.location.search)}
						activeClassName={"active"} />
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

UserList.contextTypes = {
  	router : PropTypes.object
}
