import React, { Component } from 'react'
import Autosuggest from 'react-autosuggest'

export default class PlayAutoSuggest extends Component {
	constructor(props) {
	  	super(props)
	  	this.state = {
	  		query:'',

	  	}
	  	this.renderSuggestion = this._renderSuggestion.bind(this)
	  	this.onChange = (event,{newValue}) => this.setState({query: newValue})
	}
	_renderSuggestion(suggestion) {
		const { 
			cover, name, desc,
		} = this.props
		return (
			<div className="search-item">
			  <img className="img-rounded" src={suggestion[cover]}/>
			  <span className="item-name">{suggestion[name]}</span>
			  <span className="item-desc">{suggestion[desc]}</span>
			</div>
		)
	}
	render() {
		const { 
			placeholder,results,
			fetch,
			clear,
			getValue,
			selectValue,
		} = this.props
		const inputProps = {
			placeholder,
			value: this.state.query,
			onChange: this.onChange,
	    }
		return(
			<Autosuggest
				suggestions={results}
		        onSuggestionsFetchRequested={fetch}
		        onSuggestionsClearRequested={clear}
				getSuggestionValue={getValue}
				renderSuggestion={this.renderSuggestion}
				onSuggestionSelected={selectValue}
				inputProps={inputProps}
			/>
		)
	}
}

PlayAutoSuggest.propTypes = {
	fetch:React.PropTypes.func.isRequired,
	clear:React.PropTypes.func.isRequired,
	getValue:React.PropTypes.func.isRequired,
	selectValue:React.PropTypes.func.isRequired,
	results:React.PropTypes.array.isRequired,
}
PlayAutoSuggest.defaultProps = {
	placeholder:`请输入关键字`,
	cover:`cover`,
	name:`name`,
	desc:`desc`
}