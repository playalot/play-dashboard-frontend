var Reflux = require('reflux');
var React = require('react');
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;

var Test = React.createClass({
  render: function() {
    console.log('run test');
    var heights = [100, 50, 200, 300, 500, 90, 1000, 300, 200, 50];
    return (
      <div className="content">
        
      </div>
    );
  }
});

module.exports = Test;
