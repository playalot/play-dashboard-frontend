import React, { Component } from 'react'
import { 
	Row, Form, FormGroup, FormControl, Button, InputGroup, 
} from 'react-bootstrap'
import { Link } from 'react-router'
import Moment from 'moment'
import ReactPaginate from 'react-paginate'
import PlayAliBaichuan from '../Common/PlayAliBaichuan'

export default class UserList extends Component{
	constructor(props) {
	  	super(props)
	
	  	this.state = {
	  		filter:''
	  	}
	  	this.onChangeQuery = (e) => this.setState({filter:e.target.value})
	  	this.recommend = (id) => this.props.recommendUser(id)
	  	this.approve = this._approve.bind(this)

	  	this.search = this._search.bind(this)
	  	this.goPage = this._goPage.bind(this)
	}
	componentWillMount() {
		const { page,filter } = this.props
		if(typeof page === 'number') {
			this.context.router.push(`/user?page=${page}`)
			this.setState({filter})
		}else{
			this.props.getUser(this.props.location.query.page)
		}
	}
	_approve(id) {
		let txt = prompt('输入认证信息')
		if (txt) {
			this.props.approveUser(id,txt)
		}
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
	_search() {
		this.context.router.push(`/user?page=0`)
		this.props.getUserBy(this.state.filter.trim())
	}
	_goPage(page) {
		this.context.router.push(`/user?page=${page}`)
		this.props.getUser(page)
	}
	render() {
		return(
			<div className="content">
	          <div className="page-header">
	            <Form inline onSubmit={(e) => e.preventDefault()}>
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
	                      <td>{user.nickname} {user.approval ? <span style={{color:'gold'}} className="fa fa-vimeo"></span> :null} </td>
	                      <td>{user.counts.posts}</td>
	                      <td>{this.renderAccounts(user.accounts)}</td>
	                      <td>{Moment.unix(user.lastSeen / 1000).fromNow()}</td>
	                      <td>
	                      	<Button onClick={() => this.recommend(user.id)}>推荐</Button>
	                      	<Button style={{marginLeft:'5px'}} onClick={() => this.approve(user.id)}>认证</Button>
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
	          <PlayAliBaichuan/>
          	</div>

		)
	}
}

UserList.contextTypes = {
  	router : React.PropTypes.object
}
