import React,{ Component } from 'react'

export class DraftImage extends Component {
	render() {
		return(
			<div className="draft-image">
				<div className="del" onMouseDown={this.props.delete}>
					<span className="glyphicon glyphicon-remove"></span>
				</div>
				<img src={this.props.src} />
			</div>
		)
	}
}
class StyleButton extends Component {
	constructor() {
		super()
		this.onToggle = (e) => {
			e.preventDefault()
			this.props.onToggle(this.props.style)
		}
	}
	render() {
		const { label,active } = this.props
		let className = this.props.class + `${active ? ' active':''}`
		return (
			<span 
				className={className}
				data-toggle="tooltip"
				data-placement="top"
				title={label}
				onMouseDown={this.onToggle}
			></span>
		)
	}
}
export const InlineStyleControls = (props) => {
	let currentStyle = props.editorState.getCurrentInlineStyle()
	return (
		<div className="edit-controls">
			{
				INLINE_STYLES.map((type,index) =>
				<StyleButton
					key={`inline_${index}`}
					active={currentStyle.has(type.style)}
					label={type.label}
					onToggle={props.onToggle}
					style={type.style}
					class={type.class}
				/>
			)}
		</div>
	);
};

export const BlockStyleControls = (props) => {
	const {editorState} = props;
	const selection = editorState.getSelection();
	const blockType = editorState
	.getCurrentContent()
	.getBlockForKey(selection.getStartKey())
	.getType()

	return (
		<div className="edit-controls">
			{
				BLOCK_TYPES.map((type,index) =>
				<StyleButton
					key={`block_${index}`}
					active={type.style === blockType}
					label={type.label}
					onToggle={props.onToggle}
					style={type.style}
					class={type.class}
				/>
			)}
		</div>
	);
};
const INLINE_STYLES = [
	{label: '加粗', style: 'BOLD',class:'fa fa-bold'},
	{label: '斜体', style: 'ITALIC',class:'fa fa-italic'},
	{label: '下划线', style: 'UNDERLINE',class:'fa fa-underline'},
]
const BLOCK_TYPES = [
	{label: '标题', style: 'header-one',class:'fa fa-header'},
	{label: '有序列表', style: 'ordered-list-item',class:'fa fa-list-ol'},
	{label: '无序列表', style: 'unordered-list-item',class:'fa fa-list'},
	{label: '引用', style: 'blockquote',class:'fa fa-quote-left'},
]

//function

export function getBlockStyle(block) {
	switch (block.getType()) {
		case 'blockquote':
			return 'edit-blockquote'
		default:
			return null;
	}
}

export function makeId() {
    let text = ''
    const possible = 'abcdefghijklmnopqrstuvwxyz0123456789'
	for( let i=0; i < 10; i++ ) {
		text += possible.charAt(Math.floor(Math.random() * possible.length))
	}
	return text
}