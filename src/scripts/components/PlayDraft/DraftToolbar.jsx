import React, { Component } from 'react'

import { RichUtils,EditorState } from 'draft-js'
import { InlineStyleControls, BlockStyleControls } from './draftServer'

import { createLinkEntity,createImageEntity,createVideoEntityWithHtml,createVideoEntityWithSrc,removeEntity } from './entityServer'

export default class extends Component {
	constructor(props) {
	  	super(props)
	  	this.state = {
	  		//Link
	  		dialogLink:false,
	  		aUrl:'',
	  		aTxt:'',
	  	}
	  	this.toggleInlineStyle = this._toggleInlineStyle.bind(this)
	  	this.toggleBlockType = this._toggleBlockType.bind(this)

	  	this.promptForLink = this._promptForLink.bind(this)
	  	this.addLink = this._addLink.bind(this)
	}
	componentDidMount() {
		const affix = document.querySelector('#page-affix')
		const affixOffsetTop = affix.offsetTop
		window.addEventListener('scroll',() => {
			if(document.body.scrollTop >= affixOffsetTop - 60){
				$('#page-affix').css({position:'fixed',top:70})
			}else {
				$('#page-affix').css({position:'relative',top:0})
			}
		})
	}
	_toggleInlineStyle(inlineStyle) {
		this.props.onChange(
			RichUtils.toggleInlineStyle(
				this.props.editorState,
				inlineStyle
			)
		);
	}
	_toggleBlockType(blockType) {
		this.props.onChange(
			RichUtils.toggleBlockType(
				this.props.editorState,
				blockType
			)
		);
	}
	_promptForLink() {
		const { editorState } = this.props
		const selection = editorState.getSelection()
		if (!selection.isCollapsed()) {
			const url = prompt('请输入地址')
			if (url && url.trim()) {
				this.props.onChange(EditorState.moveFocusToEnd(createLinkEntity(editorState,url)))
			}
		}else{
			this.setState({dialogLink:true})
		}
	}
	_addLink() {
		const { editorState } = this.props
		const { aTxt,aUrl } = this.state
		if(!aTxt.trim() || !aUrl.trim()){
			return alert('输入不能为空')
		}
		this.props.onChange(EditorState.moveFocusToEnd(createLinkEntity(editorState,aUrl,aTxt)))
		this.setState({ aUrl:'',aTxt:'',dialogLink:false })
	}

	render() {
		const { editorState } = this.props
		return(
			<div style={{minHeight:40}}>
				<div id="page-affix">
					<InlineStyleControls
						editorState={editorState}
						onToggle={this.toggleInlineStyle}
					/>
					<BlockStyleControls
						editorState={editorState}
						onToggle={this.toggleBlockType}
					/>
					<div className="edit-controls">
						<span data-toggle="tooltip" data-placement="top" title="链接" className="fa fa-link" onClick={this.promptForLink}>
						</span>
						{this.props.children}
					</div>
					
				</div>
				{
					this.state.dialogLink ?
					<div className="play-modal" style={{zIndex:2}} onClick={() => this.setState({dialogLink:false})}>
						<div className="play-dialog" onClick={e => e.stopPropagation()}>
							<p className="dialog-title">添加链接</p>
							<span onClick={() => this.setState({dialogLink:false})} className="dialog-close">×</span>
							<div>
								<input type="text" className="form-control" value={this.state.aUrl} onChange={e => this.setState({aUrl:e.target.value})} placeholder="链接地址"/>
								<input type="text" style={{marginTop:'10px'}} className="form-control" value={this.state.aTxt} onChange={e => this.setState({aTxt:e.target.value})} placeholder="链接文本"/>
							</div>
							<div className="dialog-footer">
								<button className="btn green btn-outline pull-right" onClick={this.addLink}>插入</button>
							</div>
						</div>
					</div>
					: null
				}
			</div>

		)
	}
}