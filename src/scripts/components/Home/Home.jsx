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
                        <div className="col-sm-12 col-xs-4">
                          <div className="description-block">
                            <h5 className="description-header">{stats.users}</h5>
                            <span className="description-text">用户数</span>
                          </div>
                        </div>
                        <div className="col-sm-12 col-xs-4">
                          <div className="description-block">
                            <h5 className="description-header">{stats.toys}</h5>
                            <span className="description-text">玩具数</span>
                          </div>
                        </div>
                        <div className="col-sm-12 col-xs-4">
                          <div className="description-block">
                            <h5 className="description-header">{stats.tags}</h5>
                            <span className="description-text">标签数</span>
                          </div>
                        </div>
                        <div className="col-sm-12 col-xs-4">
                          <div className="description-block">
                            <h5 className="description-header">{stats.posts}</h5>
                            <span className="description-text">照片总数</span>
                          </div>
                        </div>
                        <div className="col-sm-12 col-xs-4">
                          <div className="description-block">
                            <h5 className="description-header">{stats.postYesterday}</h5>
                            <span className="description-text">昨日发图</span>
                          </div>
                        </div>
                        <div className="col-sm-12 col-xs-4">
                          <div className="description-block">
                            <h5 className="description-header">{stats.postToday}</h5>
                            <span className="description-text">今日发图</span>
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
              <div className="box box-widget">
                {
                  this.props.activities.map((activity,i) => {
                    return (
                      <div className="media activity_content" key={`act_${activity.id}`}>
                        <div className="media-left">
                          <Link to={`/user/${activity.user.id}`} className="thumbnail" style={{borderRadius:'50%',width:60}}>
                            <img style={{borderRadius:'50%'}} src={activity.user.avatar} alt="avatar"/>
                          </Link>
                        </div>
                        <ActivityContent activity={activity} />
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

class ActivityContent extends Component {

  render() {
    const { activity } = this.props
    const type = activity.type
    if(type === 'ut') {
      return (
        <div className="media-body">
          <h5 className="media-heading">{activity.user.nickname}&nbsp;&nbsp;<strong>更新了玩具</strong></h5>
          <h5><small>{Moment.unix(activity.created /1000).fromNow()}</small></h5>
          <h5>
            <a href={`http://www.playalot.cn/toy/${activity.target.id}`}>{`${activity.title}`}</a>
          </h5>
        </div>
      )
    } else if (type === 'st') {
      return (
        <div className="media-body">
          <h5 className="media-heading">{activity.user.nickname}&nbsp;&nbsp;<strong>评分了玩具</strong></h5>
          <h5><small>{Moment.unix(activity.created /1000).fromNow()}</small></h5>
          <h5>
            <a href={`http://www.playalot.cn/toy/${activity.target.id}`}>{`${activity.title}`}</a>
          </h5>
        </div>
      )
    } else if (type === 'pt') {
      return (
        <div className="media-body">
          <h5 className="media-heading">{activity.user.nickname}&nbsp;&nbsp;<strong>发布了玩具</strong></h5>
          <h5><small>{Moment.unix(activity.created /1000).fromNow()}</small></h5>
          <p>{activity.content}</p>
          <div className="activity_content_image">
            {
              activity.images.map((img,i) => {
                return (
                  <img key={`activity_${activity.id}_${i}`} src={img} alt=""/>
                )
              })
            }
          </div>
        </div>
      )
    } else if (type === 'cmt') {
      return (
        <div className="media-body">
          <h5 className="media-heading">{activity.user.nickname}&nbsp;&nbsp;<strong>评论了图片</strong></h5>
          <h5><small>{Moment.unix(activity.created /1000).fromNow()}</small></h5>
          <p>{activity.content}</p>
          <div className="activity_content_image">
            {
              activity.images.map((img,i) => {
                return (
                  <img key={`activity_${activity.id}_${i}`} src={img} alt=""/>
                )
              })
            }
          </div>
        </div>
      )
    }else if (type === 'pp') {
      return (
        <div className="media-body">
          <h5 className="media-heading">{activity.user.nickname}&nbsp;&nbsp;<strong>发布了图片</strong></h5>
          <h5><small>{Moment.unix(activity.created /1000).fromNow()}</small></h5>
          <p>{activity.content}</p>
          <div className="activity_content_image">
            {
              activity.images.map((img,i) => {
                return (
                  <img key={`activity_${activity.id}_${i}`} src={img} alt=""/>
                )
              })
            }
          </div>
        </div>
      )
    }else{
      return (<div className="media-body"></div>)
    }
  }
}
