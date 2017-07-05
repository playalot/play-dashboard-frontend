import React,{ Component } from 'react'
import { Row, Col, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default class ExplorePage extends Component{
	constructor(props) {
	  	super(props)
	  	this.addBanner = () => confirm('创建一个新Banner？') && this.props.addBanner()
	  	this.deleteBanner = (id) => confirm('删除这个Banner?') && this.props.deleteBanner(id,'banner')
	  	this.addTopic = () => confirm('创建一个新主题？') && this.props.addTopic()
	  	this.deleteTopic = (id) => confirm('删除这个主题?') && this.props.deleteBanner(id,'topic')
	  	this.addToy = () => confirm('创建一个新玩具页banner？') && this.props.addToy()
	  	this.deleteToy = (id) => confirm('删除这个玩具banner?') && this.props.deleteBanner(id,'toy')
	}
	componentWillMount() {
		!this.props.loaded && this.props.fetchExplore()
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
		        {
		        	this.props.banners ?
		        	<Row>
			            {this.props.banners.map((banner,index) => {
			              return (
			                <Col key={'b_'+banner.id+index} sm={4}>
			                  <div className="box">
			                    <div className="box-header with-border">
			                      <h3 className="box-title banner-title">
			                        {banner.title}
			                      </h3>
			                      <div className="box-tools pull-right">
			                        <Link
			                          to={`/recommend/${banner.id}`}
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
			        :null
		        }
		        <br></br>
		        <Row className="content-header">
		          <h1>
		            首页主题 { " " }
		            <Button
		              bsStyle='success'
		              bsSize="small"
		              onClick={this.addTopic}>创建新主题</Button>
		          </h1>
		        </Row>
		        <br></br>
		        {
		        	this.props.topics ?
			          <Row>
			            {this.props.topics.map((topic,index) => {
			              return (
			                <Col key={'b_'+topic.id+index} sm={4}>
			                  <div className="box">
			                    <div className="box-header with-border">
			                      <h3 className="box-title banner-title">
			                        {topic.title}
			                      </h3>
			                      <div className="box-tools pull-right">
			                        <Link
			                          to={`/recommend/${topic.id}/edit`}
			                          className="btn btn-box-tool" >
			                          <i className="fa fa-edit">
			                          </i>
			                        </Link>
			                        <button
			                          className="btn btn-box-tool"
			                          onClick={ () => this.deleteTopic(topic.id) }>
			                          <i className="fa fa-times">
			                          </i>
			                        </button>
			                      </div>
			                    </div>
			                    <div className="box-body">
			                      <img
			                        className="img-responsive"
			                        src={topic.image} />
			                    </div>
			                  </div>
			                </Col>
			              )
			            })}
			          </Row>
		        	:null
		        }
		   
				<br></br>
		        <Row className="content-header">
		          <h1>
		            玩具页Banner { " " }
		            <Button
		              bsStyle='success'
		              bsSize="small"
		              onClick={this.addToy}>创建新玩具页Banner</Button>
		          </h1>
		        </Row>
		        <br></br>
		        {
		        	this.props.toys?
			          <Row>
			            {this.props.toys.map((toy,index) => {
			              return (
			                <Col key={'b_'+toy.id+index} sm={4}>
			                  <div className="box">
			                    <div className="box-header with-border">
			                      <h3 className="box-title banner-title">
			                        {toy.title}
			                      </h3>
			                      <div className="box-tools pull-right">
			                        <Link
			                          to={`/recommend/${toy.id}/edit`}
			                          className="btn btn-box-tool" >
			                          <i className="fa fa-edit">
			                          </i>
			                        </Link>
			                        <button
			                          className="btn btn-box-tool"
			                          onClick={ () => this.deleteToy(toy.id) }>
			                          <i className="fa fa-times">
			                          </i>
			                        </button>
			                      </div>
			                    </div>
			                    <div className="box-body">
			                      <img
			                        className="img-responsive"
			                        src={toy.image} />
			                    </div>
			                  </div>
			                </Col>
			              )
			            })}
			          </Row>
			          :null
		        }
			</div>
		)
	}
}
