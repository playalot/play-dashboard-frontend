import React,{ Component } from 'react'

export default class PlaySwitch extends Component {
    constructor(props) {
        super(props)
        this.state = {
            active:false
        }
        this.handleClick = this._handleClick.bind(this)
    }
    componentWillMount() {
        this.setState({
            active:this.props.active
        })
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            active: nextProps.active
        })
    }
    _handleClick() {
        if(this.props.readOnly) {
            return
        }
        this.setState({active:!this.state.active},() => {
            this.props.onChange && this.props.onChange(this.state.active)
        })
    }
    render() {
        const { bgColor, on, off } = this.props
        let className = `play-switch `
        className += this.state.active ? `active ` : ` `
        return(
            <div className={className} onClick={this.handleClick}>
                <div className="play-switch-rect">
                    <div>{on}</div>
                    <div></div>
                    <div>{off}</div>
                </div>
            </div>
        )
    }
}
PlaySwitch.defaultProps = {
    active:false,
    on:'ON',
    off:'OFF',
}