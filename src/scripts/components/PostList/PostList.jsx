import React,{ Component } from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, Modal, Form, FormGroup, InputGroup, FormControl, Button } from 'react-bootstrap'
import ReactPaginate from 'react-paginate'
import PostPanels from '../PostPanels'
import { parsePage } from '../../widgets/parse'
const _ = require('lodash')

export default class Post extends Component{
	constructor(props) {
		super(props)
		this.state = {
			filter: '',
			query: '',
		}
		this.onChangeQuery = (e) => this.setState({ query: e.target.value })
		this.onChangeFilter = (e) => this.setState({ filter: e.target.value },this.search)

		this.search = this._search.bind(this)
		this.goPage = this._goPage.bind(this)
	}
	componentWillMount() {
		const { page,filter,query } = this.props
		if(typeof page === 'number') {
			this.setState({filter,query})
			this.props.history.push(`/posts?page=${page}`)
		}else{
			this.props.history.push(`/posts`)
			this.props.getPost(0)
		}
	}
	_search() {
		this.props.history.push(`/posts?page=0`)
		this.props.getPostBy(this.state.filter,this.state.query.trim())
	}
	_goPage(page) {
		this.props.history.push(`/posts?page=${page}`)
		this.props.getPost(page)
	}
	render() {
		return(
			<div>
				<div className="page-header">
					<Form inline onSubmit={(e) => e.preventDefault()}>
						<FormGroup>
							<div className="btn-group">
								<Link className="btn btn-default" to="/video/edit">发布视频</Link>
								<button onClick={() => this.props.getUnCls()} type="button" className="btn btn-default">未定义标签</button>
								<button onClick={() => this.props.getVideoPost()} type="button" className="btn btn-default">视频</button>
							</div>
						</FormGroup>
						{' '}
						<FormGroup>
							<FormControl componentClass="select" placeholder="select" value={this.state.filter} onChange={this.onChangeFilter}>
								<option value="">全部</option>
								<option value="isRec">推荐</option>
								<option value="isR18">R18</option>
								<option value="isBlk">屏蔽</option>
							</FormControl>
						</FormGroup>
						{' '}
						<FormGroup>
							<InputGroup>
								<FormControl type="text" placeholder="Search by Tag" value={this.state.query} onKeyDown={e => e.keyCode === 13 && this.search()}  onChange={this.onChangeQuery} />
								<InputGroup.Button>
									<Button onClick={this.search}>搜索</Button>
								</InputGroup.Button>
							</InputGroup>
						</FormGroup>
					</Form>
				</div>
				<Row>
					<PostPanels/>
				</Row>
				<Row style={{textAlign:'center'}}>
					<ReactPaginate 
						previousLabel={<span>&laquo;</span>}
						nextLabel={<span>&raquo;</span>}
						breakLabel={<span>...</span>}
						breakClassName={"break-me"}
						pageCount={this.props.totalPages}
						marginPagesDisplayed={2}
						pageRangeDisplayed={5}
						onPageChange={obj => this.goPage(obj.selected)}
						containerClassName={"pagination"}
						subContainerClassName={"pages pagination"}
						forcePage={parsePage(this.props.location.search)}
						activeClassName={"active"} />
				</Row>
			</div>
		)
	}
}

