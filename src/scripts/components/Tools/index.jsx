import React,{ Component } from 'react'
import Request from 'superagent'
import { Link } from 'react-router-dom'

export default class extends Component {
	constructor(props) {
	  	super(props);
	
	  	this.state = {
			toysdailyId:'',
			toysdailyPage:1,

			toypeopleId:'',

			newsgammeId:'',

			goodsmileId:'',

			moefigureId:'',
			moefigurePage:1,

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
					toysdailyId:'',toysdailyPage:1
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
		const { moefigureId,moefigurePage } = this.state
		Request.get('/api/crawl/moefigure')
		.query({ id:moefigureId,pages:moefigurePage })
		.end((err,res) => {
			if(!err){ this.setState({ moefigureId:'',moefigurePage:1 }) }
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
				    <h4>玩具日报</h4>
					<div className="row mb-3">
						<div className="col-4">
							<input className="form-control" value={this.state.toysdailyId} placeholder="ID" type="text" onChange={e => this.setState({toysdailyId:e.target.value})}/>
						</div>
						<div className="col-4">
							<input className="form-control" value={this.state.toysdailyPage} placeholder="页数" type="text" onChange={e => this.setState({toysdailyPage:e.target.value})}/>
						</div>
						<div className="col-4">
							<button className="btn btn-outline-primary" onClick={this.toysdaily}>爬取</button>
						</div>
					</div>

				    <h4>玩具人</h4>
					<div className="row mb-3">
						<div className="col-8">
							<input className="form-control" value={this.state.toypeopleId} placeholder="ID" type="text" onChange={e => this.setState({toypeopleId:e.target.value})}/>
						</div>
						<div className="col-4">
							<button className="btn btn-outline-primary" onClick={this.toypeople}>爬取</button>
						</div>
					</div>
				  
				    <h4>宅宅新闻</h4>
					<div className="row mb-3">
						<div className="col-8">
							<input className="form-control" value={this.state.newsgammeId} placeholder="ID" type="text" onChange={e => this.setState({newsgammeId:e.target.value})}/>
						</div>
						<div className="col-4">
							<button className="btn btn-outline-primary" disabled={this.state.loading} onClick={this.newsgamme}>爬取</button>
						</div>
					</div>
				    <h4>GoodSmile</h4>
					<div className="row mb-3">
						<div className="col-8">
							<input className="form-control" value={this.state.goodsmileId} placeholder="ID" type="text" onChange={e => this.setState({goodsmileId:e.target.value})}/>
						</div>
						<div className="col-4">
							<button className="btn btn-outline-primary" disabled={this.state.loading} onClick={this.goodsmile}>爬取</button>
						</div>
					</div>
				    <h4>Moefigure</h4>
					<div className="row mb-3">
						<div className="col-4">
							<input className="form-control" value={this.state.moefigureId} placeholder="ID" type="text" onChange={e => this.setState({moefigureId:e.target.value})}/>
						</div>
						<div className="col-4">
							<input className="form-control" value={this.state.moefigurePage} placeholder="页数" type="text" onChange={e => this.setState({moefigurePage:e.target.value})}/>
						</div>
						<div className="col-4">
							<button className="btn btn-outline-primary" disabled={this.state.loading} onClick={this.moefigure}>爬取</button>
						</div>
					</div>
					<h4>添加JSON文章</h4>
					<div className="row mb-3">
						<div className="col-8">
							<textarea onChange={(e) => this.setState({json:e.target.value})} value={this.state.json} style={{width:'100%',resize:'vertical'}}></textarea>
						</div>
						<div className="col-4">
							<button className="btn btn-outline-primary"onClick={this.addPage}>添加</button>
						</div>
					</div>
					<div className="row mb-3">
						<div className="col-8">
							<span style={{fontSize:24}}>每周精选</span>
						</div>
						<div className="col-4">
							<Link to="/weekpage" className="btn btn-outline-primary">编辑</Link>
						</div>
					</div>

				</div>
			</div>

		)
	}
}