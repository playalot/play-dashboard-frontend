var Reflux = require('reflux');
var $ = require('jquery');
var _ = require('lodash');
var SkuActions = require('../actions/skuactions');

var SkuStore = Reflux.createStore({
    listenables: [SkuActions],

    init: function() {
      this.skus = [];
      this.page = 0;
      this.filter = '';
      this.query = '';
      this.sort = 'created';
    },
    getInitialState: function() {
      if (this.skus.length === 0) {
        this.onFetchSkus(this.filter, this.query, this.sort);
      }
      return this.skus;
  	},
    onAddSku: function() {
      $.ajax({
          url: '/api/sku',
          dataType: 'json',
          type: 'POST',
          context: this,
          success: function(data) {
            console.log(data);
            this.skus.unshift(data);
            this.trigger(this.skus);
          }
      });
    },
    onFetchSkus: function(filter, query, sort) {
      if (this.query !== query || this.filter !== filter || this.sort !== sort) {
          this.filter = filter;
          this.query = query;
          this.sort = sort;
          this.page = 0;
          this.skus = [];
      }
      var sourceUrl = '/api/skus';

      var param = [];
      if (this.page !== 0) {
        param.push('page=' + this.page);
      }
      if (this.filter !== '') {
        param.push('filter=' + this.filter);
      }
      if (this.query !== '') {
        param.push('query=' + this.query);
      }
      if (this.sort !== '') {
        param.push('sort=' + this.sort);
      }
      var paramStr = param.join('&');
      if (paramStr !== '') {
          sourceUrl = sourceUrl + '?' + paramStr;
      }

      $.ajax({
          url: sourceUrl,
          dataType: 'json',
          context: this,
          success: function(data) {
            if (this.page === 0) {
              this.skus = data.skus;
            } else {
              this.skus = this.skus.concat(data.skus);
            }
            if (data.skus.length === 0 && this.page > 0) {
              alert('no more');
            } else {
              this.page = this.page + 1;
            }
            this.trigger(this.skus);
          }
      });
    },
    deleteSku: function(id) {
      $.ajax({
        url: '/api/sku/'+id,
        type: 'DELETE',
        success: function() {
          console.log('delete sku ' + id);
          this.updateList(_.filter(this.skus, function(sku) {
            return sku.id !== id;
          }));
        }.bind(this)
      });
    },
    onToggleR18: function(id) {
      var foundSku = _.find(this.skus, function(sku) {
        return sku.id === id;
      });
      if (foundSku) {
        $.ajax({
          url: '/api/sku/'+id+'/r18',
          type: 'POST',
          data: JSON.stringify({ r18: !foundSku.isR18 }),
          contentType: 'application/json; charset=utf-8',
          success: function() {
            console.log('toggle r18 sku ' + id);
            foundSku.isR18 = !foundSku.isR18;
            this.updateList(this.skus);
          }.bind(this)
        });
      }
    },
    onToggleRecommend: function(id) {
      var foundSku = _.find(this.skus, function(sku) {
        return sku.id === id;
      });
      if (foundSku) {
        $.ajax({
          url: '/api/sku/'+id+'/recommend',
          type: 'POST',
          data: JSON.stringify({ recommend: !foundSku.isRec }),
          contentType: 'application/json; charset=utf-8',
          success: function() {
            console.log('toggle recommend sku ' + id);
            foundSku.isRec = !foundSku.isRec;
            this.updateList(this.skus);
          }.bind(this)
        });
      }
    },
    onRecommendToy: function(id) {
      $.ajax({
          url: '/api/recommend/home/'+id+'?type=toy',
          type: 'POST',
          dataType: 'json',
          context: this,
          success: function(data) {
          }
      });
    },
    updateList: function(list) {
      this.skus = list;
      this.trigger(this.skus);
    }
});

module.exports = SkuStore;
