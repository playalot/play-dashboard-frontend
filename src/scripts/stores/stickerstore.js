var Reflux = require('reflux');
var $ = require('jquery');
var _ = require('lodash');
var StickerActions = require('../actions/stickeractions');

var StickerStore = Reflux.createStore({
    listenables: [StickerActions],

    init: function() {
      this.sets = [];
    },
    getInitialState: function() {
      if (this.sets.length === 0) {
        this.onFetchStickers();
      }
      return this.sets;
  	},
    onFetchStickers: function(c) {
      $.ajax({
          url: '/api/stickers',
          dataType: 'json',
          context: this,
          success: function(data) {
            this.sets = this.sets.concat(data.sets);
            this.trigger(this.sets);
          }
      });
    },
    onAddStickerSet: function() {
      $.ajax({
          url: '/api/sticker/set',
          dataType: 'json',
          type: 'POST',
          context: this,
          success: function(data) {
            console.log(data);
            this.sets.unshift(data);
            this.trigger(this.sets);
          }
      });
    },
    onDeleteSticker: function(setId, stickerId) {
      $.ajax({
          url: '/api/sticker/'+stickerId,
          type: 'DELETE',
          context: this,
          success: function(data) {
            var set = _.find(this.sets, function(s) {
              return s.id === setId;
            });
            set.stickers = _.filter(set.stickers, function(sticker) {
              return sticker.id !== stickerId;
            });
            this.trigger(this.sets);
          }
      });
    },
    onRiseSticker: function(setId, stickerId) {
      $.ajax({
          url: '/api/sticker/'+stickerId+'/up',
          type: 'POST',
          context: this,
          success: function(data) {
            var set = _.find(this.sets, function(s) {
              return s.id === setId;
            });
            var sticker = _.find(set.stickers, function(s) {
              return s.id === stickerId;
            });
            set.stickers = _.sortBy(set.stickers, function(s) { return -s.score; });
            sticker.score = sticker.score + 1;
            this.trigger(this.sets);
          }
      });
    },
    onRiseStickerSet: function(setId) {
      $.ajax({
          url: '/api/stickerset/'+setId+'/up',
          type: 'POST',
          context: this,
          success: function(data) {
            var set = _.find(this.sets, function(s) {
              return s.id === setId;
            });
            set.score = set.score + 1;
            this.sets = _.sortBy(this.sets, function(s) { return -s.score; });
            this.trigger(this.sets);
          }
      });
    },
    updateList: function(list){
      this.sets = list;
      this.trigger(this.sets);
    }
});

module.exports = StickerStore;
