import React,{ Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Moment from 'moment'
import PlaySwitch from '../Common/playSwitch'
import { 
	fetchUserPage,
	togglePub,
	toggleRec,
	deletePage,
	setCoverType,
} from '../../actions/userDetailAction'
class UserPage extends Component{
	constructor(props) {
	  	super(props)
	  	this.state = {}

	  	this.togglePub = id => this.props.togglePub(id)
        this.toggleRec = id => this.props.toggleRec(id)
        this.deletePage = id => confirm('删除这个文章?') && this.props.deletePage(id)
	}
	componentWillMount() {
        this.props.fetchUserPage(this.props.id)
    }
	render() {
		return(
			<div className="table-responsive">
	            <table className="table table-striped">
	              	<tbody>
	                {this.props.pages.map((page) => {
	                  	let isPubClass = page.isPub === true ? 'btn btn-sm' : 'btn btn-sm bg-orange'
	                  	let isRecClass = page.isRec === true ? 'btn bg-orange btn-sm' : 'btn btn-sm'
	                  	return (
	                    <tr key={page.id}>
	                      <td><img style={{width:'400px'}} src={page.cover} className="img-thumbnail"/></td>
	                      <td>{page.title}</td>
	                      <td>{page.category}</td>
	                      <td>
	                        {
	                          page.tags.map((tag,index) => {
	                            return (<span className="label label-info label-margin" key={`tag_${index}`}>{tag}</span>)
	                          })
	                        }
	                      </td>
	                      <td>{page.counts.views} views</td>
	                      <td>{Moment.unix(page.created / 1000).fromNow()}</td>
	                      <td>
	                      	<PlaySwitch 
	                      		on="L"
	                      		off="S"
	                      		active={page.coverType === 'l'} 
	                      		onChange={value => this.props.setCoverType(value,page.id)}
	                      	/>
	                      </td>
	                      <td><Link to={`/page/edit/${page.id}` }><span style={{color:'#333'}} className="btn btn-sm"><i className="fa fa-edit"></i></span></Link></td>
	                      <td><span style={{color:'#333'}} onClick={() => this.toggleRec(page.id)} className={isRecClass}><i className="fa fa-thumbs-o-up"></i></span></td>
	                      <td><span style={{color:'#333'}} onClick={() => this.togglePub(page.id)} className={isPubClass}><i className="fa fa-eye-slash"></i></span></td>
	                      <td><span style={{color:'#333'}} onClick={() => this.deletePage(page.id)} className="btn btn-sm"><i className="fa fa-trash"></i></span></td>
	                      <td><a target="_blank" href={`http://www.playalot.cn/page/${page.id}.html`}>预览</a></td>
	                    </tr>
	                  	)
	                })}
	              	</tbody>
	            </table>
          	</div>
		)
	}
}

const mapActionCreators = {
	fetchUserPage,
	togglePub,
	toggleRec,
	deletePage,
	setCoverType,
}

const mapStateToProps = (state) => {
	const { pages } = state.userDetail.toJS()
	return {
		pages,
	}
}

export default connect(mapStateToProps, mapActionCreators)(UserPage)