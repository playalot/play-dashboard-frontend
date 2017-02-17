import React from 'react'
import {
	CompositeDecorator
} from 'draft-js'
//链接组件
function findLinkEntities(contentBlock, callback, contentState) {
	contentBlock.findEntityRanges(
		(character) => {
			const entityKey = character.getEntity()
			return (
				entityKey !== null &&
				contentState.getEntity(entityKey).getType() === 'LINK'
			);
		},
		callback
	);
}

const LINK = (props) => {
	const {url} = props.contentState.getEntity(props.entityKey).getData()
	return (
		<a href={url} style={{'textDecoration': 'underline'}}>
	    	{props.children}
		</a>
	)
}

export default new CompositeDecorator([
    {
      strategy: findLinkEntities,
      component: LINK,
    },
])