import React,{ Component } from 'react'
const _ = require('lodash')
import {
	Col, Row, Modal, Form, FormGroup, InputGroup, FormControl, Button, ButtonToolbar, DropdownButton
} from 'react-bootstrap'
import { Link } from 'react-router'

export default class toyList extends Component{
	constructor(props) {
	  	super(props)

	  	this.state = {
	  		filter: '',
	  		query: '',
	  		sort: 'created',
	  		month:'',
	  		year:'',
	  	}
	  	this.onChangeSort = (e) => this.setState({sort:e.target.value})
	  	this.onChangeFilter = (e) => this.setState({filter:e.target.value})
	  	this.onChangeQuery = (e) => this.setState({query:e.target.value})
	  	this.onChangeYear= (e) => this.setState({year:e.target.value})
	  	this.onChangeMonth = (e) => this.setState({month:e.target.value})
	  	this.search = () => this.props.fetchToys(this.state.filter,this.state.query.trim(),this.state.sort,this.state.year,this.state.month)
	  	this.searchNew = () => this.props.fetchToys(this.state.filter,this.state.query.trim(),this.state.sort,this.state.year,this.state.month,true)

	  	this.recommend = this._recommend.bind(this)
	  	this.toggleR18 = (id) => this.props.toggleR18(id)
	  	this.toggleRecommend = (id) => this.props.toggleRecommend(id)
	  	this.deletetoy = this._deletetoy.bind(this)
	  	this.addtoy = this._addtoy.bind(this)

	  	this.stop = (e) => {
	  		if(e.keyCode === 13){
	  			e.preventDefault()
	  		}
	  	}
	}
	componentWillMount() {
		if(!this.props.loaded){
			this.props.fetchToys(this.state.filter,this.state.query.trim(),this.state.sort)
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
	render() {
		return(
			<div className="content">
		        <div className="page-header">
		          <Form inline className="form-input-filter">
		            <FormGroup>
		              <Col smOffset={2} style={{marginRight: '25px'}}>
		                <Button bsStyle='success' onClick={this.addtoy}>创建新玩具</Button>
		              </Col>
		            </FormGroup>
		            <FormGroup>
		              <FormControl componentClass="select" placeholder="select" value={this.state.sort} onChange={this.onChangeSort}>
		                <option value="created">最新录入</option>
		                <option value="releaseDate">最新发售</option>
		                <option value="counts.hits">点击最多</option>
		                <option value="counts.wish">想要最多</option>
		                <option value="counts.owns">拥有最多</option>
		              </FormControl>
		            </FormGroup>
		            
		            <FormGroup>
		              <FormControl componentClass="select" value={this.state.filter} onChange={this.onChangeFilter}>
		                <option value="">全部</option>
		                <option value="isRec">推荐</option>
		                <option value="isR18">R18</option>
		              </FormControl>
		            </FormGroup>
		            <FormGroup>
		              <FormControl componentClass="select" value={this.state.year} onChange={this.onChangeYear}>
		              	<option value="">全部年份</option>
		                <option value="2016">2016年</option>
		                <option value="2015">2015年</option>
		                <option value="2014">2014年</option>
		              </FormControl>
		            </FormGroup>
		            <FormGroup>
		              <FormControl componentClass="select" value={this.state.month} onChange={this.onChangeMonth}>
		              	<option value="">全部月份</option>
		                <option value="1">一月</option>
		                <option value="2">二月</option>
		                <option value="3">三月</option>
		                <option value="4">四月</option>
		                <option value="5">五月</option>
		                <option value="6">六月</option>
		                <option value="7">七月</option>
		                <option value="8">八月</option>
		                <option value="9">九月</option>
		                <option value="10">十月</option>
		                <option value="11">十一月</option>
		                <option value="12">十二月</option>
		              </FormControl>
		            </FormGroup>
		            
		            <FormGroup>
		                <InputGroup>
		                  <FormControl type="text" value={this.state.query} onKeyDown={this.stop} onChange={this.onChangeQuery} />
		                  <InputGroup.Button>
		                    <Button onClick={this.searchNew}>搜索</Button>
		                  </InputGroup.Button>
		                </InputGroup>
		            </FormGroup>
		          </Form>
		        </div>
		        <Row>
		          {this.props.toys.map((toy) => {
		            let recommendClass = 'btn btn-sm';
		            if (toy.isRec === true) {
		              recommendClass = 'btn bg-orange btn-sm';
		            }
		            let r18Class = 'btn btn-sm';
		            if (toy.isR18 === true) {
		              r18Class = 'btn bg-orange btn-sm';
		            }
		            return (
		              <Col className="col" xs={6} sm={3} lg={3} key={'toy_'+toy.id}>
		                  <div className="box box-solid">
		                    <div className="box-body toy-item">
													<div className="toy-item-img">
			                      <img src={toy.cover} alt={toy.name} />
			                    </div>
			                    <div className="toy-item-info">
			                      <span className="toy-item-name">{toy.name}</span>
			                      <span className="toy-item-desc">{'厂商 ' + toy.company}</span>
			                      <span className="toy-item-desc">{'发售 ' + toy.release}</span>
			                      <span className="toy-item-desc">{'价格 ' + toy.money? toy.money : '不知道呀'}</span>
			                    </div>
		                    </div>
		                    <div className="box-footer">
		                      <ButtonToolbar className="pull-right">
														<Link to={'/toy/' + toy.id + '/edit'} ><span className="btn btn-sm"><i className="fa fa-edit"></i></span></Link>
		                        <span onClick={() =>  this.recommend(toy.id) } className="btn btn-sm"><i className="fa fa-bookmark-o"></i></span>
                        		<span onClick={() =>  this.toggleR18(toy.id) } className={r18Class}><i className="fa fa-venus-mars"></i></span>
                        		<span onClick={() =>  this.toggleRecommend(toy.id) } className={recommendClass}><i className="fa fa-thumbs-o-up"></i></span>
                        		<span onClick={() =>  this.deletetoy(toy.id) } className="btn btn-sm"><i className="fa fa-trash"></i></span>
		                      </ButtonToolbar>
		                    </div>
		                  </div>
		              </Col>
		            );
		          })}
		        </Row>
		        <Row>
		          <div className="load-more-btn" onClick={this.search}>Load More</div>
		        </Row>
		    </div>

		)
	}
}
