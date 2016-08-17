var React = require('react');
var Reflux = require('reflux');
var LinkedStateMixin = require('react-addons-linked-state-mixin');
var Row = require('react-bootstrap').Row;
var Link = require('react-router').Link;
var Form = require('react-bootstrap').Form;
var FormGroup = require('react-bootstrap').FormGroup;
var InputGroup = require('react-bootstrap').InputGroup;
var FormControl = require('react-bootstrap').FormControl;
var Button = require('react-bootstrap').Button;
var UserStore = require('../stores/userliststore');
var UserActions = require('../actions/useractions');
var Moment = require('moment');

var UserList = React.createClass({
  mixins: [Reflux.connect(UserStore, 'userlist'), LinkedStateMixin],
  getInitialState: function() {
    return { query: '' };
  },
  onChangeQuery: function(e) {
    this.setState({query: e.target.value});
  },
  fetchMoreUsers: function() {
    UserActions.fetchUserList(this.state.query);
  },
  search: function(e) {
    UserActions.fetchUserList(this.state.query);
    e.preventDefault();
  },
  recommend: function(id) {
    if (confirm('推荐这个用户?')) {
      UserActions.recommendUser(id);
    }
  },
  renderAccounts: function(accounts) {
    return (<span>
      {accounts.map(function (acc) {
        if (acc.providerID === "weibo") {
          return (<a href={'http://weibo.com/'+acc.providerKey} style={{color:'#E71D34', marginRight: '5px'}}><i className="fa fa-weibo fa-lg"></i></a>);
        } else if (acc.providerID === "mobile") {
          return (<i className="fa fa-mobile-phone fa-lg" title={acc.providerKey}  style={{color:'#55acee', marginRight: '5px'}}></i>);
        }})
      }
    </span>);
  },
  render: function() {
    if (this.state.userlist) {
      return (
        <div className="content">
          <div className="page-header">
            <Form inline onSubmit={this.search}>
              <FormGroup>
                <InputGroup>
                  <FormControl type="text" placeholder='搜索用户名或手机号' value={this.state.query} onChange={this.onChangeQuery} />
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
                {this.state.userlist.map(function(user) {
                  return (
                    <tr key={user.id}>
                      <td><Link to={'/user/'+user.id}><img style={{width:'45px'}} src={user.avatar} className="img-circle"/></Link></td>
                      <td>{user.nickname}</td>
                      <td>{user.counts.posts}</td>
                      <td>{this.renderAccounts(user.accounts)}</td>
                      <td>{Moment.unix(user.lastSeen / 1000).fromNow()}</td>
                      <td><Button onClick={this.recommend.bind(this, user.id)}>推荐</Button></td>
                    </tr>
                  );
                },this)}
                <tr></tr>
              </tbody>
            </table>
          </div>
          <Row>
            <div className="load-more-btn" onClick={this.fetchMoreUsers}>Load More</div>
          </Row>
        </div>
      );
    } else {
      return (<Row></Row>);
    }
  }
});

module.exports = UserList;
