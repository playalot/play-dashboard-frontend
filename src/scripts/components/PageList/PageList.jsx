import React,{Component} from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router'
import {Row, Button,Form,FormGroup,InputGroup,FormControl, Modal} from 'react-bootstrap'
import Moment from 'moment'
import Request from 'superagent'
import ReactPaginate from 'react-paginate'
import DatePicker from 'react-datepicker'

import PlayAutoSuggest from '../Common/PlayAutoSuggest'
import PlaySwitch from '../Common/playSwitch'
export default class PageList extends Component{
	constructor(props) {
	  	super(props)
	  	this.state = {
	  		filter:'',
	  		query:'',
	  		showModal:false,
	  		pid:'',
	  		toyId:'',

	  		curPageId:null,
	  		curDate:Moment().startOf('day'),
	  		curTime:'15-30'
	  	}
	  	this.togglePub = (id) => this.props.togglePub(id)
	  	this.toggleRec = (id) => this.props.toggleRec(id)
	  	this.toggleShare = (id) => this.props.toggleShare(id)
	  	this.deleteArticle = this._deleteArticle.bind(this)
	  	this.addToy = (pid) => this.setState({showModal:true,pid})
	  	this.removeToy = (id) => confirm('删除这个玩具标签?') && this.props.removeToy(id)

	  	this.goPage = this._goPage.bind(this)
	  	this.search = this._search.bind(this)
	  	//玩具搜索
	  	this.close = () => this.setState({showModal:false,pid:'',toyId:''})
	  	this.setTime = this._setTime.bind(this)
	}
	componentWillMount() {
		const { page,query,filter } = this.props
		if(typeof page === 'number') {
			this.context.router.push(`/page?page=${page}`)
			this.setState({filter,query})
		}else{
			this.props.getPage(this.props.location.query.page)
		}
	}
	_deleteArticle(id) {
		if (confirm('删除这个文章?')) {
			this.props.deleteArticle(id)
		}
	}
	_goPage(page) {
		this.context.router.push(`/page?page=${page}`)
		this.props.getPage(page)
	}
	_search() {
		this.context.router.push(`/page?page=0`)
		this.props.getPageBy(this.state.filter,this.state.query.trim())
	}
	_setTime() {
		const { curDate, curTime, curPageId } = this.state
		if(!curTime.match(/[0-2][0-9]-[0-5][0-9]/)){
			return alert('时间格式不对')
		}
		const arr = curTime.split('-')
		const created = curDate.valueOf() + arr[0]*3600000 + arr[1]*60000
		Request.post(`/api/page/${curPageId}/created`)
		.send({created})
		.end((err,res) => {
			if(!err) {
				this.setState({curPageId:null})
			}
		})
	}
	render() {
		const inputProps = {
			placeholder: '输入玩具关键字',
			value: this.state.toyQuery,
			onChange: this.onChangeToyQuery,
	    }
		return(
			<div className="content pagelist">
	          <div className="page-header">
	            <Form inline onSubmit={(e) => e.preventDefault()}>
            	  <Link to="/page/edit"><Button bsStyle='success'>发布文章</Button></Link>
            	  {' '}
	              <FormGroup>
	                <FormControl componentClass="select" placeholder="select" value={this.state.filter} onChange={(e) => this.setState({filter:e.target.value})}>
	                  <option value="">全部</option>
	                  <option value="forShare">分享</option>
					  <option value="isRec">推荐</option>
					  <option value="isBlk">屏蔽</option>
	                </FormControl>
	              </FormGroup>
				  			{' '}
	              <FormGroup style={{marginLeft:10}}>
	                <InputGroup>
	                  <FormControl type="text" placeholder='输入关键字' value={this.state.query} onKeyDown={e => e.keyCode === 13 && this.search()} onChange={(e) => this.setState({query:e.target.value})} />
	                  <InputGroup.Button>
	                    <Button onClick={this.search}>搜索</Button>
	                  </InputGroup.Button>
	                </InputGroup>
	              </FormGroup>
	            </Form>
	          </div>
	          <div className="table-responsive">
	            <table className="table table-striped">
	              <tbody>
	                {this.props.pages.map((page) => {
	                	let isPubClass = page.isPub === true ? 'btn btn-sm' : 'btn bg-orange btn-sm'
	                	let recommendClass = page.isRec === true ? 'btn bg-orange btn-sm' : 'btn btn-sm'
	                	let shareClass = page.forShare ? 'btn bg-orange btn-sm' : 'btn btn-sm'
	                  return (
	                    <tr key={page.id}>
	                      <td>
	                      	<img src={page.cover} className="page-cover"/>
	                      </td>
	                      <td>
	                      	
	                      	  {page.title}<a target="_blank" href={`http://www.playalot.cn/page/${page.id}`}>[预览]</a>
	                      	
	                      </td>
	                      <td><Link to={'/user/'+page.user.id}><img style={{width:'45px'}} src={page.user.avatar} className="img-circle"/></Link></td>
	                      <td>{page.category}</td>
	                      <td style={{whiteSpace:'inherit'}}>
	                      	{
	                      		page.tags.map((tag,index) => {
	                      			return (<span className="label label-info label-margin" key={`tag_${index}`}>{tag}</span>)
	                      		})
	                      	}
	                      	{
								page.toys.map((toy, index) => {
	                      		 	return (
										<span key={`toy_${index}`} className="label label-success label-margin">
	                      			 		{ toy.name.substring(0, 25)+'...' }
	                      			 		<i className="fa fa-close" onClick={ () => this.removeToy(page.id)}></i>
	                      			 	</span>
	                      			 )
								})
	                      	}
	                      </td>
	                      <td>
	                      	<div className="page-flex-column">
		                      	<span style={{marginBottom:10}}>{page.counts.views} views</span>
		                      	<span onClick={() => this.setState({curPageId:page.id})}>
		                      		{Moment.unix(page.created / 1000).fromNow()}
		                      	</span>
	                      	</div>
	                      </td>
	                      <td>
	                      	<PlaySwitch 
	                      		on="L"
	                      		off="S"
	                      		active={page.coverType === 'l'} 
	                      		onChange={value => this.props.setCoverType(value,page.id)}
	                      	/>
	                      </td>
	                      <td style={{width:150}}> 
	                      	<div className="page-flex-column">
		                      	<div>
		                      		<Link to={`/page/edit/${page.id}` }><span style={{color:'#333'}} className="btn btn-sm"><i className="fa fa-edit"></i></span></Link>
		                      		<span style={{color:'#333'}} onClick={() => this.togglePub(page.id)} className={isPubClass}><i className="fa fa-eye-slash"></i></span>
		                      		<span style={{color:'#333'}} onClick={() => this.deleteArticle(page.id)} className="btn btn-sm"><i className="fa fa-trash"></i></span>
		                      	</div>
		                      	<div>
		                      		<span style={{color:'#333'}} onClick={() => this.addToy(page.id)} className="btn btn-sm"><i className="fa fa-plus"></i></span>
		                      		<span style={{color:'#333'}} onClick={() => this.toggleRec(page.id)} className={recommendClass}><i className="fa fa-thumbs-o-up"></i></span>
		                      		<span style={{color:'#333'}} onClick={() => this.toggleShare(page.id)} className={shareClass}><i className="fa fa-share-square-o"></i></span>
		                      	</div>
	                      	</div>
	                      </td>
	                    </tr>
	                  )
	                })}
	                <tr></tr>
	              </tbody>
	            </table>
	          </div>
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
					forcePage={this.props.location.query.page ? parseInt(this.props.location.query.page) : 0}
					activeClassName={"active"} />
	          </Row>
	          	<Modal show={this.state.showModal} onHide={this.close}>
		          	<Modal.Header closeButton>
		            	<Modal.Title>搜索玩具</Modal.Title>
		          	</Modal.Header>
		          	<Modal.Body>
		          		<InputGroup>
		                  <FormControl type="text" placeholder='输入玩具ID' value={this.state.toyId} onChange={(e) => this.setState({toyId:e.target.value})} />
		                  <InputGroup.Button>
		                    <Button onClick={() => {
		                    	this.props.addToy(this.state.pid,this.state.toyId)
		                    	this.close()
		                    }}>添加玩具</Button>
		                  </InputGroup.Button>
		                </InputGroup>
		                <br/>
		            	<PlayAutoSuggest
							fetch={(o) => this.props.fetchToyByQuery(o.value)}
							clear={this.props.clearSuggestion}
							getValue={suggestion => suggestion.name}
							selectValue={(event,{suggestion, suggestionValue, method }) => {
								this.props.addToy(this.state.pid,suggestion.id)
	  							this.close()
							}}
							desc="release"
							placeholder="请输入玩具关键字"
							results={this.props.toyResults}
						/>
	          		</Modal.Body>
	        	</Modal>
	        	<Modal show={!!this.state.curPageId} onHide={() => this.setState({curPageId:null})}>
	        		<Modal.Header closeButton>
		            	<Modal.Title>修改发布时间</Modal.Title>
		          	</Modal.Header>
	                <Modal.Body>
	               		<DatePicker
							selected={this.state.curDate}
							onChange={(date) => this.setState({curDate:date})}
							maxDate={Moment()}
							dateFormat="YYYY/MM/DD"
						/>
						<input style={{marginLeft:20}} type="text" value={this.state.curTime} onChange={(e) => this.setState({curTime:e.target.value})}/>
	                </Modal.Body>
	                <Modal.Footer>
	                	<Button onClick={this.setTime}>修改</Button>
	                </Modal.Footer>
	            </Modal>
	        </div>
		)
	}
}

PageList.contextTypes = {
  	router : PropTypes.object
}
