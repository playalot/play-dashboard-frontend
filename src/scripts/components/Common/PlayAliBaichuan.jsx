import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Modal } from 'react-bootstrap'

import { setTouidNull } from '../../actions/adminAction'

class PlayAliBaichuan extends Component {
	constructor(props) {
	  	super(props);
	
	  	this.state = {};
	}
	componentDidMount() {
		let touid = this.props.baichuan.touid
		WKIT.init({
	        container: document.getElementById('alibaichuan'),
	        width: 700,
	        height: 500,
	        uid: '5691631a160000370003ad5c',
	        appkey: 23289048,
	        credential: 'NTY5MTYzMWExNjAw',
	        touid: '576d0cbd1c00003700c1c32b',
	    	avatar:'http://img.playalot.cn/user/avatar/c3c6f_1482486056_w_1000_h_1000_5691631a160000370003ad5c.jpg?imageView2/2/w/120/q/90',
	    	// logo: 'http://img.alicdn.com/tps/i3/TB12LD9IFXXXXb3XpXXSyFWJXXX-82-82.png',
	    	// pluginUrl: 'http://www.taobao.com/market/seller/openim/plugindemo.php',
	    	// sendMsgToCustomService: true,
			// titleBar:true,
	        onMsgSent:function() {
	            console.log('sent')
	        },
	        onMsgReceived:function(){
	            console.log('received')
	        }
	    })
	}
	componentWillReceiveProps(nextProps) {
		let { touid,toAvatar } = nextProps.baichuan
		if(touid !== 'none'){
			WKIT.switchTouid({
	            touid,
	            toAvatar,
	        });
		}
	}
	componentWillUnmount() {
		WKIT.destroy()
		$('#alibaichuan').empty()
	}
	render() {
		let show = this.props.baichuan.touid === 'none' ? false : true

		return(
			<div onClick={this.props.setTouidNull}
				style={{
					position:'fixed',
					top:0,right:0,left:0,bottom:0,
					background:'rgba(0,0,0,.3)',
					display:show ? 'flex':'none',
					justifyContent:'center',
					alignItems:'center',
					zIndex:9999,
				}}
			>
				<div id="alibaichuan" onClick={e => e.stopPropagation()}></div>
			</div>
		)
	}
}


const mapActionCreators = {
    setTouidNull
}
const mapStateToProps = (state) => {
    const { baichuan }  = state.admin.toJS()
    return {
        baichuan
    }
}

export default connect(mapStateToProps, mapActionCreators)(PlayAliBaichuan)