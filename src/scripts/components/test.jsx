import React,{ Component } from 'react'
import Autosuggest from 'react-autosuggest'

const languages = [
  {
    name: 'C',
    year: 19721
  },
  {
    name: 'Elm',
    year: 2012
  },
  {
    name: 'C1',
    year: 19
  },
  {
    name: 'Elm1',
    year: 20121
  },
];

function getSuggestions(value) {
	console.info(value)
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0 ? [] : languages.filter(lang =>
    lang.name.toLowerCase().slice(0, inputLength) === inputValue
  );
}

function getSuggestionValue(suggestion) { // when suggestion is selected, this function tells
  return suggestion.name;                 // what should be the value of the input
}

function renderSuggestion(suggestion) {
  return (
    <div className="search-item">
  		<img src="https://almsaeedstudio.com/themes/AdminLTE/dist/img/user2-160x160.jpg" alt=""/>
    	<span className="item-name">{suggestion.name}</span>
    	<span className="item-desc">{suggestion.year}</span>
  	</div>
  );
}

export default class extends Component {
  constructor() {
    super();

    this.state = {
      value: '',
      suggestions: []
    }
    this.onChange = this._onChange.bind(this)
    this.onSuggestionsFetchRequested = this._onSuggestionsFetchRequested.bind(this)
    this.onSuggestionsClearRequested = this._onSuggestionsClearRequested.bind(this)
    this.onSuggestionSelected = (e,{suggestionValue}) => {
    	alert(suggestionValue)
    }
  }

  _onChange(event, { newValue }){
    this.setState({
      value: newValue
    });
  };

  _onSuggestionsFetchRequested({ value }){
    this.setState({
      suggestions: getSuggestions(value)
    });
  };

  _onSuggestionsClearRequested(){
    this.setState({
      suggestions: []
    });
  };

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: 'Type a programming language',
      value,
      onChange: this.onChange
    };

    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionSelected={this.onSuggestionSelected}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        focusFirstSuggestion={true}
        inputProps={inputProps} />
    );
  }
}