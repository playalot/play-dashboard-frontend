import React, {
    Component
} from 'react'

export default class Home extends Component {
    componentWillMount() {
        if(!this.props.loaded){
            this.props.fetchStats()
        }
    }
    render() {
        const { stats } = this.props
        let max = 0
        stats.last && stats.last.map((day,i) => {
            max = day.n >= max ? day.n : max
        })
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
                <div className="box">
                  <div className="box-header"></div>
                  <div className="box-body text-center">
                    <div className="row">
                      <div className="col-sm-3 col-xs-6">
                        <div className="description-block border-right">
                          <h5 className="description-header">{stats.posts}</h5>
                          <span className="description-text">照片数</span>
                        </div>
                      </div>
                      <div className="col-sm-3 col-xs-6">
                        <div className="description-block border-right">
                          <h5 className="description-header">{stats.users}</h5>
                          <span className="description-text">用户数</span>
                        </div>
                      </div>
                      <div className="col-sm-3 col-xs-6">
                        <div className="description-block border-right">
                          <h5 className="description-header">{stats.toys}</h5>
                          <span className="description-text">玩具数</span>
                        </div>
                      </div>
                      <div className="col-sm-3 col-xs-6">
                        <div className="description-block">
                          <h5 className="description-header">{stats.tags}</h5>
                          <span className="description-text">标签数</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                    <div className="play-home">
                        {
                            stats.last && stats.last.map((day,i) => {
                                return(
                                    <div 
                                        key={`home-column_${i}`}
                                        title={`${day.n}`}
                                        className="home-column">
                                        <span>{day.n}</span>
                                        <div style={{height:`${day.n/max*150}px`}} className="zhu"></div>
                                        <div className="txt">{day.d}</div>

                                    </div>
                                )
                            })
                        }
                    </div>
                    <div>
                        
                    </div>

                </div>
            </div>
        )
    }
}