import React,{Component} from 'react'
import {Link} from 'react-router-dom'
import Request from 'superagent'
import ReactPaginate from 'react-paginate'

import PagePanel from '../PagePanel'
import PlaySwitch from '../Common/playSwitch'
import { parsePage } from '../../widgets'
export default class PageList extends Component{
	constructor(props) {
	  	super(props)
	  	this.state = {
	  		filter:'',
	  		query:'',
	  	}
	  	this.goPage = this._goPage.bind(this)
	  	this.search = this._search.bind(this)
	}
	componentWillMount() {
		const { page,query,filter } = this.props
		if(typeof page === 'number') {
			this.setState({filter,query})
			this.props.history.push(`/pages?page=${page}`)
		}else{
			const ppage = parsePage(this.props.location.search)
			this.goPage(ppage)
		}
	}
	_goPage(page) {
		this.props.history.push(`/pages?page=${page}`)
		this.props.getPage(page)
	}
	_search() {
		this.props.history.push(`/pages?page=0`)
		this.props.getPageBy(this.state.filter,this.state.query.trim())
	}

	render() {
		return(
			<div className="content pagelist">
				<div className="d-flex p-3">
					<Link to="/page/edit"><button type="button" className="btn btn-outline-info mr-2">发布文章</button></Link>
					<div className="form-group mr-2">
						<select className="form-control" value={this.state.filter} onChange={(e) => this.setState({filter:e.target.value},this.search)}>
							<option value="">全部</option>
							<option value="forShare">分享</option>
							<option value="isRec">推荐</option>
							<option value="isBlk">屏蔽</option>
						</select>
					</div>
					<div className="form-group mr-2">
						<div className="input-group">
							<input value={this.state.query} onKeyDown={e => e.keyCode === 13 && this.search()} onChange={(e) => this.setState({query:e.target.value})} type="text" className="form-control" placeholder="输入关键字"/>
							<span className="input-group-btn">
								<span onClick={this.search} className="btn btn-outline-primary">搜索</span>
							</span>
						</div>
					</div>
				</div>
				<PagePanel/>
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
					activeClassName={"active"} 
				/>
			</div>
		)
	}
}

