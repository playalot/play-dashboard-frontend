var Reflux = require('reflux');
var React = require('react');
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var StatsStore = require('../stores/statsstore');
var StatsActions = require('../actions/statsactions');
var NumberCard = require('../widgets/numbercard');

var Home = React.createClass({
  mixins: [Reflux.connect(StatsStore, 'stats')],
  render: function() {
    if (this.state.stats) {
      return (
      <div className="content">
        <div className="box">
          <div className="box-header"></div>
            <div className="box-body text-center">
              <p>We will change the world.</p>
              <p><em>Innovation distinguishes between a leader and a follower.</em></p>
              <small>
                — Steve Jobs
              </small>
            </div>
        </div>
        <div className="box">
          <div className="box-header"></div>
          <div className="box-body text-center">
            <div className="row">
              <div className="col-sm-3 col-xs-6">
                <div className="description-block border-right">
                  <h5 className="description-header">{this.state.stats.posts}</h5>
                  <span className="description-text">照片数</span>
                </div>
              </div>
              <div className="col-sm-3 col-xs-6">
                <div className="description-block border-right">
                  <h5 className="description-header">{this.state.stats.users}</h5>
                  <span className="description-text">用户数</span>
                </div>
              </div>
              <div className="col-sm-3 col-xs-6">
                <div className="description-block border-right">
                  <h5 className="description-header">{this.state.stats.toys}</h5>
                  <span className="description-text">玩具数</span>
                </div>
              </div>
              <div className="col-sm-3 col-xs-6">
                <div className="description-block">
                  <h5 className="description-header">{this.state.stats.tags}</h5>
                  <span className="description-text">标签数</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      );
    } else {
      return (<div/>);
    }
  }
});

module.exports = Home;
