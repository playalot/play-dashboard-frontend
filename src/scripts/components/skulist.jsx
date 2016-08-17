var React = require('react');
var Reflux = require('reflux');
var _ = require('lodash');
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var Modal = require('react-bootstrap').Modal;
var Form = require('react-bootstrap').Form;
var FormGroup = require('react-bootstrap').FormGroup;
var InputGroup = require('react-bootstrap').InputGroup;
var FormControl = require('react-bootstrap').FormControl;
var Button = require('react-bootstrap').Button;
var DropdownButton = require('react-bootstrap').DropdownButton;
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;
var Link = require('react-router').Link;
var SkuStore = require('../stores/skustore');
var SkuActions = require('../actions/skuactions');

var SkuList = React.createClass({
  mixins: [Reflux.connect(SkuStore, 'skulist')],
  getInitialState: function() {
    return { filter: '', query: '', sort: 'created' };
  },
  onChangeQuery: function(e) {
    this.setState({query: e.target.value});
  },
  onChangeFilter: function(e) {
    this.setState({filter: e.target.value});
  },
  onChangeSort: function(e) {
    this.setState({sort: e.target.value});
  },
  addSku: function() {
    if (confirm('创建一个新的玩具？')) {
      SkuActions.addSku();
    }
  },
  recommend: function(id) {
    if (confirm('推荐这个玩具?')) {
      SkuActions.recommendToy(id);
    }
  },
  fetchMoreSkus: function() {
    SkuActions.fetchSkus(this.state.filter, this.state.query.trim(), this.state.sort);
  },
  search: function(e) {
    console.log('search query: ' + this.state.query);
    SkuActions.fetchSkus(this.state.filter, this.state.query, this.state.sort);
    e.preventDefault();
  },
  deleteSku: function(id) {
    if (confirm('Delete this SKU?')) {
      SkuActions.deleteSku(id);
    }
    return false;
  },
  toggleRecommend: function(id) {
    SkuActions.toggleRecommend(id);
  },
  toggleR18: function(id) {
    SkuActions.toggleR18(id);
  },
  render: function() {
    return (
      <div className="content">
        <div className="page-header">
          <Form inline className="form-input-filter" onSubmit={this.search}>
            <FormGroup>
              <Col smOffset={2} style={{marginRight: '25px'}}>
                <Button bsStyle='success' onClick={this.addSku}>创建新玩具</Button>
              </Col>
            </FormGroup>
            <FormGroup>
              <FormControl componentClass="select" placeholder="select" value={this.state.sort} onChange={this.onChangeSort}>
                <option value="created">最新录入</option>
                <option value="releaseDate">最新发售</option>
                <option value="counts.hits">点击最多</option>
                <option value="counts.wish">想要最多</option>
                <option value="counts.owns">拥有最多</option>
              </FormControl>
            </FormGroup>
            <FormGroup>
              <FormControl componentClass="select" placeholder="select" value={this.state.filter} onChange={this.onChangeFilter}>
                <option value="">全部</option>
                <option value="isRec">推荐</option>
                <option value="isR18">R18</option>
              </FormControl>
            </FormGroup>
            <FormGroup>
                <InputGroup>
                  <FormControl type="text" value={this.state.query} onChange={this.onChangeQuery} />
                  <InputGroup.Button>
                    <Button onClick={this.search}>搜索</Button>
                  </InputGroup.Button>
                </InputGroup>
            </FormGroup>
          </Form>
        </div>
        <Row>
          {this.state.skulist.map(function (sku) {
            var recommendClass = 'btn btn-sm';
            if (sku.isRec === true) {
              recommendClass = 'btn bg-orange btn-sm';
            }
            var r18Class = 'btn btn-sm';
            if (sku.isR18 === true) {
              r18Class = 'btn bg-orange btn-sm';
            }
            return (
              <Col className="col" xs={6} sm={3} lg={3} key={'sku_'+sku.id}>
                  <div className="box box-solid">
                    <div className="box-body toy-item">
                      <ul className="products-list product-list-in-box">
                        <li className="item">
                          <Link to={'/sku/' + sku.id + '/edit'} >
                          <div className="product-img">
                            <img src={sku.cover} alt={sku.name} />
                          </div>
                          <div className="product-info">
                            <p className="product-title">{sku.name}</p>
                            <span className="product-description">
                              {sku.company} <br/>
                              {sku.release} <br/>
                              {sku.money}
                            </span>
                          </div>
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div className="box-footer">
                      <ButtonToolbar className="pull-right">
                        <span onClick={ this.recommend.bind(this, sku.id) } className="btn btn-sm"><i className="fa fa-bookmark-o"></i></span>
                        <span onClick={ this.toggleR18.bind(this, sku.id) } className={r18Class}><i className="fa fa-venus-mars"></i></span>
                        <span onClick={ this.toggleRecommend.bind(this, sku.id) } className={recommendClass}><i className="fa fa-thumbs-o-up"></i></span>
                        <span onClick={ this.deleteSku.bind(this, sku.id) } className="btn btn-sm"><i className="fa fa-trash"></i></span>
                      </ButtonToolbar>
                    </div>
                  </div>
              </Col>
            );
          }, this)}
        </Row>
        <Row>
          <div className="load-more-btn" onClick={this.fetchMoreSkus}>Load More</div>
        </Row>
      </div>
    );

  }
});

module.exports = SkuList;
