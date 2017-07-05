import React,{Component} from 'react'
import {Link} from 'react-router-dom'
import {Row, Button,Form,FormGroup,InputGroup,FormControl, Modal} from 'react-bootstrap'
import Moment from 'moment'
import Request from 'superagent'
import ReactPaginate from 'react-paginate'
import DatePicker from 'react-datepicker'

import PlayAutoSuggest from '../Common/PlayAutoSuggest'
import PlaySwitch from '../Common/playSwitch'


export default class PagePanel extends Component {
	constructor(props) {
  	super(props)
  	this.state = {
  		modalAddToy:false,
  		pageId:'',
  		toyId:'',

  		timePageId:null,
  		curDate:Moment().startOf('day'),
  		curTime:'15-30'
  	}
  	this.togglePub = (id) => this.props.togglePub(id)
  	this.toggleRec = (id) => this.props.toggleRec(id)
  	this.toggleShare = (id) => this.props.toggleShare(id)
  	this.deleteArticle = (id) => confirm('删除这个文章?') && this.props.deleteArticle(id)
  	this.addToy = (pageId) => this.setState({modalAddToy:true,pageId})
  	this.removeToy = (id) => confirm('删除这个玩具标签?') && this.props.removeToy(id)

  	//玩具搜索
  	this.closeAddToy = () => this.setState({modalAddToy:false,pageId:'',toyId:''})
  	this.setTime = this._setTime.bind(this)
	}
	_setTime() {
		const { curDate, curTime, timePageId } = this.state
		if(!curTime.match(/[0-2][0-9]-[0-5][0-9]/)){
			return alert('时间格式不对')
		}
		const arr = curTime.split('-')
		const created = curDate.valueOf() + arr[0]*3600000 + arr[1]*60000
		Request.post(`/api/page/${timePageId}/created`)
		.send({created})
		.end((err,res) => {
			if(!err) {
				this.setState({timePageId:null})
			}
		})
	}
	render() {
		const { pages, toyResults } = this.props
		const { modalAddToy,pageId,toyId, timePageId,curDate,curTime } = this.state
		return (
			<div className="table-responsive play-page">
        <table className="table table-striped">
          <tbody>
          	{
          		pages.map((page) => {
          			let isPubClass = `btn btn-sm ${page.isPub ? '' : 'bg-orange'}`
          			let isRecClass = `btn btn-sm ${page.isRec ? 'bg-orange' : ''}`
          			let isShareClass = `btn btn-sm ${page.forShare ? 'bg-orange' : ''}`
          			return (
          				<tr key={page.id}>
          					<td>
                  		<img src={page.cover} className="page-cover" style={{width:150}} />
	                  </td>
	                  <td>
	                  	{page.title}<a target="_blank" href={`http://www.playalot.cn/page/${page.id}`}>[预览]</a>
	                  </td>
	                  <td><Link to={`/user/${page.user.id}`}><img style={{width:'45px'}} src={page.user.avatar} className="img-circle"/></Link></td>
                  	<td>{page.category}</td>
                  	<td style={{whiteSpace:'inherit'}}>
	                  	{
	                  		page.tags.map((tag,index) => {
	                  			return (<span className="label label-info label-margin" key={`page_tag_${index}`}>{tag}</span>)
	                  		})
	                  	}
	                  	{
												page.toys.map((toy, index) => {
	                  		 	return (
														<span key={`toy_${index}`} className="label label-success label-margin">
	                  			 		{ toy.name } <i className="fa fa-close" onClick={ () => this.removeToy(page.id)}></i>
	                  			 	</span>
	                  			 )
												})
	                  	}
                  	</td>
                  	<td>
	                  	<div className="page-flex-column">
	                    	<span style={{marginBottom:10}}>{page.counts.views} views</span>
	                    	<span onClick={() => this.setState({timePageId:page.id})}>
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
	                    		<Link to={`/page/edit?id=${page.id}` }><span style={{color:'#333'}} className="btn btn-sm"><i className="fa fa-edit"></i></span></Link>
	                    		<span style={{color:'#333'}} onClick={() => this.togglePub(page.id)} className={isPubClass}><i className="fa fa-eye-slash"></i></span>
	                    		<span style={{color:'#333'}} onClick={() => this.deleteArticle(page.id)} className="btn btn-sm"><i className="fa fa-trash"></i></span>
	                    	</div>
	                    	<div>
	                    		<span style={{color:'#333'}} onClick={() => this.addToy(page.id)} className="btn btn-sm"><i className="fa fa-plus"></i></span>
	                    		<span style={{color:'#333'}} onClick={() => this.toggleRec(page.id)} className={isRecClass}><i className="fa fa-thumbs-o-up"></i></span>
	                    		<span style={{color:'#333'}} onClick={() => this.toggleShare(page.id)} className={isShareClass}><i className="fa fa-share-square-o"></i></span>
	                    	</div>
	                  	</div>
	                  </td>
          				</tr>
          			)
          		})
          	}
          </tbody>
        </table>
				{
					timePageId ?
					<div className="play-modal" style={{zIndex:2}} onClick={() => this.setState({timePageId:null})}>
						<div className="play-dialog" onClick={e => e.stopPropagation()}>
							<p className="dialog-title">修改发布时间</p>
							<span onClick={() => this.setState({timePageId:null})} className="dialog-close">×</span>
							<div>
								<DatePicker
									selected={curDate}
									onChange={(date) => this.setState({curDate:date})}
									maxDate={Moment()}
									dateFormat="YYYY/MM/DD"
								/>
								<input style={{marginLeft:20}} type="text" value={curTime} onChange={(e) => this.setState({curTime:e.target.value})}/>
							</div>
							<div className="dialog-footer">
								<Button onClick={this.setTime}>修改</Button>
							</div>
						</div>
					</div>
					:null
				}
				{
					modalAddToy ?
					<div className="play-modal" style={{zIndex:2}} onClick={this.closeAddToy}>
						<div className="play-dialog" onClick={e => e.stopPropagation()}>
							<p className="dialog-title">搜索玩具</p>
							<span onClick={this.closeAddToy} className="dialog-close">×</span>
							<div>
								<InputGroup>
              <FormControl type="text" placeholder='输入玩具ID' value={toyId} onChange={(e) => this.setState({toyId:e.target.value})} />
              <InputGroup.Button>
                <Button onClick={() => {
                	this.props.addToy(pageId,toyId)
                	this.closeAddToy()
										}}>添加玩具</Button>
									</InputGroup.Button>
								</InputGroup>
								<br/>
								<PlayAutoSuggest
									fetch={(o) => this.props.fetchToyByQuery(o.value)}
									clear={this.props.clearSuggestion}
									getValue={suggestion => suggestion.name}
									selectValue={(event,{suggestion, suggestionValue, method }) => {
										this.props.addToy(pageId,suggestion.id)
										this.closeAddToy()
									}}
									desc="release"
									placeholder="请输入玩具关键字"
									results={toyResults}
								/>
							</div>
							<div className="dialog-footer">
								<button className="btn btn-primary" onClick={this.addLink}>插入</button>
							</div>
						</div>
					</div>
					: null
				}
      </div>
		)
	}
}

