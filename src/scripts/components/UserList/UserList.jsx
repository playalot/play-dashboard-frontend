import React, { Component } from 'react'
import { 
	Row, Form, FormGroup, FormControl, Button, InputGroup, 
} from 'react-bootstrap'
import { Link } from 'react-router'
import Moment from 'moment'

export default class UserList extends Component{
	constructor(props) {
	  	super(props)
	
	  	this.state = {
	  		query:''
	  	}
	  	this.search = () => this.props.fetchUser(this.state.query)
	  	this.onChangeQuery = (e) => this.setState({query:e.target.value})
	  	this.recommend = (id) => this.props.recommendUser(id)
	  	this.stop = (e) => {
	  		if(e.keyCode === 13){
	  			e.preventDefault()
	  		}
	  	}

	  	// this.fetchMoreUsers = () => this.props.fetchUser(this.state.query)
	}
	componentWillMount() {
		this.search()
	}
	renderAccounts(accounts) {
	    return (
	    	<span>
		      {accounts.map(function (acc) {
		        if (acc.providerID === "weibo") {
		          return (<a href={'http://weibo.com/'+acc.providerKey} style={{color:'#E71D34', marginRight: '5px'}}><i className="fa fa-weibo fa-lg"></i></a>);
		        } else if (acc.providerID === "mobile") {
		          return (<i className="fa fa-mobile-phone fa-lg" title={acc.providerKey}  style={{color:'#55acee', marginRight: '5px'}}></i>);
		        }})
		      }
		    </span>
	    )
	}
	render() {
		return(
			<div className="content">
	          <div className="page-header">
	            <Form inline>
	              <FormGroup>
	                <InputGroup>
	                  <FormControl type="text" placeholder='搜索用户名或手机号' value={this.state.query} onKeyDown={this.stop} onChange={this.onChangeQuery} />
	                  <InputGroup.Button>
	                    <Button onClick={this.search}>搜索</Button>
	                  </InputGroup.Button>
	                </InputGroup>
	              </FormGroup>
	            </Form>
	          </div>
	          <div className="table-responsive">
	            <table className="table table-striped">
	              <thead><tr><th></th><th>用户名</th><th>照片数</th><th>绑定账号</th><th>最近登陆</th><th></th></tr></thead>
	              <tbody>
	                {this.props.users.map((user) => {
	                  return (
	                    <tr key={user.id}>
	                      <td><Link to={'/user/'+user.id}><img style={{width:'45px'}} src={user.avatar} className="img-circle"/></Link></td>
	                      <td>{user.nickname}</td>
	                      <td>{user.counts.posts}</td>
	                      <td>{this.renderAccounts(user.accounts)}</td>
	                      <td>{Moment.unix(user.lastSeen / 1000).fromNow()}</td>
	                      <td><Button onClick={() => this.recommend(user.id)}>推荐</Button></td>
	                    </tr>
	                  );
	                })}
	                <tr></tr>
	              </tbody>
	            </table>
	          </div>
	          <Row>
            	<div className="load-more-btn" onClick={this.search}>Load More</div>
          	  </Row>
          	</div>

		)
	}
}