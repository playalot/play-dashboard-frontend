import React,{ Component } from 'react'
import {
	Row, Col, Button, ButtonToolbar
} from 'react-bootstrap'
import { Link } from 'react-router'
import If from '../../widgets/if'


export default class ExplorePage extends Component{
	constructor(props) {
	  	super(props)
	  	this.state = {}
	  	this.addBanner = this._addBanner.bind(this)
	  	this.deleteBanner = this._deleteBanner.bind(this)
	}
	componentWillMount() {
		if(!this.props.bannerLoaded){
			this.props.fetchBanner()
		}
		if(!this.props.themeLoaded){
			this.props.fetchTheme()
		}
	}
	_fetchMoreThemes() {

		if(this.props.noMore){
			return alert('no more')
		}
		this.props.fetchThemeMore()
	}
	_addBanner() {
		if (confirm('创建一个新Banner？')) {
			this.props.addBanner()
		}
	}
	_deleteBanner(id) {
		if (confirm('删除这个Banner?')) {
			this.props.deleteBanner(id)
		}
	}
	_addBanner() {
		if (confirm('创建一个新主题？')) {
			this.props.addBanner()
		}
	}
	_deleteBanner(id) {
		if (confirm('删除这个主题?')) {
			this.props.deleteBanner(id)
		}
	}
	render() {
		return(
			<div className="content">
				<Row className="content-header">
		          <h1>
		            发现页Banner { " " }
		            <Button
		              bsStyle='success'
		              bsSize="small"
		              onClick={this.addBanner}>创建新Banner</Button>
		          </h1>
		        </Row>
		        <br></br>
		        <If test={this.props.bannerList}>
		          <Row>
		            {this.props.bannerList.map((banner,index) => {
		              return (
		                <Col key={'b_'+banner.id+index} sm={4}>
		                  <div className="box">
		                    <div className="box-header with-border">
		                      <h3 className="box-title banner-title">
		                        {banner.title}
		                      </h3>
		                      <div className="box-tools pull-right">
		                        <Link
		                          to={`/recommend/${banner.id}/edit`}
		                          className="btn btn-box-tool" >
		                          <i className="fa fa-edit">
		                          </i>
		                        </Link>
		                        <button
		                          className="btn btn-box-tool"
		                          onClick={() => this.deleteBanner(banner.id)}>
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
		              )
		            })}
		          </Row>
		        </If>
		        <br></br>
		        <Row className="content-header">
		          <h1>
		            首页主题 { " " }
		            <Button
		              bsStyle='success'
		              bsSize="small"
		              onClick={this.addBanner}>创建新主题</Button>
		          </h1>
		        </Row>
		        <br></br>
		        <If test={this.props.themeList}>
		          <Row>
		            {this.props.themeList.map((theme,index) => {
		              return (
		                <Col key={'b_'+theme.id+index} sm={4}>
		                  <div className="box">
		                    <div className="box-header with-border">
		                      <h3 className="box-title banner-title">
		                        {theme.title}
		                      </h3>
		                      <div className="box-tools pull-right">
		                        <Link
		                          to={`/recommend/${theme.id}/edit`}
		                          className="btn btn-box-tool" >
		                          <i className="fa fa-edit">
		                          </i>
		                        </Link>
		                        <button
		                          className="btn btn-box-tool"
		                          onClick={ () => this.deleteBanner(theme.id) }>
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
		              )
		            })}
		          </Row>
		        </If>
						<br></br>
		        <Row className="content-header">
		          <h1>
		            玩具页Banner { " " }
		            <Button
		              bsStyle='success'
		              bsSize="small"
		              onClick={this.addBanner}>创建新玩具页Banner</Button>
		          </h1>
		        </Row>
		        <br></br>
		        <If test={this.props.themeList}>
		          <Row>
		            {this.props.themeList.map((theme,index) => {
		              return (
		                <Col key={'b_'+theme.id+index} sm={4}>
		                  <div className="box">
		                    <div className="box-header with-border">
		                      <h3 className="box-title banner-title">
		                        {theme.title}
		                      </h3>
		                      <div className="box-tools pull-right">
		                        <Link
		                          to={`/recommend/${theme.id}/edit`}
		                          className="btn btn-box-tool" >
		                          <i className="fa fa-edit">
		                          </i>
		                        </Link>
		                        <button
		                          className="btn btn-box-tool"
		                          onClick={ () => this.deleteBanner(theme.id) }>
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
		              )
		            })}
		          </Row>
		        </If>
			</div>
		)
	}
}
