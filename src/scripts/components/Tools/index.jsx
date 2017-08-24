import React,{ Component } from 'react'
import { Input,FormControl,Radio,Button,Row,Col } from 'react-bootstrap'
import Request from 'superagent'
import { Link } from 'react-router-dom'

export default class extends Component {
	constructor(props) {
	  	super(props);
	
	  	this.state = {
			toysdailyId:'',
			toysdailyPage:'',

			toypeopleId:'',

			newsgammeId:'',

			goodsmileId:'',

			json:'',
	  	}
		this.toysdaily = this._toysdaily.bind(this)
		this.toypeople = this._toypeople.bind(this)
		this.newsgamme = this._newsgamme.bind(this)
		this.goodsmile = this._goodsmile.bind(this)
		this.moefigure = this._moefigure.bind(this)
		this.addPage = this._addPage.bind(this)
	}

	_toysdaily() {
		const { toysdailyId,toysdailyPage } = this.state
		Request.get('/api/crawl/toysdaily')
		.query({ id:toysdailyId,pages:toysdailyPage })
		.end((err,res) => {
			if(!err){
				this.setState({
					toysdailyId:'',toysdailyPage:''
				})
			}
		})
	}
	_toypeople() {
		const { toypeopleId } = this.state
		Request.get('/api/crawl/toypeople')
		.query({ id:toypeopleId })
		.end((err,res) => {
			if(!err){
				this.setState({ toypeopleId:'' })
			}
		})
	}
	_newsgamme() {
		const { newsgammeId } = this.state
		Request.get('/api/crawl/newsgamme')
		.query({ id:newsgammeId })
		.end((err,res) => {
			if(!err){ this.setState({ newsgammeId:'' }) }
		})
	}
	_goodsmile() {
		const { goodsmileId } = this.state
		Request.get('/api/crawl/goodsmile')
		.query({ id:goodsmileId })
		.end((err,res) => {
			if(!err){ this.setState({ goodsmileId:'' }) }
		})
	}
	_moefigure() {
		const { moefigureId } = this.state
		Request.get('/api/crawl/moefigure')
		.query({ id:moefigureId })
		.end((err,res) => {
			if(!err){ this.setState({ moefigureId:'' }) }
		})
	}
	_addPage() {
		let raw
		try {
			raw = JSON.parse(this.state.json)
		}catch(e) {
			console.log(e)
			return alert('json解析出错了')
		}
		const { title,pageType,nodes } = raw
		if(title.trim() == ''){
			return alert('title为空')
		}
		if(pageType.trim() == ''){
			return alert('pageType为空')
		}
		if(!nodes.length){
			return alert('节点长度为0')
		}
		Request.post(`/api/crawl/json`)
		.send(raw)
		.end((err,res) => {
			if(!err){
				alert('添加文章成功')
				this.setState({ json:'' })
			}
		})
	}
	render() {
		return(
			<div className="p-3">
				<div>
				    <h3>玩具日报</h3>
				  	<Row>
						<Col sm={4}>
							<FormControl value={this.state.toysdailyId} placeholder="ID" type="text" onChange={e => this.setState({toysdailyId:e.target.value})}/>
						</Col>
						<Col sm={4}>
							<FormControl value={this.state.toysdailyPage} placeholder="页数" type="text" onChange={e => this.setState({toysdailyPage:e.target.value})}/>
						</Col>
						<Col sm={4}>
							<button className="btn red btn-outline" onClick={this.toysdaily}>爬取</button>
						</Col>
					</Row>
				    <h3>玩具人</h3>
					<Row>
						<Col sm={8}>
							<FormControl value={this.state.toypeopleId} placeholder="ID" type="text" onChange={e => this.setState({toypeopleId:e.target.value})}/>
						</Col>
						<Col sm={4}>
							<button className="btn red btn-outline" onClick={this.toypeople}>爬取</button>
						</Col>
					</Row>
				    <h3>宅宅新闻</h3>
					<Row>
						<Col sm={8}>
							<FormControl value={this.state.newsgammeId} placeholder="ID" type="text" onChange={e => this.setState({newsgammeId:e.target.value})}/>
						</Col>
						<Col sm={4}>
							<button className="btn red btn-outline" disabled={this.state.loading} onClick={this.newsgamme}>爬取</button>
						</Col>
					</Row>
				    <h3>GoodSmile</h3>
					<Row>
						<Col sm={8}>
							<FormControl value={this.state.goodsmileId} placeholder="ID" type="text" onChange={e => this.setState({goodsmileId:e.target.value})}/>
						</Col>
						<Col sm={4}>
							<button className="btn red btn-outline" disabled={this.state.loading} onClick={this.goodsmile}>爬取</button>
						</Col>
					</Row>
				    <h3>Moefigure</h3>
					<Row>
						<Col sm={8}>
							<FormControl value={this.state.moefigureId} placeholder="ID" type="text" onChange={e => this.setState({moefigureId:e.target.value})}/>
						</Col>
						<Col sm={4}>
							<button className="btn red btn-outline" disabled={this.state.loading} onClick={this.moefigure}>爬取</button>
						</Col>
					</Row>
					<h3>添加JSON文章</h3>
					<Row>
						<Col sm={8}>
							<textarea onChange={(e) => this.setState({json:e.target.value})} value={this.state.json} style={{width:'100%',resize:'vertical'}}></textarea>
						</Col>
						<Col sm={4}>
							<button className="btn red btn-outline"onClick={this.addPage}>添加</button>
						</Col>
					</Row>
					<Row>
						<Col sm={8}>
							<span style={{fontSize:24}}>每周精选</span>
						</Col>
						<Col sm={4}>
							<Link to="/weekpage" className="btn red btn-outline">编辑</Link>
						</Col>
					</Row>

				</div>
			</div>

		)
	}
}