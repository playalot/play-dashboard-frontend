import React,{ Component } from 'react'
const _ = require('lodash')
import Modal from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Request from 'superagent'
import DatePicker from 'react-datepicker'
import Moment from 'moment'
import ReactPaginate from 'react-paginate'
import CopyToClipboard from 'react-copy-to-clipboard'
import parse,{ parsePage } from '../../widgets/parse'
export default class Toy extends Component{
	constructor(props) {
		super(props)
		this.state = {
			filter: '',
			query: '',
			sort: 'created',
			month:'',
			year:'',
			id:'',
			selectedToy:null,
		}
		this.onChangeSort = (e) => this.setState({sort:e.target.value},this.search)
		this.onChangeFilter = (e) => this.setState({filter:e.target.value},this.search)
		this.onChangeQuery = (e) => this.setState({query:e.target.value})
		this.onChangeYear= (e) => this.setState({year:e.target.value},this.search)
		this.onChangeMonth = (e) => this.setState({month:e.target.value},this.search)

		this.toggleR18 = (id) => this.props.toggleR18(id)
		this.toggleRecommend = (id) => this.props.toggleRecommend(id)
		this.deletetoy = (id) => confirm('删除这个玩具?') && this.props.deleteToy(id)
		this.addtoy = () => confirm('创建一个新的玩具？') && this.props.addToy()
		this.search = this._search.bind(this)
		this.goPage = this._goPage.bind(this)

		this.closeClass = () => this.setState({ selectedToy: null })
		this.addToyClass = (tid,c) => this._addToyClass(tid,c)
		this.removeToyClass = (tid,c) => this._removeToyClass(tid,c)

		this.addTag = this._addTag.bind(this)
	}
	componentWillMount() {
		if(!this.props.toyLoaded){
			this.props.fetchToyClass()
		}
		const { page,filter,query,sort,month,year } = this.props
		if(typeof page === 'number') {
			let path = `/toys?page=${page}`
			path += query ? `&query=${query}` : ``
			this.props.history.push(path)
			this.setState({filter,query,sort,month,year})
		}else{
			const ppage = parsePage(this.props.location.search)
			const pquery = parse(this.props.location.search).query || ''

			this.setState({
				query:pquery
			},() => {
				this.goPage(ppage)
			})
		}
	}
	_goPage(page) {
		let { filter,query,sort,year,month } = this.state
		let path = `/toys?page=${page}`
		path += query ? `&query=${query}` : ``
		this.props.history.push(path)
		this.props.getToy(page,query)
	}
	_search() {
		const { filter,query,sort,year,month,page } = this.state
		let path = `/toys?page=${page}`
		path += query ? `&query=${query}` : ``
		this.props.history.push(path)
		this.props.getToyBy(page,filter,query.trim(),sort,year,month)
	}
	_addToyClass(tid,c) {
		this.state.selectedToy.cls.push(c)
		this.props.addToyClass(tid,c)
	}
	_removeToyClass(tid,c) {
		let index = this.state.selectedToy.cls.indexOf(c)
		index !== -1 ? this.state.selectedToy.cls.splice(index,1) : null
		this.props.removeToyClass(tid,c)
	}
	_addTag(id) {
		let text = prompt('输入标签')
		if (text) {
			this.props.addToyTag(id,text)
		}
	}
	render() {
		let modal = (<div></div>)
		if (this.state.selectedToy !== null) {
			let cls = _.filter(this.props.toyClass,(c) => {
				return this.state.selectedToy.cls.indexOf(c.id) === -1
			})
			modal = (
				<div>
					<Modal className='modal-container' animation={false} show={true} onHide={this.closeClass}>
						<Modal.Body>
							<strong>已选类别</strong>
							<div>
								{
									this.state.selectedToy.cls.map((c,i) => {
										return (
											<span key={`sku_toy_class_selected_${i}`}
												onClick={ () => this.removeToyClass( this.state.selectedToy.id, c) }
												className="label label-warning label-margin" >{this.props.toyClass[c].name}</span>
											)
										})
									}
								</div>
								<strong>全部类别</strong>
								<div>
									{cls.map((c,i) => {
										return (
											<span key={`sku_toy_class_no_sel_${i}`}
												className='label label-info label-margin'
												onClick={() => this.addToyClass(this.state.selectedToy.id, c.id) }>{c.name}</span>
											)
										})}
									</div>
								</Modal.Body>
							</Modal>
						</div>
					)
				}
				return(
					<div className="m-content">
						<div className="m-portlet m-portlet--mobile m-portlet--tabs">
							<div className="m-portlet__head">
								<div className="m-portlet__head-tools clearfix">
									<ul className="m-portlet__nav">
										<div className="form-group m-portlet__nav-item ">
											<span className="input-group">
												<input type="text" placeholder="请输入搜索关键字" onKeyDown={e => e.keyCode === 13 && this.search()} value={this.state.query} className="form-control" onChange={this.onChangeQuery}/>
												<span className="input-group-btn"><button type="button" className="btn btn-default" onClick={this.search}>搜索</button></span>
											</span>
										</div>
									</ul>
									<ul className="m-portlet__nav">
										<div className="form-group m-portlet__nav-item ">
											<select className="form-control" value={this.state.sort} onChange={this.onChangeSort}>
												<option value="created">最新录入</option>
												<option value="releaseDate">最新发售</option>
												<option value="counts.hits">点击最多</option>
												<option value="counts.updates">本周点击最多</option>
												<option value="counts.wish">想要最多</option>
												<option value="counts.owns">拥有最多</option>
											</select>
										</div>
									</ul>
									<ul className="m-portlet__nav">
										<div className="form-group m-portlet__nav-item ">
											<select className="form-control" value={this.state.filter} onChange={this.onChangeFilter}>
												<option value="">全部</option>
												<option value="isRec">推荐</option>
												<option value="isR18">R18</option>
												<option value="isGashapon">扭蛋</option>
											</select>
										</div>
									</ul>
									<ul className="m-portlet__nav" style={{textAlign:"left"}}>
										<div className="form-group m-portlet__nav-item ">
											<select className="form-control" value={this.state.month} onChange={this.onChangeMonth}>
												<option value="">全部月份</option>
												<option value="1">1月</option>
												<option value="2">2月</option>
												<option value="3">3月</option>
												<option value="4">4月</option>
												<option value="5">5月</option>
												<option value="6">6月</option>
												<option value="7">7月</option>
												<option value="8">8月</option>
												<option value="9">9月</option>
												<option value="10">10月</option>
												<option value="11">11月</option>
												<option value="12">12月</option>
											</select>
										</div>
									</ul>
									<ul className="m-portlet__nav">
										<div className="form-group m-portlet__nav-item ">
											<select className="form-control" value={this.state.year} onChange={this.onChangeYear}>
												<option value="">全部年份</option>
												<option value="2018">2018年</option>
												<option value="2017">2017年</option>
												<option value="2016">2016年</option>
												<option value="2015">2015年</option>
												<option value="2014">2014年</option>
											</select>
										</div>
									</ul>
									<ul className="m-portlet__nav" style={{float:"left"}}>
										<li className="m-portlet__nav-item">
											<button type="button" className="btn btn-outline-info m-btn" onClick={this.addtoy}>创建新玩具</button>
										</li>
									</ul>
								</div>
							</div>
							<div className="m-portlet__body pt-2">
								<div className="row d-flex justify-content-end p-2">
									{
										this.props.children.map((child) => {
											return(
												<span onClick={() => this.setState({query:child},this.search)} key={child} className="m-badge m-badge--rounded m-badge--info m-badge--wide m--margin-rt-3">{child}</span>
											)
										})
									}
								</div>
								<div className="row">
									{this.props.toys.map((toy) => {
										let recommendClass = 'btn btn-sm';
										if (toy.isRec === true) {
											recommendClass = 'btn btn-sm btn-info';
										}
										let r18Class = 'btn btn-sm';
										if (toy.isR18 === true) {
											r18Class = 'btn btn-sm btn-info';
										}
										return (
											<div className="col col-xs-4 col-sm-3 col-lg-2 p-2" key={'toy_'+toy.id}>
												<div className="card">
													<div className="card-header p-2">{toy.name}{' '}<span className="badge badge-info">{toy.info.seriesNo}</span></div>
													<img className="card-img-top" src={toy.cover} alt={toy.name} />
													<div className="card-body p-2">
														<p className="card-text mb-0">{'厂商 ' + toy.info.company}</p>
														<p className="card-text mb-0">{'发售 ' + toy.info.releaseString}</p>
														<p className="card-text mb-0">{'价格 ' + toy.info.moneyString}</p>
														<p className="card-text mb-0">{'点击 ' + toy.counts.hits}/{'已买 ' + toy.counts.owns}/{'想要 ' + toy.counts.wish}</p>
														<div>
															{toy.tags.map(t => <span key={`toy_${toy.id}_tag_${t.id}`} className='badge badge-light m--margin-rt-3'><Link to={'/tag/'+t.id}>{t.text}</Link>{" "}<i className="la la-close" onClick={ () => this.props.removeToyTag(toy.id,t.id)}></i></span>)}
														</div>
														<div>
															{toy.cls.map(c => <span key={'t_'+toy.id+'_c_'+c} className="label label-warning label-margin" >{this.props.toyClass[c].name}</span>)}
														</div>
													</div>
													<div className="card-footer p-2">
														<div className="btn-toolbar" role="toolbar">
															<div className="btn-group" role="group">
																<CopyToClipboard text={toy.id} onCopy={() => null}>
																	<span className="btn btn-sm"><i className="la la-copy"></i></span>
																</CopyToClipboard>
																<Link to={'/toy/' + toy.id } ><span style={{color:'#333'}} className="btn btn-sm"><i className="la la-edit"></i></span></Link>
																<span onClick={() => this.setState({selectedToy:toy})} className="btn btn-sm"><i className="la la-th-large"></i></span>
																<span onClick={() => this.addTag(toy.id) } className="btn btn-sm"><i className="la la-tag"></i></span>
															</div>
															<div className="btn-group" role="group">
																<span onClick={() => this.toggleR18(toy.id) } className={r18Class}><i className="la la-header"></i></span>
																<span onClick={() => this.toggleRecommend(toy.id) } className={recommendClass}><i className="la la-thumbs-o-up"></i></span>
																<span onClick={() => this.deletetoy(toy.id) } className="btn btn-sm"><i className="la la-trash"></i></span>
															</div>
														</div>
														<div>
															<a target="_blank" href={`http://www.playalot.cn/toy/${toy.id}`} className="card-link">查看详情</a>
															<a onClick={() => this.props.history.push(`/sku/${toy.id}`) } className="card-link">添加库存</a>
														</div>
													</div>
												</div>
											</div>
										)
									})}
								</div>
								<ReactPaginate
									previousLabel={<span>&laquo;</span>}
									nextLabel={<span>&raquo;</span>}
									breakLabel={<a>...</a>}
									breakClassName={"break-me"}
									pageCount={this.props.totalPages}
									marginPagesDisplayed={2}
									pageRangeDisplayed={5}
									onPageChange={obj => this.goPage(obj.selected)}
									containerClassName={"pagination"}
									subContainerClassName={"pages pagination"}
									forcePage={parsePage(this.props.location.search)}
									activeClassName={"active"} />
									{modal}
								</div>
							</div>
						</div>
					)
				}
			}
