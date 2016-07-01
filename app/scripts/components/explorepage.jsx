var React = require('react');
var Reflux = require('reflux');
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var Link = require('react-router').Link;
var Button = require('react-bootstrap').Button;
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;
var If = require('../widgets/if');
var BannerStore = require('../stores/explorebannerstore');
var BannerActions = require('../actions/explorebanneractions');
var ThemeStore = require('../stores/explorethemestore');
var ThemeActions = require('../actions/explorethemeactions');

var ExplorePage = React.createClass({
  mixins: [Reflux.connect(BannerStore, 'bannerlist'), Reflux.connect(ThemeStore, 'themelist')],
  fetchMoreThemes: function() {
    ThemeActions.fetchThemeList();
  },
  addBanner: function() {
    if (confirm('创建一个新Banner？')) {
      BannerActions.addBanner();
    }
  },
  deleteBanner: function(id) {
    if (confirm('删除这个Banner?')) {
      BannerActions.deleteBanner(id);
    }
  },
  addTheme: function() {
    if (confirm('创建一个新主题？')) {
      ThemeActions.addTheme();
    }
  },
  deleteTheme: function(id) {
    if (confirm('删除这个主题?')) {
      ThemeActions.deleteTheme(id);
    }
  },
  render: function() {
    return (
      <div className="content">
        <Row className="content-header">
          <h1>
            Banner管理 { " " }
            <Button
              bsStyle='success'
              bsSize="small"
              onClick={this.addBanner}>创建新Banner</Button>
          </h1>
        </Row>
        <br></br>
        <If test={this.state.bannerlist}>
          <Row>
            {this.state.bannerlist.map(function(banner) {
              return (
                <Col key={'b_'+banner.id} sm={6}>
                  <div className="box">
                    <div className="box-header with-border">
                      <h3 className="box-title">
                        {banner.title}
                      </h3>
                      <div className="box-tools pull-right">
                        <Link
                          to={'/recommend/' + banner.id + '/edit'}
                          className="btn btn-box-tool" >
                          <i className="fa fa-edit">
                          </i>
                        </Link>
                        <button
                          className="btn btn-box-tool"
                          onClick={this.deleteBanner.bind(this, banner.id)}>
                          <i className="fa fa-times">
                          </i>
                        </button>
                      </div>
                    </div>
                    <div className="box-body">
                      <img
                        className="img-responsive"
                        src={banner.image} />
                    </div>
                  </div>
                </Col>
              );
            }.bind(this))}
          </Row>
        </If>
        <br></br>
        <Row className="content-header">
          <h1>
            主题管理 { " " }
            <Button
              bsStyle='success'
              bsSize="small"
              onClick={this.addTheme}>创建新主题</Button>
          </h1>
        </Row>
        <br></br>
        <If test={this.state.themelist}>
          <Row>
            {this.state.themelist.map(function(theme) {
              return (
                <Col key={'b_'+theme.id} sm={6}>
                  <div className="box">
                    <div className="box-header with-border">
                      <h3 className="box-title">
                        {theme.title}
                      </h3>
                      <div className="box-tools pull-right">
                        <Link
                          to={'/recommend/' + theme.id + '/edit'}
                          className="btn btn-box-tool" >
                          <i className="fa fa-edit">
                          </i>
                        </Link>
                        <button
                          className="btn btn-box-tool"
                          onClick={this.deleteBanner.bind(this, theme.id)}>
                          <i className="fa fa-times">
                          </i>
                        </button>
                      </div>
                    </div>
                    <div className="box-body">
                      <img
                        className="img-responsive"
                        src={theme.image} />
                    </div>
                  </div>
                </Col>
              );
            }.bind(this))}
          </Row>
        </If>
        <Row>
          <div
            className="load-more-btn"
            onClick={this.fetchMoreThemes}>
            Load More
          </div>
        </Row>
      </div>
    );
  }
});

module.exports = ExplorePage;
