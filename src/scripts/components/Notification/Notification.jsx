import React, { Component } from 'react'
import { Input,FormControl,Radio,Button,Row,Col } from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import Request from 'superagent'
import Moment from 'moment'
export default class extends Component {
	constructor(props) {
	  	super(props);
	
	  	this.state = {
	  		message:'',
	  		timeType:'now',
	  		targetType:'page',
	  		targetId:'',
	  		date:Moment(),
	  		time:Moment().add(5,'m').format("HH:mm:ss")
	  	}
	  	this.send = this._send.bind(this)
	}
	_send() {
		const { message,date,time,targetId,timeType,targetType } = this.state
		if(message.trim() === ''){
			return alert('请输入标题')
		}
		if(targetId.trim() === ''){
			return alert('请输入目标ID')
		}
		if(confirm('确定推送吗?')){
			const data = {
				message,
				extra:{
					targetType,
					targetId,
					type:targetType
				}
			}
			if(timeType !== 'now'){
				data.times = `${date.format('YYYY-MM-DD')} ${time}`
			}
			Request.post('/api/push').send(data).end((err,res) => {
				if(!err){
					this.setState({
						message:'',
				  		timeType:'now',
				  		targetType:'page',
				  		targetId:'',
				  		date:Moment(),
				  		time:Moment().add(5,'m').format("HH:mm:ss")
					},() => alert('推送成功'))
				}else{
					alert('推送出错')
				}
			})
		}
		
	}
	render() {
		const radioOptions = [
	        {value: 'post', label: '图片'},
	        {value: 'tag', label: '标签'},
	        {value: 'user', label: '用户'},
	        {value: 'url', label: 'URL链接'},
	        {value: 'page', label: '文章'},
	        {value: 'toy', label: '玩具'},
	        {value: 'promotion', label: '商品集'},
	        {value: 'toyindex', label: '玩具集'},
	    ]
		return(
			<div style={{padding:20}}>
				<div className="box">
				  	<div className="box-header with-border text-center">
				    	<h3 className="box-title">推送</h3>
				  	</div>
				  	<div className="box-body">
				    	<FormControl placeholder="标题" value={this.state.message} type="text" onChange={(e) => this.setState({message:e.target.value})}/>
				  	</div>
				  	<div className="box-body">
				  		<Radio inline name="timeType" value="now" onChange={(e) => this.setState({timeType:e.target.value})} checked={'now' == this.state.timeType}>立即推送</Radio>
				  		<Radio inline name="timeType" value="setTime" onChange={(e) => this.setState({timeType:e.target.value})} checked={'setTime' == this.state.timeType}>延时推送</Radio>
		                {
		                	this.state.timeType !== 'now' ? 
		                	<div style={{display:'inline-block',paddingLeft:20}}>
			                	<DatePicker
									selected={this.state.date}
									onChange={(date) => this.setState({date})}
									minDate={Moment()}
									dateFormat="YYYY/MM/DD"
								/>
								<input style={{marginLeft:10}} type="text" value={this.state.time} type="text" onChange={(e) => this.setState({time:e.target.value})} />
		                	</div>
							:null
		                }
				  	</div>
				  	<hr/>
				  	<div className="box-body">
			  			{
	                    	radioOptions.map((targetType,i) => {
		                      	return(
		                        	<Radio key={`target_type_${i}`} inline name="targetType" value={targetType.value} onChange={(e) => this.setState({targetType:e.target.value})} checked={targetType.value == this.state.targetType}>{targetType.label}</Radio>
		                      	)
		                    })
	                  	}
				  	</div>
				  	<div className="box-body">
				  		<FormControl placeholder="目标ID" value={this.state.targetId} type="text" onChange={(e) => this.setState({targetId:e.target.value})}/>
				  	</div>
				</div>
				<Button bsStyle="primary" onClick={this.send}>推送</Button>
			</div>

		)
	}
}