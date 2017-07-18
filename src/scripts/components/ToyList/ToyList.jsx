import React,{ Component } from 'react'
const _ = require('lodash')
import {
	Col, Row, Modal, Form, FormGroup, InputGroup, FormControl, Button, ButtonToolbar, DropdownButton, Checkbox
} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Request from 'superagent'
import DatePicker from 'react-datepicker'
import Moment from 'moment'
import ReactPaginate from 'react-paginate'
import CopyToClipboard from 'react-copy-to-clipboard'
import { parsePage } from '../../widgets/parse'
export default class Toy extends Component{
	constructor(props) {
		super(props)
		this.state = {
			filter: '',
			query: '',
			sort: 'created',
			month:'',
			year:'',
			showModal:false,
			id:'',
			name:'',
			preview:'',
			quantity:100,
			price:9999,
			originPrice:0,
			merchant:'PLAY玩具控',
			freight:0,
			type:'inStock',
			prepay:0,
			orderClose:Moment(),
			costPrice:0,
			version:'',
			tbUrl:'',

			selectedToy:null,
		}
		this.onChangeSort = (e) => this.setState({sort:e.target.value},this.search)
		this.onChangeFilter = (e) => this.setState({filter:e.target.value},this.search)
		this.onChangeQuery = (e) => this.setState({query:e.target.value})
		this.onChangeYear= (e) => this.setState({year:e.target.value},this.search)
		this.onChangeMonth = (e) => this.setState({month:e.target.value},this.search)
		this.open = () => this.setState({ showModal: true })
		this.close = () => this.setState({
			showModal: false,
			id:'',
			name:'',
			quantity:100,
			price:9999,
			originPrice:0,
			costPrice:0,
			merchant:'PLAY玩具控',
			freight:0,
			costPrice:0,
			version:'',
			tbUrl:'',
		})
		this.submit = () => {
			const {
				id,price,originPrice,merchant,quantity,freight, prepay, orderClose, type, costPrice,version,tbUrl
			} = this.state
			let data = {
				price:parseFloat(price),merchant,costPrice:parseFloat(costPrice),
				quantity:parseInt(quantity),freight:parseFloat(freight),preOrder:{
					prepay:parseFloat(prepay),
					orderClose:`${orderClose.format('YYYY-MM-DD')} 23:59:59`
				},version,tbUrl
			}
		// Object.keys(data).forEach(key => !data[key] && data[key] !== 0 ? delete data[key] : null)
		type ==='preOrder' ? null:delete data['preOrder']
		version.trim() ? null : delete data['version']
        tbUrl.trim() ? null : delete data['tbUrl'] 
			Request
				.post(`/api/toy/${id}/stock`)
				.send(data)
				.end((err,res) => {
					if(err) {
						console.warn(err)
					}else{
						this.close()
						alert('添加商品成功')
					}
				})
		}
		this.recommend = this._recommend.bind(this)
		this.addStock = this._addStock.bind(this)
		this.toggleR18 = (id) => this.props.toggleR18(id)
		this.toggleRecommend = (id) => this.props.toggleRecommend(id)
		this.deletetoy = this._deletetoy.bind(this)
		this.addtoy = this._addtoy.bind(this)
		this.changeOrderClose = (date) => this.setState({orderClose:date})
		this.search = this._search.bind(this)
	  	this.goPage = this._goPage.bind(this)

	  	this.closeClass = () => this.setState({ selectedToy: null })
	  	this.addToyClass = (tid,c) => this._addToyClass(tid,c)
	  	this.removeToyClass = (tid,c) => this._removeToyClass(tid,c)
	}
	componentWillMount() {
		if(!this.props.toyLoaded){
			this.props.fetchToyClass()
		}
		const { page,filter,query,sort,month,year } = this.props
		if(typeof page === 'number') {
			this.props.history.push(`/toys?page=${page}`)
			this.setState({filter,query,sort,month,year})
		}else{
			this.props.getToy(0)
		}
	}
	_deletetoy(id) {
		if (confirm('Delete this toy?')) {
			this.props.deleteToy(id)
			}
	}
	_recommend(id) {
		if (confirm('推荐这个玩具?')) {
			this.props.recommend(id)
			}
	}
	_addtoy() {
		if (confirm('创建一个新的玩具？')) {
					this.props.addToy()
			}
	}
	_addStock(id,name,preview) {
		this.setState({
			id,name,preview
		},() => {
			this.open()
		})
	}
	_goPage(page) {
		this.props.history.push(`/toys?page=${page}`)
		this.props.getToy(page)
	}
	_search() {
		this.props.history.push(`/toys?page=0`)
		const { filter,query,sort,year,month } = this.state
		this.props.getToyBy(filter,query.trim(),sort,year,month)
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
					            {
					             	cls.map((c,i) => {
					             		return (
					             			<span key={`sku_toy_class_no_sel_${i}`}
					             			className='label label-info label-margin'
					             			onClick={() => this.addToyClass(this.state.selectedToy.id, c.id) }>{c.name}</span>
					             		)
					             	})
					            }
				            </div>
			           	</Modal.Body>
		         	</Modal>
		       	</div>
	     	)
	    }
		return(
			<div className="content">
				<div className="page-header">
					<Form inline className="form-input-filter" onSubmit={(e) => e.preventDefault()}>
						<FormGroup>
							<Col smOffset={2} style={{marginRight: '25px'}}>
								<button type="button" className="btn green btn-outline" onClick={this.addtoy}>创建新玩具</button>
							</Col>
						</FormGroup>
						<FormGroup>
							<FormControl componentClass="select" placeholder="select" value={this.state.sort} onChange={this.onChangeSort}>
								<option value="created">最新录入</option>
								<option value="releaseDate">最新发售</option>
								<option value="counts.hits">点击最多</option>
								<option value="counts.updates">本周点击最多</option>
								<option value="counts.wish">想要最多</option>
								<option value="counts.owns">拥有最多</option>
							</FormControl>
						</FormGroup>
						{' '}
						<FormGroup>
							<FormControl componentClass="select" value={this.state.filter} onChange={this.onChangeFilter}>
								<option value="">全部</option>
								<option value="isRec">推荐</option>
								<option value="isR18">R18</option>
							</FormControl>
						</FormGroup>
						{' '}
						<FormGroup>
							<FormControl componentClass="select" value={this.state.year} onChange={this.onChangeYear}>
								<option value="">全部年份</option>
								<option value="2018">2018年</option>
								<option value="2017">2017年</option>
								<option value="2016">2016年</option>
								<option value="2015">2015年</option>
								<option value="2014">2014年</option>
							</FormControl>
						</FormGroup>
						{' '}
						<FormGroup>
							<FormControl componentClass="select" value={this.state.month} onChange={this.onChangeMonth}>
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
							</FormControl>
						</FormGroup>
						{' '}
						<FormGroup>
							<InputGroup>
								<FormControl type="text" value={this.state.query} onKeyDown={e => e.keyCode === 13 && this.search()} onChange={this.onChangeQuery} />
								<InputGroup.Button>
									<Button onClick={this.search}>搜索</Button>
								</InputGroup.Button>
							</InputGroup>
						</FormGroup>
					</Form>
				</div>
				<Row>
					{this.props.toys.map((toy) => {
						let recommendClass = 'btn btn-sm';
						if (toy.isRec === true) {
							recommendClass = 'btn yellow-casablanca btn-sm';
						}
						let r18Class = 'btn btn-sm';
						if (toy.isR18 === true) {
							r18Class = 'btn yellow-casablanca btn-sm';
						}
						return (
							<Col className="col" xs={6} sm={3} lg={3} key={'toy_'+toy.id}>
								<div className="portlet bordered light" style={{padding:'12px 5px 15px 5px'}}>
									<div className="portlet-title pb-2" style={{marginBottom:0}}>
										<div className="toy-item">
											<div className="toy-item-img">
												<img src={toy.cover} alt={toy.name} />
											</div>
											<div className="toy-item-info">
												<span className="toy-item-name">{toy.name}</span>
												<span className="toy-item-desc">{'厂商 ' + toy.company}</span>
												<span className="toy-item-desc">{'发售 ' + toy.release}</span>
												<span className="toy-item-desc">{'价格 ' + toy.money? toy.money : '不知道呀'}</span>
												<span className="toy-item-desc">{'本周热度 ' + toy.counts.hits}</span>
											</div>
										</div>
									</div>
									<div className="portlet-body">
										<div>
											{toy.cls.map(c => <span key={'t_'+toy.id+'_c_'+c} className="label label-warning label-margin" >{this.props.toyClass[c].name}</span>)}
										</div>
										<div className="clearfix mb-2">
											<ButtonToolbar className="pull-right">
												<CopyToClipboard text={toy.id} onCopy={() => null}>
													<span className="btn btn-sm"><i className="fa fa-copy"></i></span>
												</CopyToClipboard>
												<Link to={'/toy/' + toy.id } ><span style={{color:'#333'}} className="btn btn-sm"><i className="fa fa-edit"></i></span></Link>
												<span onClick={() => 	this.setState({selectedToy:toy})} className="btn btn-sm"><i className="fa fa-th-large"></i></span>
												<span onClick={() =>	this.recommend(toy.id) } className="btn btn-sm"><i className="fa fa-bookmark-o"></i></span>
												<span onClick={() =>	this.toggleR18(toy.id) } className={r18Class}><i className="fa fa-venus-mars"></i></span>
												<span onClick={() =>	this.toggleRecommend(toy.id) } className={recommendClass}><i className="fa fa-thumbs-o-up"></i></span>
												<span onClick={() =>	this.deletetoy(toy.id) } className="btn btn-sm"><i className="fa fa-trash"></i></span>
											</ButtonToolbar>
										</div>
										<div className="clearfix">
											<ButtonToolbar className="pull-right">
												<a target="_blank" href={`http://www.playalot.cn/toy/${toy.id}`} className="btn yellow btn-outline btn-sm">查看详情</a>
												<span onClick={() => this.props.history.push(`/sku/${toy.id}`) } className="btn blue btn-outline btn-sm">添加该商品库存</span>
											</ButtonToolbar>
										</div>
									</div>
								</div>
							</Col>
						)
					})}
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
				{modal}
			</div>
		)
	}
}
