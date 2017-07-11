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
			<div>
				<Row>
					<Col xs={12}>
						<div className="portlet light ">
							<div className="portlet-title tabbable-line">
								<div className="caption caption-md">
									<span className="caption-subject font-blue-madison bold uppercase">Banner</span>
								</div>
								<ul className="nav nav-tabs">
									<li className="active">
										<a href="#explore_1" data-toggle="tab">发现页banner</a>
									</li>
									<li>
										<a href="#explore_2" data-toggle="tab">首页主题</a>
									</li>
									<li>
										<a href="#explore_3" data-toggle="tab">玩具页Banner</a>
									</li>
								</ul>
							</div>
							<div className="portlet-body">
								<div className="tab-content">
									<div className="tab-pane active" id="explore_1">
										<button onClick={this.addBanner} className="btn green btn-outline">创建新Banner</button> <br/><br/>
										{
											this.props.banners ?
											<table className="table table-striped">
												<tbody>
													{
														this.props.banners.map((banner,index) =>{
															return(
																<tr key={'b_'+banner.id+index}>
																	<td>
																		<img src={banner.image} style={{width:150}} />
																	</td>
																	<td>
																		<span>{banner.title}</span>
																	</td>
																	<td style={{textAlign:'right'}}>
																		<Link className="btn btn-circle btn-icon-only btn-default" to={`/recommend/${banner.id}`}>
																			<i className="fa fa-edit"></i>
																		</Link>
																		<a className="btn btn-circle btn-icon-only btn-default" onClick={() => this.deleteBanner(banner.id)}>
																			<i className="fa fa-trash"></i>
																		</a>
																	</td>
																</tr>
															)
														})
													}
												</tbody>
											</table>
											:null
										}
									</div>
									<div className="tab-pane" id="explore_2">
										<button onClick={this.addTopic} className="btn green btn-outline">创建新主题</button> <br/><br/>
										{
											this.props.topics ?
											<table className="table table-striped">
												<tbody>
													{
														this.props.topics.map((topic,index) =>{
															return(
																<tr key={'b_'+topic.id+index}>
																	<td>
																		<img src={topic.image} style={{width:150}} />
																	</td>
																	<td>
																		<span>{topic.title}</span>
																	</td>
																	<td style={{textAlign:'right'}}>
																		<Link className="btn btn-circle btn-icon-only btn-default" to={`/recommend/${topic.id}`}>
																			<i className="fa fa-edit"></i>
																		</Link>
																		<a className="btn btn-circle btn-icon-only btn-default" onClick={() => this.deleteTopic(topic.id)}>
																			<i className="fa fa-trash"></i>
																		</a>
																	</td>
																</tr>
															)
														})
													}
												</tbody>
											</table>
											:null
										}
									</div>
									<div className="tab-pane" id="explore_3">
										<button onClick={this.addToy} className="btn green btn-outline">创建新玩具页Banner</button> <br/><br/>
										{
											this.props.toys?
											<table className="table table-striped">
												<tbody>
													{
														this.props.toys.map((toy,index) =>{
															return(
																<tr key={'b_'+toy.id+index}>
																	<td>
																		<img src={toy.image} style={{width:150}} />
																	</td>
																	<td>
																		<span>{toy.title}</span>
																	</td>
																	<td style={{textAlign:'right'}}>
																		<Link className="btn btn-circle btn-icon-only btn-default" to={`/recommend/${toy.id}`}>
																			<i className="fa fa-edit"></i>
																		</Link>
																		<a className="btn btn-circle btn-icon-only btn-default" onClick={() => this.deleteToy(toy.id)}>
																			<i className="fa fa-trash"></i>
																		</a>
																	</td>
																</tr>
															)
														})
													}
												</tbody>
											</table>
											:null
										}
									</div>
								</div>
							</div>
						</div>
					</Col>
				</Row>
			</div>
		)
	}
}
