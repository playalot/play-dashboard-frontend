import React,{Component} from 'react'
import {Link} from 'react-router'
import {Row, Button,Form,FormGroup,InputGroup,FormControl, Modal} from 'react-bootstrap'
import Moment from 'moment'
import Request from 'superagent'
import Switch from 'rc-switch'
import Autosuggest from 'react-autosuggest'

export default class PageList extends Component{
	constructor(props) {
	  	super(props)
	  	this.state = {
	  		query:'',
	  		showModal:false,
	  		toyQuery:'',
	  		pid:'',
	  	}
	  	this.fetchMoreArticle = () => this.props.fetchArticle(this.state.query)
	  	this.togglePub = (id) => this.props.togglePub(id)
	  	this.toggleRec = (id) => this.props.toggleRec(id)
	  	this.toggleShare = (id) => this.props.toggleShare(id)
	  	this.deleteArticle = this._deleteArticle.bind(this)
	  	this.addToy = this._addToy.bind(this)
	  	this.stop = (e) => {
	  		if(e.keyCode === 13){
	  			e.preventDefault()
	  		}
	  	}

	  	//玩具搜索
	  	this.close = () => this.setState({showModal:false,toyQuery:'',pid:''})
	  	this.getSuggestionValue = suggestion => suggestion.id
	  	this.onChangeToyQuery = (event,{newValue}) => this.setState({toyQuery: newValue})
	  	this.onSuggestionsFetchRequested = ({value}) => {
	  		this.props.fetchToy(value)
	  	}
	  	this.onSuggestionsClearRequested = () => this.props.clearSuggestion()
	  	this.selectValue = (event,{ suggestionValue, method }) => {
	  		this.props.addToy(this.state.pid,suggestionValue)
	  		this.close()
	  	}
	}
	componentWillMount() {
		if(!this.props.loaded){
			this.props.fetchArticle(this.state.query)
		}
	}
	_addToy(pid) {
		this.setState({showModal:true,pid})
	}
	_deleteArticle(id) {
		if (confirm('删除这个文章?')) {
			this.props.deleteArticle(id)
		}
	}
	renderSuggestion(suggestion) {
		return (
			<div className="search-item">
			  <img className="img-rounded" src={suggestion.cover}/>
			  <span className="item-name">{suggestion.name}</span>
			  <span className="item-desc">{suggestion.id}</span>
			</div>
		)
	}
	render() {
		const inputProps = {
			placeholder: '输入玩具关键字',
			value: this.state.toyQuery,
			onChange: this.onChangeToyQuery,
	    }
		return(
			<div className="content">
	          <div className="page-header">
	            <Form inline>
            	  <Link to="/page/edit"><Button bsStyle='success'>发布文章</Button></Link>
	              <FormGroup style={{marginLeft:10}}>
	                <InputGroup>
	                  <FormControl type="text" placeholder='输入关键字' value={this.state.query} onKeyDown={this.stop} onChange={(e) => this.setState({query:e.target.value})} />
	                  <InputGroup.Button>
	                    <Button onClick={() => this.props.fetchArticle(this.state.query)}>搜索</Button>
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
	                      <td><img style={{width:'400px'}} src={page.cover} className="img-thumbnail"/></td>
	                      <td>{page.title}</td>
	                      <td><Link to={'/user/'+page.user.id}><img style={{width:'45px'}} src={page.user.avatar} className="img-circle"/></Link></td>
	                      <td>{page.category}</td>
	                      <td>
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
	                      			 	</span>)
															})
	                      	}
	                      </td>
	                      <td>{page.counts.views} views</td>
	                      <td>{Moment.unix(page.created / 1000).fromNow()}</td>
	                      <td>
	                      	<Switch onChange={value => this.props.setCoverType(value,page.id)}
						        checkedChildren={'L'}
						        unCheckedChildren={'S'}
						        checked={page.coverType === 'l'}
						      />
	                      </td>
	                      <td><span style={{color:'#333'}} onClick={() => this.addToy(page.id)} className="btn btn-sm"><i className="fa fa-plus"></i></span></td>
	                      <td><Link to={`/page/edit/${page.id}` }><span style={{color:'#333'}} className="btn btn-sm"><i className="fa fa-edit"></i></span></Link></td>
	                      <td><span style={{color:'#333'}} onClick={() => this.toggleRec(page.id)} className={recommendClass}><i className="fa fa-thumbs-o-up"></i></span></td>
	                      <td><span style={{color:'#333'}} onClick={() => this.toggleShare(page.id)} className={shareClass}><i className="fa fa-share-square-o"></i></span></td>
	                      <td><span style={{color:'#333'}} onClick={() => this.togglePub(page.id)} className={isPubClass}><i className="fa fa-eye-slash"></i></span></td>
	                      <td><span style={{color:'#333'}} onClick={() => this.deleteArticle(page.id)} className="btn btn-sm"><i className="fa fa-trash"></i></span></td>
	                      <td><a target="_blank" href={`http://www.playalot.cn/page/${page.id}.html`}>预览</a></td>
	                    </tr>
	                  )
	                })}
	                <tr></tr>
	              </tbody>
	            </table>
	          </div>
	          <Row>
	            <div className="load-more-btn" onClick={this.fetchMoreArticle}>Load More</div>
	          </Row>
	          	<Modal show={this.state.showModal} onHide={this.close}>
		          	<Modal.Header closeButton>
		            	<Modal.Title>搜索玩具</Modal.Title>
		          	</Modal.Header>
		          	<Modal.Body>
		            	<Autosuggest
							suggestions={this.props.searchResults}
					        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
					        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
							getSuggestionValue={this.getSuggestionValue}
							renderSuggestion={this.renderSuggestion}
							onSuggestionSelected={this.selectValue}
							inputProps={inputProps}
						/>
	          		</Modal.Body>
	        	</Modal>
	        </div>
		)
	}
}
