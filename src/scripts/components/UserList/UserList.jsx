import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
	Row, Form, FormGroup, FormControl, Button, InputGroup,
} from 'react-bootstrap'
import { Link } from 'react-router'
import Moment from 'moment'
import ReactPaginate from 'react-paginate'
import Select from 'react-select'
import Request from 'superagent'
import PlayAliBaichuan from '../Common/PlayAliBaichuan'

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
			this.context.router.push(`/user?page=${page}`)
			this.setState({filter,filterType})
		}else{
			this.props.getUser(this.props.location.query.page)
		}
	}
	_approve() {
		const { type,note,curId } = this.state
		this.props.approveUser(curId,type,note)
		this.setState({
			curId:'',note:'',dialogApprove:false
		})
	}
	renderAccounts(accounts) {
    return (
    	<span>
	      {
	      	accounts.map( (acc,i) => {
		        if (acc.providerID === "weibo") {
		          	return <a key={`acc_wb_${i}`} href={'http://weibo.com/'+acc.providerKey} style={{color:'#E71D34', marginRight: '5px'}}><i className="fa fa-weibo fa-lg"></i></a>
		        } else if (acc.providerID === "mobile") {
		          	return <a key={`acc_mb_${i}`} style={{color:'#55acee', marginRight: '5px'}}><i className="fa fa-mobile-phone fa-lg" title={acc.providerKey}  ></i></a>
		        } else if (acc.providerID === 'qq') {
		        	return <a key={`acc_qq_${i}`} style={{color:'rgb(21,167,240)', marginRight: '5px'}}><i className="fa fa-qq fa-lg"></i></a>
		        } else if (acc.providerID === 'wechat') {
		        	return <a key={`acc_wx_${i}`} style={{color:'rgb(73,190,56)', marginRight: '5px'}}><i className="fa fa-wechat fa-lg"></i></a>
		        }
	    	})
	      }
	    </span>
    )
	}
	_search() {
    const { filter, filterType } = this.state
		this.context.router.push(`/user?page=0`)
		this.props.getUserBy(filter.trim(),filterType)
	}
	_goPage(page) {
		this.context.router.push(`/user?page=${page}`)
		this.props.getUser(page)
	}
	render() {
		const { dialogApprove,note,type,filterType } = this.state
		const options = [
      { value: 'master', label: '达人玩家' },
      { value: 'custom', label: '代工定制' },
      { value: 'designer', label: '设计师' },
      { value: 'brand', label: '品牌商家' },
			{ value: 'media', label: 'KOL自媒体' }
    ]
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
            <thead><tr><th></th><th>用户名</th><th>照片数</th><th>绑定账号</th><th>最近登陆</th><th></th></tr></thead>
            <tbody>
              {this.props.users.map((user,index) => {
                return (
                  <tr key={`user-list_${user.id }`}>
                    <td>
                  	<div className="btn-group">
										  <img style={{width:'45px'}} src={user.avatar}  data-toggle="dropdown" className="img-circle"/>
										  <ul className="dropdown-menu">
										    <li><a onClick={() => this.context.router.push(`/user/${user.id}`)}>查看<small>({user.nickname})</small></a></li>
										    <li><a onClick={() => this.props.setTouid(user.id,user.avatar)}>私信</a></li>
										  </ul>
										</div>
                    </td>
                    <td> <Link to={`/user/${user.id}`}>{user.nickname} {user.approval ? <span style={{color:'gold'}} className="fa fa-vimeo"></span> :null} </Link></td>
                    <td>{user.counts.posts}</td>
                    <td>{this.renderAccounts(user.accounts)}</td>
                    <td>{Moment.unix(user.lastSeen / 1000).fromNow()}</td>
                    <td>
                    	<Button onClick={() => this.recommend(user.id)}>推荐</Button>
                    	<Button style={{marginLeft:'5px'}} onClick={() => this.setState({curId:user.id,dialogApprove:true})}>认证</Button>
                    </td>
                  </tr>
                );
              })}
              <tr></tr>
            </tbody>
          </table>
        </div>
        <Row style={{textAlign:'center'}}>
        	<ReactPaginate
        		previousLabel={<span>&laquo;</span>}
						nextLabel={<span>&raquo;</span>}
						breakLabel={<span>...</span>}
						breakClassName={"break-me"}
						pageCount={this.props.totalPages}
						marginPagesDisplayed={2}
						pageRangeDisplayed={5}
						onPageChange={obj => this.goPage(obj.selected)}
						containerClassName={"pagination"}
						subContainerClassName={"pages pagination"}
						forcePage={this.props.location.query.page ? parseInt(this.props.location.query.page) : 0}
						activeClassName={"active"} />
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
        <PlayAliBaichuan/>
    	</div>
		)
	}
}

UserList.contextTypes = {
  	router : PropTypes.object
}
