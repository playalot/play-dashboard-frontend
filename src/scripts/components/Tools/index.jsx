import React,{ Component } from 'react'
import { Input,FormControl,Radio,Button,Row,Col } from 'react-bootstrap'
import Request from 'superagent'

export default class extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	id:'',
	  	pages:'',
	  	loading:false
	  };
	  this.toysdaily = this._toysdaily.bind(this)
	}
	_toysdaily() {
		const { id,pages,loading } = this.state
		if(loading){
			return
		}
		this.setState({loading:true})
		Request.get('/api/crawl/toysdaily')
		.query({ id,pages })
		.end((err,res) => {
			if(!err){
				this.setState({
					id:'',pages:'',loading:false
				})
			}
		})
	}
	render() {
		return(
			<div style={{padding:20}}>
				<div>
				  	<div>
				    	<h3 className="box-title">玩具日报</h3>
				  	</div>
				  	<div>
				  		<Row>
				  			<Col sm={4}>
			                  <FormControl value={this.state.id} placeholder="ID" type="text" onChange={e => this.setState({id:e.target.value})}/>
			                </Col>
			                <Col sm={4}>
			                  <FormControl value={this.state.pages} placeholder="页数" type="text" onChange={e => this.setState({pages:e.target.value})}/>
			                </Col>
			                <Col sm={4}>
			                	<button className="btn red btn-outline" disabled={this.state.loading} onClick={this.toysdaily}>爬取</button>
			                </Col>
				  		</Row>
				  	</div>
				</div>
			</div>

		)
	}
}