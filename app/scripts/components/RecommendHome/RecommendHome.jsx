import React,{ Component } from 'react'
import Reflux from 'reflux'
import { Row, Col } from 'react-bootstrap'
import CDN from '../../widgets/cdn'

export default class RecommendHome extends Component{
	constructor(props) {
	  	super(props);
	
	  	this.state = {}
	  	this.deleteHomeAd = this._deleteHomeAd.bind(this)
	}
	componentWillMount() {
		this.props.fetchHomeads()
	}
	_deleteHomeAd(id) {
		if (confirm('删除这个推荐?')) {
			this.props.deleteHomeAd(id)
	    }
	}
	render() {

		if (this.props.homeads) {
	      return (
	        <div className="content">
	          <Row>
	            {
	            	this.props.homeads.map( (ad) => {
		              return (
		                <Col xs={12} sm={3} lg={3} key={'ad_'+ad.id}>
		                  <div className="box box-widget">
		                    <div className="box-header with-border">
		                      <h3 className="box-title"></h3>
		                      <div className="box-tools pull-right">
		                        <button className="btn btn-box-tool" onClick={() => this.deleteHomeAd(ad.id)}><i className="fa fa-times"></i></button>
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
		              )
		            })
	            }
	            </Row>
	        </div>
	      )
	    } else {
	      return (<div></div>)
	    }
	}
}