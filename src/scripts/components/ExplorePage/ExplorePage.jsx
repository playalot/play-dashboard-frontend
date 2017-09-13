import React,{ Component } from 'react'
import { Row, Col, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Request from 'superagent'
export default class ExplorePage extends Component{
	constructor(props) {
	  	super(props)
	  	this.deleteBanner = (id) => confirm('删除这个Banner?') && this.props.deleteBanner(id,'banner')
	  	this.deleteTopic = (id) => confirm('删除这个主题?') && this.props.deleteBanner(id,'topic')
	  	this.deleteToy = (id) => confirm('删除这个玩具banner?') && this.props.deleteBanner(id,'toy')
	  	this.deleteDraft = (id) => confirm('删除这个草稿?') && this.props.deleteBanner(id,'draft')
	  	this.addDraft = this._addDraft.bind(this)
	}
	_addDraft() {
		if(confirm('创建一个新草稿？')){
			 Request
            .post(`/api/recommend?place=draft`)
            .end((err,res) => {
				if(!err){
					this.props.history.push(`/recommend/${res.body.id}`)
				}
            })
		}
	}
	componentWillMount() {
		this.props.fetchExplore()
	}
	render() {
		return(
			<div>
				<Row>
					<div className="m-portlet w-100">
						<div className="m-portlet__body">
							<div className="d-flex justify-content-between align-items-center">
								<button onClick={this.addDraft} className="btn btn-outline-info">创建草稿</button>
								<ul className="nav nav-tabs m-tabs-line m-tabs-line--2x m-tabs-line--success" role="tablist">
									
									<li className="nav-item m-tabs__item">
										<a className="nav-link m-tabs__link active" data-toggle="tab" href="#explore_1" role="tab">
											发现页banner
										</a>
									</li>
									<li className="nav-item m-tabs__item">
										<a className="nav-link m-tabs__link" data-toggle="tab" href="#explore_2" role="tab">
											发现页主题
										</a>
									</li>
									<li className="nav-item m-tabs__item">
										<a className="nav-link m-tabs__link" data-toggle="tab" href="#explore_3" role="tab">
											玩具页Banner
										</a>
									</li>
									<li className="nav-item m-tabs__item">
										<a className="nav-link m-tabs__link" data-toggle="tab" href="#explore_4" role="tab">
											草稿
										</a>
									</li>
								</ul>
							</div>
							<div className="tab-content">
								<div className="tab-pane active" id="explore_1" role="tabpanel">
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
								<div className="tab-pane" id="explore_2" role="tabpanel">
									{
										this.props.themes ?
										<table className="table table-striped">
											<tbody>
												{
													this.props.themes.map((topic,index) =>{
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
								<div className="tab-pane" id="explore_3" role="tabpanel">
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
								<div className="tab-pane" id="explore_4" role="tabpanel">
									{
										this.props.drafts ?
										<table className="table table-striped">
											<tbody>
												{
													this.props.drafts.map((draft,index) =>{
														return(
															<tr key={'b_'+draft.id+index}>
																<td>
																	<img src={draft.image} style={{width:150}} />
																</td>
																<td>
																	<span>{draft.title}</span>
																</td>
																<td style={{textAlign:'right'}}>
																	<Link className="btn btn-circle btn-icon-only btn-default" to={`/recommend/${draft.id}`}>
																		<i className="fa fa-edit"></i>
																	</Link>
																	<a className="btn btn-circle btn-icon-only btn-default" onClick={() => this.deleteDraft(draft.id)}>
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
					{/* <Col xs={12}>
						<div className="portlet light ">
							<div className="portlet-title tabbable-line">
								<div className="caption caption-md">
									<button onClick={this.addDraft} className="btn green btn-outline">创建草稿</button>
								</div>
								<ul className="nav nav-tabs">
									<li className="active">
										<a href="#explore_1" data-toggle="tab">发现页banner</a>
									</li>
									<li>
										<a href="#explore_2" data-toggle="tab">发现页主题</a>
									</li>
									<li>
										<a href="#explore_3" data-toggle="tab">玩具页Banner</a>
									</li>
									<li>
										<a href="#explore_4" data-toggle="tab">草稿</a>
									</li>
								</ul>
							</div>
							<div className="portlet-body">
								<div className="tab-content">
									<div className="tab-pane active" id="explore_1">
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
										{
											this.props.themes ?
											<table className="table table-striped">
												<tbody>
													{
														this.props.themes.map((topic,index) =>{
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
									<div className="tab-pane" id="explore_4">
										{
											this.props.drafts ?
											<table className="table table-striped">
												<tbody>
													{
														this.props.drafts.map((draft,index) =>{
															return(
																<tr key={'b_'+draft.id+index}>
																	<td>
																		<img src={draft.image} style={{width:150}} />
																	</td>
																	<td>
																		<span>{draft.title}</span>
																	</td>
																	<td style={{textAlign:'right'}}>
																		<Link className="btn btn-circle btn-icon-only btn-default" to={`/recommend/${draft.id}`}>
																			<i className="fa fa-edit"></i>
																		</Link>
																		<a className="btn btn-circle btn-icon-only btn-default" onClick={() => this.deleteDraft(draft.id)}>
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
					</Col> */}
				</Row>
			</div>
		)
	}
}
