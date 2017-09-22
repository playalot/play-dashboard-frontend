import React,{ Component } from 'react'
const _ = require('lodash')
import {Modal} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import CDN from '../../widgets/cdn'
import ReactPaginate from 'react-paginate'
import parse,{ parsePage } from '../../widgets/parse'
export default class TagList extends Component{
	constructor(props) {
		super(props)
		this.state = {
			query:'',
			type:'',
			selectedTag: null,
		}
		this.onChangeType = (e) => this.setState({ type:e.target.value },this.search)

		this.setTagClassification = (tid,cid) => this._setTagClassification(tid,cid)
		this.removeTagClassification = (tid,c) => this._removeTagClassification(tid,c)
		this.openTag = (tag) => this.setState({ selectedTag: tag })
		this.closeTag = (tag) => this.setState({ selectedTag: null })

		this.recommendTag = (tid) => this._recommendTag(tid)
		this.deleteTag = (tid) => confirm('删除这个标签?') && this.props.deleteTag(tid)
		this.goPage = this._goPage.bind(this)
		this.search = this._search.bind(this)
	}
	componentWillMount() {
		if(!this.props.classLoaded){
			this.props.fetchTagClass()
		}
		const { page,query,type } = this.props
		if(typeof page === 'number') {
			let path = `/tags?page=${page}`
			path += query ? `&query=${query}` : ``
			this.props.history.push(path)
			this.setState({type,query})
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
	_setTagClassification(tid,cid) {
		this.state.selectedTag.cls.push(cid)
		this.props.setClassification(tid,cid)
	}
	_removeTagClassification(tid,c) {
		let index = this.state.selectedTag.cls.indexOf(c)
		index !== -1 ? this.state.selectedTag.cls.splice(index,1) : null
		this.props.removeClassification(tid,c)
	}
	_recommendTag(tid) {
		if (confirm('推荐这个标签?')) {
			this.props.recommendTag(tid)
		}
	}
	_goPage(page) {
		let { query } = this.state
		let path = `/tags?page=${page}`
		path += query ? `&query=${query}` : ``
		this.props.history.push(path)
		this.props.getTag(page,query)
	}
	_search() {
		const { type,query } = this.state
		let path = `/tags?page=${this.props.page}`
		path += query ? `&query=${query}` : ``
		this.props.history.push(path)
		this.props.getTagBy(this.props.page,type,query.trim())
	}
	render() {
		let modal = (<div></div>)
		if (this.state.selectedTag !== null) {
			let cls = _.filter(this.props.classifications, function(c){
				return this.state.selectedTag.cls.indexOf(c.id) === -1
			}.bind(this))
			modal = (
				<div>
					<Modal className='modal-container' animation={false} show={true} onHide={this.closeTag}>
						<Modal.Body>
							<strong>已选类别</strong>
							<div>
								{
									this.state.selectedTag.cls.map(function(c){
										return (
											<span key={'t_c_m_'+c}
												onClick={ () => this.removeTagClassification( this.state.selectedTag.id, c) }
												className="label label-warning label-margin" >{_.isEmpty(this.props.classifications) ? c : this.props.classifications[c].name}</span>
											)
										}, this)
									}
								</div>
								<strong>全部类别</strong>
								<div>
									{cls.map((c,key) => {
										return (
											<span key={'c_m_'+key}
												className='label label-info label-margin'
												bsStyle='success'
												onClick={() => this.setTagClassification(this.state.selectedTag.id, c.id) }>{c.name}</span>
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
									<ul className="nav nav-tabs m-tabs-line m-tabs-line--left m-tabs-line--primary m-tabs-line--2x" role="tablist">
										<li className="nav-item m-tabs__item">
											<a className={`nav-link m-tabs__link ${this.state.type === '' ? 'active':''}`} data-toggle="tab" role="tab" onClick={()=> this.setState({type:''}, this.search)}>
												全部
											</a>
										</li>
										<li className="nav-item m-tabs__item">
											<a className={`nav-link m-tabs__link ${this.state.type === 'company' ? 'active':''}`} data-toggle="tab" role="tab" onClick={()=> this.setState({type:'company'},this.search)}>
												品牌
											</a>
										</li>
										<li className="nav-item m-tabs__item">
											<a className={`nav-link m-tabs__link ${this.state.type === 'series' ? 'active':''}`} data-toggle="tab" role="tab" onClick={()=> this.setState({type:'series'},this.search)}>
												系列
											</a>
										</li>
										<li className="nav-item m-tabs__item">
											<a className={`nav-link m-tabs__link ${this.state.type === 'circle' ? 'active':''}`} data-toggle="tab" role="tab" onClick={()=> this.setState({type:'circle'},this.search)}>
												圈子
											</a>
										</li>
										<li className="nav-item m-tabs__item">
											<a className={`nav-link m-tabs__link ${this.state.type === 'topic' ? 'active':''}`} data-toggle="tab" role="tab" onClick={()=> this.setState({type:'topic'},this.search)}>
												话题
											</a>
										</li>
									</ul>
									<ul className="m-portlet__nav">
										<div className="form-group m-portlet__nav-item ">
											<span className="input-group">
												<input type="text" placeholder="请输入搜索关键字" onKeyDown={e => e.keyCode === 13 && this.search()} value={this.state.query} className="form-control" onChange={(e) => this.setState({query:e.target.value})}/>
												<span className="input-group-btn"><button type="button" className="btn btn-default" onClick={this.search}>搜索</button></span>
											</span>
										</div>
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
									{this.props.tags.map( (tag) => {
										return (
											<div className="col col-xs-4 col-sm-3 col-lg-2 p-2" key={'u_'+tag.id}>
												<div className="card">
													<div className="card-header p-2">{tag.text}</div>
													<img className="card-img-top" src={tag.image?CDN.show(tag.image):''} alt={tag.text} />
													<div className="card-body p-2">
														<p className="card-text mb-0">{'照片 ' + tag.counts.posts}/{'关注 ' + tag.counts.follows}</p>
														<div>
															{tag.cls.map((c) => {
																return (<span key={'t_c_'+tag.id+'_'+c} className="m-badge m-badge--rounded m-badge--warn m-badge--wide m--margin-rt-3" >{_.isEmpty(this.props.classifications) ? c : this.props.classifications[c].name}</span>);
															})}
														</div>
													</div>
													<div className="card-footer p-2">
														<div className="btn-toolbar" role="toolbar">
															<div className="btn-group" role="group">
																<Link to={'/tag/'+tag.id}><span style={{color:'#333'}} className="btn btn-sm"><i className="la la-edit"></i></span></Link>
																<span className="btn btn-sm" onClick={ () => this.openTag(tag)}><i className="la la-th-large"></i></span>
																<span className="btn btn-sm" onClick={ () => this.deleteTag(tag.id) }><i className="la la-trash"></i></span>
															</div>
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
