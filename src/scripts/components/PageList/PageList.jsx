import React,{Component} from 'react'
import {Link} from 'react-router'
import {Row, Button,Form,FormGroup,InputGroup,FormControl} from 'react-bootstrap'
import Moment from 'moment'
import Request from 'superagent'
import Switch from 'rc-switch'

export default class PageList extends Component{
	constructor(props) {
	  	super(props)
	  	this.state = {
	  		query:''
	  	}
	  	this.fetchMoreArticle = () => this.props.fetchArticle(this.state.query)
	  	this.togglePub = (id) => this.props.togglePub(id)
	  	this.toggleRec = (id) => this.props.toggleRec(id)
	  	this.deleteArticle = this._deleteArticle.bind(this)
	  	this.stop = (e) => {
	  		if(e.keyCode === 13){
	  			e.preventDefault()
	  		}
	  	}
	}
	componentWillMount() {
		if(!this.props.loaded){
			this.props.fetchArticle(this.state.query)
		}
	}
	_deleteArticle(id) {
		if (confirm('删除这个文章?')) {
			this.props.deleteArticle(id)
		}
	}
	render() {
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
	                {this.props.pages.map((pages) => {
	                	let isPubClass = pages.isPub === true ? 'btn bg-orange btn-sm' : 'btn btn-sm'
	                	let recommendClass = pages.isRec === true ? 'btn bg-orange btn-sm' : 'btn btn-sm'
	                  return (
	                    <tr key={pages.id}>
	                      <td><img style={{width:'400px'}} src={pages.cover} className="img-thumbnail"/></td>
	                      <td>{pages.title}</td>
	                      <td><Link to={'/user/'+pages.user.id}><img style={{width:'45px'}} src={pages.user.avatar} className="img-circle"/></Link></td>
	                      <td>{pages.category}</td>
	                      <td>
	                      	{
	                      		pages.tags.map((tag,index) => {
	                      			return (<span className="label label-info label-margin" key={`tag_${index}`}>{tag}</span>)
	                      		})
	                      	}
	                      </td>
	                      <td>{pages.counts.views} views</td>
	                      <td>{Moment.unix(pages.created / 1000).fromNow()}</td>
	                      <td>
	                      	<Switch onChange={value => this.props.setCoverType(value,pages.id)}
						        checkedChildren={'L'}
						        unCheckedChildren={'S'}
						        checked={pages.coverType === 'l'}
						      />
	                      </td>
	                      <td><Link to={`/page/edit/${pages.id}` }><span style={{color:'#333'}} className="btn btn-sm"><i className="fa fa-edit"></i></span></Link></td>
	                      <td><span style={{color:'#333'}} onClick={() => this.toggleRec(pages.id)} className={recommendClass}><i className="fa fa-thumbs-o-up"></i></span></td>
	                      <td><span style={{color:'#333'}} onClick={() => this.togglePub(pages.id)} className={isPubClass}><i className="fa fa-eye"></i></span></td>
	                      <td><span style={{color:'#333'}} onClick={() => this.deleteArticle(pages.id)} className="btn btn-sm"><i className="fa fa-trash"></i></span></td>
	                      <td><a target="_blank" href={`http://www.playalot.cn/page/${pages.id}.html`}>预览</a></td>
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
	        </div>
		)
	}
}
