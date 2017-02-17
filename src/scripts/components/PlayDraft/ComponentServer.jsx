import React,{ Component } from 'react'

export const INLINE_STYLES = [
    {label: 'Bold', style: 'BOLD',class:'fa fa-bold'},
    {label: 'Italic', style: 'ITALIC',class:'fa fa-italic'},
    {label: 'Underline', style: 'UNDERLINE',class:'fa fa-underline'},
]
export const BLOCK_TYPES = [
    {label: 'H1', style: 'header-one'},
    {label: 'H2', style: 'header-two'},
    {label: 'Ul', style: 'unordered-list-item',class:'fa fa-list'},
    {label: 'Ol', style: 'ordered-list-item',class:'fa fa-list-ol'},
    {label: 'Quote', style: 'blockquote',class:'fa fa-quote-left'},
]

export const InlineStyleControls = (props) => {
    const currentStyle = props.editorState.getCurrentInlineStyle()
    return (
        <div className='edit-controls'>
	        {
	            INLINE_STYLES.map((inline,index) =>
	                <StyleButton
	                    key={index}
	                    onToggle={props.onToggle}
	                    active={currentStyle.has(inline.style)}
	                    label={inline.label}
	                    style={inline.style}
	                    class={inline.class}
	                />
	            )
	        }
        </div>
    )
}

export const BlockStyleControls = (props) => {
    const {editorState} = props
    const selection = editorState.getSelection()
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType()
    return (
        <div className='edit-controls'>
            {
                BLOCK_TYPES.map((block,index) =>
                    <StyleButton
                        key={index}
                        onToggle={props.onToggle}
                        active={block.style === blockType}
                        label={block.label}
                        style={block.style}
                        class={block.class}
                    />
                )
            }
        </div>
    )
}

class StyleButton extends Component {
    constructor(props) {
        super(props)
        this.onToggle = (e) => {
            e.preventDefault()
            this.props.onToggle(this.props.style)
        }
    }
    render() {
        let className = 'edit-styleButton'
		className+= this.props.active ? ' edit-activeButton ' :''
        return (
            <div className={className} onMouseDown={this.onToggle}>
                {
                    this.props.class ? (<i className={this.props.class}></i>) : (<span>{this.props.label}</span>)
                }
            </div>
        )
    }
}


export class MediaImage extends Component{
	constructor(props) {
		super(props)
		this.state = { showBar:false }
		this.enter = () => this.setState({showBar:true})
		this.leave = () => this.setState({showBar:false})
	}
	render() {
		return(
			<div className="media-image-wrap" onMouseOver={this.enter} onMouseLeave={this.leave}>
				{
					this.state.showBar ? this.props.children : null
				}
		    	<img src={this.props.src} style={{width:this.props.size}} />
		    </div>
		)
	}
}


export function makeId() {
    let text = ''
    const possible = 'abcdefghijklmnopqrstuvwxyz0123456789'
    for( let i=0; i < 10; i++ ) {
      text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    text += `_`
    text += Math.round(Date.now() / 1000)
    return text
}