import { EditorState,ContentState,Modifier,SelectionState,RichUtils,AtomicBlockUtils,Entity } from 'draft-js'

export function removeEntity(editorState,blockKey) {
	const contentState = editorState.getCurrentContent()
	return EditorState.push(editorState, contentState.updateIn(['blockMap'], blockMap => {
		return blockMap.delete(blockKey)
	}), 'move-block')
}


export function createLinkEntity(editorState,url,text) {
	const contentState = editorState.getCurrentContent()
	const contentStateWithEntity = contentState.createEntity('LINK', 'IMMUTABLE', {url})
	const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
	if(text) {
		const blockMap = ContentState.createFromText(text).blockMap
		const selection = editorState.getSelection()
		let newState = Modifier.replaceWithFragment(contentState, selection, blockMap);
		const selectionState = new SelectionState({
			anchorKey: selection.getAnchorKey(),
			anchorOffset: selection.getStartOffset(),
			focusKey: selection.getAnchorKey(),
			focusOffset: selection.getStartOffset() + text.length
		})
		newState = Modifier.applyEntity(newState, selectionState, entityKey)
		return EditorState.push(editorState, newState, 'insert-fragment')
	}else {
		return RichUtils.toggleLink(editorState, editorState.getSelection(), entityKey)
	}
}

export function createImageEntity(editorState,src) {
	const contentState = editorState.getCurrentContent()
	const type = 'image'
	const contentStateWithEntity = contentState.createEntity('image', 'IMMUTABLE', { src, type })
	const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
	return AtomicBlockUtils.insertAtomicBlock(editorState,entityKey,' ')
}

export function createVideoEntityWithHtml(editorState,html) {
	const type = 'video'
	const contentState = editorState.getCurrentContent()
	const contentStateWithEntity = contentState.createEntity('video', 'IMMUTABLE', { html,type })
	const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
	return AtomicBlockUtils.insertAtomicBlock(editorState,entityKey,' ')
}

export function createVideoEntityWithSrc(editorState,src) {
	const poster = `${src}?vframe/jpg/offset/1`
	const html = `<video width="100%" src="${src}" poster="${poster}" controls>`
	const type = 'video'
	const contentState = editorState.getCurrentContent()
	const contentStateWithEntity = contentState.createEntity('video', 'IMMUTABLE', { html,type,src,poster })
	const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
	return AtomicBlockUtils.insertAtomicBlock(editorState,entityKey,' ')
}