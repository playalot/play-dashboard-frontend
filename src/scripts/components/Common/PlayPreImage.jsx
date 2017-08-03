import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class PlayPreImage extends Component{
	constructor(props) {
	  	super(props)
	  	this.state = {
	  		loaded:false
	  	}
	}
	componentWillMount() {
		const {src} = this.props
		let w,h
		try{
			w = /_w_\d{1,}/.exec(src)[0].replace('_w_','')
			h = /_h_\d{1,}/.exec(src)[0].replace('_h_','')
		}catch(e){
			console.error(e)
			w = 1
			h = 1
		}
		this.setState({
			scale:`${h/w*100}%`
		})
		const img = new Image()
		img.src = src
		img.onload = () => {
			this.setState({
				loaded:true
			})
		}
	}
	render() {
        const {src,...other} = this.props
		return (
			<div style={{width:'100%',height:0,paddingBottom:`${this.state.scale}`,background:'rgb(238,237,235)',position:'relative'}}>
				{
					this.state.loaded ?
					<img src={src} {...other} alt="photo" style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',objectFit:'contain'}} />
					:null
				}
			</div>
		)
	}
}

PlayPreImage.propTypes = {
    src:PropTypes.string.isRequired,
}