import React, {
    Component
} from 'react'
import {makeWidthFlexible,XYPlot, XAxis, YAxis,VerticalGridLines, HorizontalGridLines, VerticalBarSeries,Crosshair} from 'react-vis';
const FlexibleXYPlot = makeWidthFlexible(XYPlot);
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
    }
    _nearestXHandler(value, {index}){
      this.setState({
        crosshairValues: [value]
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
          title: '人数',
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
                            data={stats.last && stats.last.map(item => ({
                                x:item.d,
                                y:item.n,
                              })
                            )}
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
            </div>
        )
    }
}

