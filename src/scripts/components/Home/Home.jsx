import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import ReactPaginate from 'react-paginate'
import { parsePage } from '../../widgets/parse'
import { dateFormat } from '../../widgets'
import PlayToyPanel from '../Common/PlayToyPanel'

import { ResponsiveContainer,BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

export default class Home extends Component {
    constructor(props) {
      super(props);
      this.state = {
        crosshairValues:[]
      };
      this.nearestXHandler = this._nearestXHandler.bind(this)
    }
    componentWillMount() {
      if(!this.props.loaded){
        this.props.fetchStats()
      }
      this.props.getActivitiesC()
      this.props.getActivitiesO()
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
        const { stats,data } = this.props
        return (
            <div>
              <div className="row">
                <div className="col-md-6">
                  <div className="row">
                    <div className="col-12 col-sm-6 col-lg-4">
                      <a className="dashboard-stat blue" href="#">
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

                    </div>
         
                    <div className="col-12 col-sm-6 col-lg-4">
                      <a className="dashboard-stat green" href="#">
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
                    </div>
                    <div className="col-12 col-sm-6 col-lg-4">
                      <a className="dashboard-stat yellow" href="#">
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
                    </div>
                    <div className="col-12 col-sm-6 col-lg-4">
                      <a className="dashboard-stat red" href="#">
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
                    </div>
                    <div className="col-12 col-sm-6 col-lg-4">
                      <a className="dashboard-stat purple" href="#">
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
                    </div>
                    <div className="col-12 col-sm-6 col-lg-4">
                      <a className="dashboard-stat blue-dark" href="#">
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
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="portlet light bordered">
                    <div className="portlet-body">
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data}>
                          <XAxis dataKey="name"/>
                          <YAxis/>
                          <CartesianGrid strokeDasharray="3 3"/>
                          <Tooltip/>
                          <Legend />
                          <Bar name="连续登录" dataKey="last" fill="#8884d8" />
                          <Bar name="累计登录" dataKey="aggregate" fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-6">
                  <div className="m-portlet m-portlet--mobile">
                    <div className="m-portlet__head p-3">
                      <div>
                        <i className="icon-bubbles mr-2"></i>
                        <span>评论</span>
                      </div>
                      <ReactPaginate
                        previousLabel={<span>&laquo;</span>}
                        nextLabel={<span>&raquo;</span>}
                        breakLabel={<a>...</a>}
                        breakClassName={"break-me"}
                        pageCount={this.props.totalPagesC}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={obj => this.props.getActivitiesC(obj.selected)}
                        containerClassName={"pagination mt-2"}
                        subContainerClassName={"pages pagination"}
                        forcePage={this.props.pageC}
                        activeClassName={"active"} />
                    </div>
                    <div className="m-portlet__body p-3">
                      {
                        this.props.activitiesC.map((activity,i) => {
                          return (
                            <div className="d-flex " key={`act_c_${activity.id}`} >
                              <Link to={`/user/${activity.user.id}`}>
                                <img className="avatar45" src={activity.user.avatar} alt="avatar"/>
                              </Link>
                              <div className="p-2" style={{flex:1}}>
                                <div>
                                    <span>{activity.user.nickname}</span>&nbsp;
                                    <span>{dateFormat(activity.created)}</span>
                                </div>
                                    <div>{activity.content || ''}</div>
                                    <div>
                                      {activity.topic ?
                                        <a target="_blank" style={{marginBottom:5,display:'inline-block'}} href={`http://www.playalot.cn/${activity.topic.type}/${activity.topic.id}`}>
                                          {activity.topic.text}
                                        </a>
                                        :null
                                      }
                                      <a target="_blank" href={`http://www.playalot.cn/${activity.target.type}/${activity.target.id}`} className="activity-image">
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
                <div className="col-lg-6">
                  <div className="m-portlet m-portlet--mobile">
                    <div className="m-portlet__head p-3">
                      <div>
                        <i className="icon-bubbles mr-2"></i>
                        <span>动态</span>
                      </div>
                      <ReactPaginate
                        previousLabel={<span>&laquo;</span>}
                        nextLabel={<span>&raquo;</span>}
                        breakLabel={<a>...</a>}
                        breakClassName={"break-me"}
                        pageCount={this.props.totalPagesO}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={obj => this.props.getActivitiesO(obj.selected)}
                        containerClassName={"pagination mt-2"}
                        subContainerClassName={"pages pagination"}
                        forcePage={this.props.pageO}
                        activeClassName={"active"} />
                    </div>
                    <div className="m-portlet__body p-3">
                      <div>
                        {
                          this.props.activitiesO.map((activity,i) => {
                            return (
                              <div className="d-flex " key={`act_o_${activity.id}`}>
                                <Link to={`/user/${activity.user.id}`}>
                                    <img className="avatar45" src={activity.user.avatar} alt="avatar"/>
                                </Link>
                                <div className="p-2" style={{flex:1}}>
                                  <div>
                                      <span>{activity.user.nickname}</span>&nbsp;
                                      <span>{dateFormat(activity.created)}</span>
                                  </div>
                                      <div>{activity.content || ''}</div>
                                      <div>
                                        {activity.target.type == "toy" ?
                                          <a target="_blank" href={`http://www.playalot.cn/${activity.target.type}/${activity.target.id}`}>
                                            <PlayToyPanel tid={activity.target.id}></PlayToyPanel>
                                          </a>
                                          :null
                                        }
                                        <a target="_blank" href={`http://www.playalot.cn/${activity.target.type}/${activity.target.id}`} className="activity-image">
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
            </div>
        )
    }
}
