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
	  		sort: 'created'
	  	}
	  	this.onChangeSort = (e) => this.setState({sort:e.target.value})
	  	this.onChangeFilter = (e) => this.setState({filter:e.target.value})
	  	this.onChangeQuery = (e) => this.setState({query:e.target.value})
	  	this.search = () => this.props.fetchToys(this.state.filter,this.state.query.trim(),this.state.sort)


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
			this.props.deletetoy(id)
	    }
	}
	_recommend(id) {
		if (confirm('推荐这个玩具?')) {
			this.props.recommend(id)
    	}
	}
	_addtoy() {
		if (confirm('创建一个新的玩具？')) {
      		this.props.addtoy()
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
		              <FormControl componentClass="select" placeholder="select" value={this.state.filter} onChange={this.onChangeFilter}>
		                <option value="">全部</option>
		                <option value="isRec">推荐</option>
		                <option value="isR18">R18</option>
		              </FormControl>
		            </FormGroup>
		            <FormGroup>
		                <InputGroup>
		                  <FormControl type="text" value={this.state.query} onKeyDown={this.stop} onChange={this.onChangeQuery} />
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
		                      <ul className="products-list product-list-in-box">
		                        <li className="item">
		                          <Link to={'/toy/' + toy.id + '/edit'} >
		                          <div className="product-img">
		                            <img src={toy.cover} alt={toy.name} />
		                          </div>
		                          <div className="product-info">
		                            <p className="product-title">{toy.name}</p>
		                            <span className="product-description">
		                              {toy.company} <br/>
		                              {toy.release} <br/>
		                              {toy.money}
		                            </span>
		                          </div>
		                          </Link>
		                        </li>
		                      </ul>
		                    </div>
		                    <div className="box-footer">
		                      <ButtonToolbar className="pull-right">
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
