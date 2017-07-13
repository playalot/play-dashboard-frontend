import React, { Component } from 'react'
import { Row,Col } from 'react-bootstrap'
import {makeWidthFlexible,XYPlot, XAxis, YAxis,VerticalGridLines, HorizontalGridLines, VerticalBarSeries,Crosshair} from 'react-vis'
import { Link } from 'react-router-dom'
import Moment from 'moment'
import ReactPaginate from 'react-paginate'
import { parsePage } from '../../widgets/parse'

const FlexibleXYPlot = makeWidthFlexible(XYPlot)
export default class Home extends Component {
    constructor(props) {
      super(props);
      this.state = {
        crosshairValues:[]
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
        this.props.history.push(`/home?page=${page}`)
      }else{
        this.props.getActivities(0)
      }
    }
    _goPage(page) {
      this.props.history.push(`/home?page=${page}`)
      this.props.getActivities(page)
    }
    _nearestXHandler(value, {index}){
      const { last, aggregate } = this.props.stats
      this.setState({
        crosshairValues: [last[index],aggregate[index]]
      })
    }
    _formatCrosshairTitle(values){
      return {
        title: '日期',
        value: values[0].x
      }
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
            <div>
              <Row>
                <Col xs={6} sm={4} lg={2}>
                  <a className="dashboard-stat dashboard-stat-v2 blue" href="#">
                    <div className="visual">
                      <i className="fa fa-users"></i>
                    </div>
                    <div className="details">
                        <div className="number">
                          <span>{stats.users}</span>
                        </div>
                        <div className="desc">用户数</div>
                    </div>
                  </a>
                </Col>
                <Col xs={6} sm={4} lg={2}>
                  <a className="dashboard-stat dashboard-stat-v2 green" href="#">
                    <div className="visual">
                      <i className="fa fa-rocket"></i>
                    </div>
                    <div className="details">
                        <div className="number">
                          <span>{stats.toys}</span>
                        </div>
                        <div className="desc">玩具数</div>
                    </div>
                  </a>
                </Col>
                <Col xs={6} sm={4} lg={2}>
                  <a className="dashboard-stat dashboard-stat-v2 yellow" href="#">
                    <div className="visual">
                      <i className="fa fa-tags"></i>
                    </div>
                    <div className="details">
                        <div className="number">
                          <span>{stats.tags}</span>
                        </div>
                        <div className="desc">标签数</div>
                    </div>
                  </a>
                </Col>
                <Col xs={6} sm={4} lg={2}>
                  <a className="dashboard-stat dashboard-stat-v2 red" href="#">
                    <div className="visual">
                      <i className="fa fa-comments"></i>
                    </div>
                    <div className="details">
                        <div className="number">
                          <span>{stats.posts}</span>
                        </div>
                        <div className="desc">照片总数</div>
                    </div>
                  </a>
                </Col>
                <Col xs={6} sm={4} lg={2}>
                  <a className="dashboard-stat dashboard-stat-v2 purple" href="#">
                    <div className="visual">
                      <i className="fa fa-photo"></i>
                    </div>
                    <div className="details">
                        <div className="number">
                          <span>{stats.postYesterday}</span>
                        </div>
                        <div className="desc">昨日发图</div>
                    </div>
                  </a>
                </Col>
                <Col xs={6} sm={4} lg={2}>
                  <a className="dashboard-stat dashboard-stat-v2 blue-dark" href="#">
                    <div className="visual">
                      <i className="fa fa-photo"></i>
                    </div>
                    <div className="details">
                        <div className="number">
                          <span>{stats.postToday}</span>
                        </div>
                        <div className="desc">今日发图</div>
                    </div>
                  </a>
                </Col>

              </Row>
              <div style={{padding:20}}>
                <FlexibleXYPlot
                  onMouseLeave={() => this.setState({crosshairValues:[]})}
                  height={350}>
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
              <div className="row">
                <div className="col-lg-6 col-xs-12 col-sm-12">
                  <div className="portlet light bordered">
                    <div className="portlet-title">
                      <div className="caption">
                        <i className="icon-bubbles font-dark hide"></i>
                        <span className="caption-subject font-dark bold uppercase">评论</span>
                      </div>
                      <div className="actions">
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
                          forcePage={parsePage(this.props.location.search)}
                          activeClassName={"active"} />
                      </div>
                    </div>
                    <div className="portlet-body">
                      <div className="mt-comments">
                        {
                          this.props.activities.map((activity,i) => {
                            return (
                              <div className="mt-comment">

                                <div className="mt-comment-img">
                                    <img style={{width:45}} src={activity.user.avatar} alt="avatar"/>
                                </div>

                                <div className="mt-comment-body">
                                  <div className="mt-comment-info">
                                      <span className="mt-comment-author">{activity.user.nickname}</span>
                                      <span className="mt-comment-date">{Moment.unix(activity.created /1000).format("D MMM, H:mm A")}</span>
                                  </div>
                                      <div className="mt-comment-text">{activity.content || 'sadfasdfasdfs'}</div>
                                      <div className="mt-comment-details">
                                        {activity.topic ?
                                          <a target="_blank" style={{marginBottom:5,display:'inline-block'}} href={`http://www.playalot.cn/${activity.topic.type}/${activity.topic.id}`}>
                                            {activity.topic.text}
                                          </a>
                                          :null
                                        }
                                        <a target="_blank" href={`http://www.playalot.cn/${activity.target.type}/${activity.target.id}`} className="home-activity-image">
                                          {
                                            activity.images.map((img,i) => {
                                              return (
                                                <img key={`activity_${activity.id}_${i}`} src={img} alt=""/>
                                              )
                                            })
                                          }
                                        </a>
                                      </div>
                                  </div>
                              </div>
                            )
                          })
                        }
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-xs-12 col-sm-12">
                  <div className="portlet light bordered">
                    <div className="portlet-title">
                      <div className="caption">
                        <i className="icon-bubbles font-dark hide"></i>
                        <span className="caption-subject font-dark bold uppercase">动态</span>
                      </div>
                      <div className="actions">
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
                          forcePage={parsePage(this.props.location.search)}
                          activeClassName={"active"} />
                      </div>
                    </div>
                    <div className="portlet-body">
                      <div className="mt-comments">
                        {
                          this.props.activities.map((activity,i) => {
                            return (
                              <div className="mt-comment">

                                <div className="mt-comment-img">
                                    <img style={{width:45}} src={activity.user.avatar} alt="avatar"/>
                                </div>

                                <div className="mt-comment-body">
                                  <div className="mt-comment-info">
                                      <span className="mt-comment-author">{activity.user.nickname}</span>
                                      <span className="mt-comment-date">{Moment.unix(activity.created /1000).format("D MMM, H:mm A")}</span>
                                  </div>
                                      <div className="mt-comment-text">{activity.content || 'sadfasdfasdfs'}</div>
                                      <div className="mt-comment-details">
                                        {activity.topic ?
                                          <a target="_blank" style={{marginBottom:5,display:'inline-block'}} href={`http://www.playalot.cn/${activity.topic.type}/${activity.topic.id}`}>
                                            {activity.topic.text}
                                          </a>
                                          :null
                                        }
                                        <a target="_blank" href={`http://www.playalot.cn/${activity.target.type}/${activity.target.id}`} className="home-activity-image">
                                          {
                                            activity.images.map((img,i) => {
                                              return (
                                                <img key={`activity_${activity.id}_${i}`} src={img} alt=""/>
                                              )
                                            })
                                          }
                                        </a>
                                      </div>
                                  </div>
                              </div>
                            )
                          })
                        }
                      </div>
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
                  forcePage={parsePage(this.props.location.search)}
                  activeClassName={"active"} />
              </div>
              <div>
                {
                  this.props.activities.map((activity,i) => {
                    return (
                      <div className="media home-activity" key={`act_${activity.id}`}>
                        <div className="media-left">
                          <Link to={`/user/${activity.user.id}`} className="thumbnail" style={{borderRadius:'50%',width:60}}>
                            <img style={{borderRadius:'50%'}} src={activity.user.avatar} alt="avatar"/>
                          </Link>
                        </div>
                        <div className="media-body">
                          <h5 className="media-heading">{activity.user.nickname}&nbsp;&nbsp;
                            <strong>
                              {
                                (() => {
                                  switch (activity.type) {
                                    case "ut":   return "更新了玩具";
                                    case "st": return "评分了玩具";
                                    case "pt":  return "发布了玩具";
                                    case "cmt":  return "评论了图片";
                                    case "pp":  return "发布了图片";
                                    default:      return "";
                                  }
                                })()
                              }
                            </strong>
                          </h5>
                          <h5><small>{Moment.unix(activity.created /1000).fromNow()}</small></h5>
                          <p>{activity.content || ''}</p>
                          {
                            activity.topic ?
                            <a target="_blank" style={{marginBottom:5,display:'inline-block'}} href={`http://www.playalot.cn/${activity.topic.type}/${activity.topic.id}`}>
                              {activity.topic.text}
                            </a>
                            :null
                          }
                          <a target="_blank" href={`http://www.playalot.cn/${activity.target.type}/${activity.target.id}`} className="home-activity-image">
                            {
                              activity.images.map((img,i) => {
                                return (
                                  <img key={`activity_${activity.id}_${i}`} src={img} alt=""/>
                                )
                              })
                            }
                          </a>
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
