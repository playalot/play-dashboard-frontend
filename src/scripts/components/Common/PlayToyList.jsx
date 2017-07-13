import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Request from 'superagent'
import CDN from '../../widgets/cdn'
export default class PlayToyList extends Component {
    render() {
        const { ids } = this.props
        return (
            <div className="d-flex flex-column">
                {
                    ids.map((id,index) => {
                        if(id){
                            return(
                                <PlayToyPanel key={`play-toy-list-${id}_${index}`} remove={() => this.props.remove(index)} id={id}></PlayToyPanel>
                            )
                        }
                    })
                }
            </div>
        )
    }
}

class PlayToyPanel extends Component {
    constructor(props) {
        super(props)
        this.state = {
            toy:null
        }
    }
    componentWillMount() {
        Request.get(`/api/toy/${this.props.id}`)
        .end((err,res) => {
            this.setState({
                toy:res.body
            })
        })
    }
    render() {
        const { toy } = this.state
        if(toy){
            return (
                <div key={`catalog_${toy.id}`} className="d-flex p-2 justify-content-between align-items-center">
                    <div className="d-flex">
                        <img style={{width:50,height:50}} className="play-img-cover" src={CDN.show(toy.cover)} alt=""/>
                        <h5 className="pl-2">{toy.name}</h5>
                    </div>
                    <button type="button" onClick={this.props.remove} className="btn btn-sm red btn-outline">删除</button>
                </div>
            )
        }else{
            return null
        }
    }
}


PlayToyList.propTypes = {
    ids:PropTypes.array.isRequired
}
PlayToyPanel.propTypes = {
    id:PropTypes.string.isRequired
}