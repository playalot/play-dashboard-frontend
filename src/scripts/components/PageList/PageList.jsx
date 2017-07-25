import React,{Component} from 'react'
import {Link} from 'react-router-dom'
import {Row, Button,Form,FormGroup,InputGroup,FormControl, Modal} from 'react-bootstrap'
import Moment from 'moment'
import Request from 'superagent'
import ReactPaginate from 'react-paginate'
import DatePicker from 'react-datepicker'

import PagePanel from '../PagePanel'
import PlayAutoSuggest from '../Common/PlayAutoSuggest'
import PlaySwitch from '../Common/playSwitch'
import { parsePage } from '../../widgets/parse'
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
	          <div className="page-header">
	            <Form inline onSubmit={(e) => e.preventDefault()}>
            	  <Link to="/page/edit"><button type="button" className="btn green btn-outline">发布文章</button></Link>
            	  {' '}
	              <FormGroup>
	                <FormControl componentClass="select" placeholder="select" value={this.state.filter} onChange={(e) => this.setState({filter:e.target.value},this.search)}>
	                  <option value="">全部</option>
	                  <option value="forShare">分享</option>
										<option value="isRec">推荐</option>
										<option value="isBlk">屏蔽</option>
									</FormControl>
								</FormGroup>
								{' '}
	              <FormGroup>
	                <InputGroup>
	                  <FormControl type="text" placeholder='输入关键字' value={this.state.query} onKeyDown={e => e.keyCode === 13 && this.search()} onChange={(e) => this.setState({query:e.target.value})} />
	                  <InputGroup.Button>
	                    <Button onClick={this.search}>搜索</Button>
	                  </InputGroup.Button>
	                </InputGroup>
	              </FormGroup>
	            </Form>
	          </div>
	          <PagePanel/>
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

