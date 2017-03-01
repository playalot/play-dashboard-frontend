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
        const { bgColor, readOnly, on, off } = this.props
        let classStyle = `play-switch `
        classStyle += this.state.active ? `play-switch-active ` : ` `
        classStyle += readOnly ? `play-switch-readonly ` : ` `
        let isColor = this.state.active && bgColor 
        return(
            <div className={classStyle} style={isColor ? {backgroundColor:bgColor}:{}} onClick={this.handleClick}>
                <div className="play-switch-round"></div>
                <span>{on}</span>
                <span>{off}</span>
            </div>
        )
    }
}
PlaySwitch.defaultProps = {
    active:false,
    readOnly:false,
    on:'',
    off:'',
}