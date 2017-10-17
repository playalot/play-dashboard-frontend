import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Request from 'superagent'
import CDN from '../../widgets/cdn'

export default class PlayToyPanel extends Component {
    constructor(props) {
        super(props)
        this.state = {
            toy:null
        }
    }
    componentWillMount() {
        Request.get(`/api/toy/${this.props.tid}`)
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
                        <h5 className="pl-2" style={{flex:1}}>{toy.name}</h5>
                    </div>
                    {this.props.children}
                </div>
            )
        }else{
            return null
        }
    }
}

PlayToyPanel.propTypes = {
    tid:PropTypes.string.isRequired
}