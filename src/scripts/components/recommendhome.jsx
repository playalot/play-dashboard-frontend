/*global confirm */

import React from 'react';
import Reflux from 'reflux';
import {Row, Col} from 'react-bootstrap';
import HomeAdStore from '../stores/recommendhomestore';
import HomeAdActions from '../actions/recommendhomeactions';
import CDN from '../widgets/cdn';

var HomeAds = React.createClass({
  mixins: [Reflux.connect(HomeAdStore, 'homeads')],
  fetchHomeAds: function() {
    HomeAdActions.fetchHomeAdList();
  },
  deleteHomeAd: function(id) {
    if (confirm('删除这个推荐?')) {
      HomeAdActions.deleteHomeAd(id);
    }
  },
  render: function() {
    if (this.state.homeads) {
      return (
        <div className="content">
          <Row>
            {this.state.homeads.map(function (ad) {
              return (
                <Col xs={12} sm={3} lg={3} key={'ad_'+ad.id}>
                  <div className="box box-widget">
                    <div className="box-header with-border">
                      <h3 className="box-title"></h3>
                      <div className="box-tools pull-right">
                        <button className="btn btn-box-tool" onClick={this.deleteHomeAd.bind(this, ad.id)}><i className="fa fa-times"></i></button>
                      </div>
                    </div>
                    <div className="box-body">
                      <ul className="products-list product-list-in-box">
                        <li className="item">
                          <div className="product-img">
                            <img src={ad.image?CDN.show(ad.image):''} alt="Ad Image" />
                          </div>
                          <div className="product-info">
                            <a className="product-title">
                              {ad.title}
                              <span className="label label-info pull-right">{ad.type}</span>
                            </a>
                            <span className="product-description">{ad.description}</span>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </Col>
              );
            }.bind(this))}
            </Row>
        </div>
      );
    } else {
      return (<div></div>);
    }
  }
});

module.exports = HomeAds;
