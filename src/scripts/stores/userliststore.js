var Reflux = require('reflux');
var $ = require('jquery');
var UserActions = require('../actions/useractions');

var UserListStore = Reflux.createStore({
    listenables: [UserActions],

    init: function() {
      this.userlist = [];
      this.page = 0;
      this.filter = '';
    },
    getInitialState: function() {
  		if (this.userlist.length === 0) {
        this.onFetchUserList(this.filter);
      }
      return this.userlist;
  	},
    onFetchUserList: function(filter) {
      if (filter !== null && filter !== this.filter) {
        this.userlist = [];
        this.filter = filter.trim();
        this.page = 0;
      }
      var sourceUrl = '/api/users?page=' + this.page;
      if (this.filter.length > 0) {
        sourceUrl = sourceUrl + '&filter=' + this.filter;
      }
      $.ajax({
          url: sourceUrl,
          dataType: 'json',
          context: this,
          success: function(data) {
              console.log('fetch users complete');
              this.userlist = this.userlist.concat(data.users);
              this.page = this.page + 1;
              if (data.users.length === 0) {
                alert('no more');
              }
              this.trigger(this.userlist);
          }
      });
    },
    onRecommendUser: function(id) {
      $.ajax({
          url: '/api/recommend/home/'+id+'?type=user',
          type: 'POST',
          dataType: 'json',
          context: this,
          success: function(data) {
          }
      });
    }
});

module.exports = UserListStore;
