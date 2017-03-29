import React, {
    Component
} from 'react'
import {makeWidthFlexible,XYPlot, XAxis, YAxis,VerticalGridLines, HorizontalGridLines, VerticalBarSeries,Crosshair} from 'react-vis';
import { Link } from 'react-router'
import Moment from 'moment'
import ReactPaginate from 'react-paginate'

const FlexibleXYPlot = makeWidthFlexible(XYPlot)
export default class Home extends Component {
    constructor(props) {
      super(props);
      this.state = {
        crosshairValues:[],
      };
      this.nearestXHandler = this._nearestXHandler.bind(this)
      this.goPage = this._goPage.bind(this)
    }
    componentWillMount() {
      if(!this.props.loaded){
        this.props.fetchStats()
      }
      const { page } = this.props
      if(typeof page === 'number') {
        this.context.router.push(`/home?page=${page}`)
      }else{
        this.props.getActivities(this.props.location.query.page)
      }
    }
    _goPage(page) {
      this.context.router.push(`/home?page=${page}`)
      this.props.getActivities(page)
    }
    _nearestXHandler(value, {index}){
      const { last, aggregate } = this.props.stats
      this.setState({
        crosshairValues: [last[index],aggregate[index]]
      });
    }

    _formatCrosshairTitle(values){
      return {
        title: '日期',
        value: values[0].x 
      };
    }
    _formatCrosshairItems (values) {
      return values.map((v, i) => {
        return {
          title: i === 0 ? '连续登录' : '累计登录',
          value: v.y
        }
      })
    }
    render() {
        const { stats } = this.props
        return (
            <div className="content">
              <div className="box">
                <div className="box-header"></div>
                  <div className="box-body text-center">
                    <p>We will change the world.</p>
                    <p><em>Innovation distinguishes between a leader and a follower.</em></p>
                    <small>
                      — Steve Jobs
                    </small>
                  </div>
              </div>
              <div className="row" >
                <div className="col-sm-2" >
                  <div className="box">
                    <div className="box-body">
                        <div className="col-sm-12 col-xs-3">
                          <div className="description-block">
                            <h5 className="description-header">{stats.posts}</h5>
                            <span className="description-text">照片数</span>
                          </div>
                        </div>
                        <div className="col-sm-12 col-xs-3">
                          <div className="description-block">
                            <h5 className="description-header">{stats.users}</h5>
                            <span className="description-text">用户数</span>
                          </div>
                        </div>
                        <div className="col-sm-12 col-xs-3">
                          <div className="description-block">
                            <h5 className="description-header">{stats.toys}</h5>
                            <span className="description-text">玩具数</span>
                          </div>
                        </div>
                        <div className="col-sm-12 col-xs-3">
                          <div className="description-block">
                            <h5 className="description-header">{stats.tags}</h5>
                            <span className="description-text">标签数</span>
                          </div>
                        </div>
                    </div>
                  </div>
                </div>
                <div className="col-sm-10 col-xs-12">
                  <div className="box">
                    <div className="box-body">
                      <FlexibleXYPlot
                        onMouseLeave={() => this.setState({crosshairValues:[]})}
                        height={300}>
                        <VerticalGridLines />
                        <HorizontalGridLines />
                        <VerticalBarSeries
                          onNearestX={this.nearestXHandler}
                          data={stats.last || []}
                        />
                        <VerticalBarSeries
                          data={stats.aggregate || [] }
                        />
                        <Crosshair
                          itemsFormat={this._formatCrosshairItems}
                          titleFormat={this._formatCrosshairTitle}
                          values={this.state.crosshairValues}/>
                        <XAxis />
                        <YAxis />
                      </FlexibleXYPlot>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{textAlign:'center'}}>
                <ReactPaginate 
                  previousLabel={<span>&laquo;</span>}
                  nextLabel={<span>&raquo;</span>}
                  breakLabel={<span>...</span>}
                  breakClassName={"break-me"}
                  pageCount={this.props.totalPages}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={obj => this.goPage(obj.selected)}
                  containerClassName={"pagination"}
                  subContainerClassName={"pages pagination"}
                  forcePage={this.props.location.query.page ? parseInt(this.props.location.query.page) : 0}
                  activeClassName={"active"} />
              </div>
              <div>
                {
                  this.props.activities.map((activity,i) => {
                    return (
                      <div className="media">
                        <div className="media-left">
                          <Link to={`/user/${activity.user.id}`} className="thumbnail" style={{borderRadius:'50%',width:60}}>
                            <img style={{borderRadius:'50%'}} src={activity.user.avatar} alt="avatar"/>
                          </Link>
                        </div>
                        <div className="media-body">
                          <h4 className="media-heading">{activity.user.nickname}</h4>
                          {
                            activity.type === 'ut' ?
                            <h5>
                              更新了玩具
                              <a href={`http://www.playalot.cn/toy/${activity.target.id}`}>{`${activity.title}`}</a>
                            </h5>
                            :null
                          }
                          {
                            activity.type === 'cmt' ?
                            <h5>
                              评论了图片
                            </h5>
                            :null
                          }
                          {
                            activity.type === 'pp' ?
                            <h5>
                              发布了图片
                            </h5>
                            :null
                          }
                          <p>{activity.content}</p>
                        </div>
                        <div className="media-right" style={{minWidth:100}}>
                          {Moment.unix(activity.created /1000).fromNow()}
                        </div>
                      </div>

                    )
                    return(
                      <div key={`act_${activity.id}`} className="row">
                        <div className="col-xs-2" >
                          <a className="thumbnail" style={{borderRadius:'50%',maxWidth:80}}>
                            <img style={{borderRadius:'50%'}} src={activity.user.avatar} alt="avatar"/>
                          </a>
                        </div>
                        <div className="col-xs-8">
                          <a>{activity.user.nickname}</a>
                          <p>{activity.content}</p>
                        </div>
                        <div className="col-xs-2">
                          {Moment.unix(activity.created /1000).fromNow()}
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            </div>
        )
    }
}

Home.contextTypes = {
    router : React.PropTypes.object
}
