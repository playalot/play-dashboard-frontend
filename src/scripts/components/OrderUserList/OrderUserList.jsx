import React,{ Component } from 'react'
import OrderPanel from '../OrderPanel'
export default class extends Component {
	componentWillMount() {
		const id = this.props.match.params.id
		this.props.getOrderByUser(id)
	}
	componentWillUnmount() {
		this.props.clearOrder()
	}
	render() {
		return <OrderPanel/>
	}
}