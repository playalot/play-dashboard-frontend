import React,{ Component } from 'react'
import { Entity } from 'draft-js'
import {convertFromHTML} from 'draft-convert'
import { stateToHTML } from 'draft-js-export-html'
export const mediaBlockRenderer = (block) => {
	if (block.getType() === 'atomic') {
		return {
			component: (props) => {
				const entityKey = props.block.getEntityAt(0)
				const entity = props.contentState.getEntity(entityKey)
				const { html, src } = entity.getData()
				const type = entity.getType()

				if (type === 'image') {
					return <img src={src} />
				}else if (type === 'video') {
					return <div dangerouslySetInnerHTML={{__html: html}}></div>
				}
				return null
			},
			editable: false,
		}
	}
    return null
}

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


export const draftFromHtml = (html) => {
	return convertFromHTML({
		htmlToEntity:(nodeName,node) => {
			if (nodeName === 'a') {
				return Entity.create(
					'LINK',
					'IMMUTABLE',
					{url: node.href}
				)
			}
			if (nodeName === 'img') {
				return Entity.create('image','IMMUTABLE',{
					src:node.src,
					type:'image'
				})
			}
		},
		htmlToBlock: (nodeName, node, lastList, inBlock) => {
			if (nodeName === 'figure' && node.firstChild.nodeName === 'IMG' || (nodeName === 'img' && inBlock !== 'atomic')) {
				return 'atomic'
			}
		}
	})(html)
}

export const draftToHtml = (contentState) => {
	const options = {
		blockRenderers: {
			atomic: (block) => {
				const entity = contentState.getEntity(block.getEntityAt(0))
				const data = entity.getData()
				if (data.type === 'image') {
					return `<figure><img src="${data.src}" style="max-width:'100%'" /></figure>`
				} else if (data.type === 'video') {
					if(data.src) {
						return `<figure><video width="100%" src="${data.src}" poster="${data.poster}" controls /></figure>`
					}else {
						return `<figure>${data.html}</figure>`
					}
				} else {
					return null
				}
			},
		}
	}
	return stateToHTML(contentState,options).replace(/<p><br><\/p>\s?<figure>/g,'<figure>')
}