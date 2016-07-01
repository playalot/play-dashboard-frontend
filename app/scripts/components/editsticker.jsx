var React = require('react');
var Reflux = require('reflux');
var Router = require('react-router');
var $ = require('jquery');
var Dropzone = require('react-dropzone');
var Formsy = require('formsy-react');
var FRC = require('formsy-react-components');

var EditSticker = React.createClass({
  contextTypes: {
    router: React.PropTypes.object
  },
  getInitialState: function() {
    return {
      image: ""
    };
  },
  componentDidMount: function() {
    this.refs.setId.setValue(this.props.params.id);
  },
  onDropImage: function(images) {
    console.log(images);
    var formData = new FormData();
    formData.append('file', images[0]);
    $.ajax({
           url : '/api/upload?key=sticker_$id.png',
           type : 'POST',
           data : formData,
           processData: false,  // tell jQuery not to process the data
           contentType: false,  // tell jQuery not to set contentType
           success : function(data) {
               console.log(data);
               this.refs.image.setValue(data);
               var id = data.split(/[_\.]/)[1];
               this.refs.id.setValue(id);
               this.setState({image: data});
           }.bind(this)
    });
  },
  submit: function(model) {
    console.log(model);
    model.score = 0;
    $.ajax({
      url: '/api/sticker',  //Server script to process data
      type: 'POST',
      data: JSON.stringify(model),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (res) {
        console.log(res);
        alert("success!");
      }
    });
  },
  render: function() {
    var customStyles = {
      content : {
        zIndex                : 3,
        width                 : '300px',
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
      }
    };
    return (
      <div className="content">
        <div className="box box-solid">
          <div className="box-body">
            <Formsy.Form ref="form" className="pl-form form-horizontal"  onSubmit={this.submit} >
              <fieldset>
                <FRC.Input ref="id" name="id" id="id" value="" label="ID" type="text" disabled />
                <FRC.Input ref="subject" name="subject" id="subject" value="" label="话题" type="text" placeholder="Input the subject" />
                <FRC.Input ref="setId" name="setId" id="setid" value="" label="集合ID" type="text" disabled />
                <FRC.Input ref="image" name="image" id="image" value="" label="图片" type="text" disabled />
                <div className="row">
                  <img className="img-responsive col-sm-offset-3" style={{maxWidth:'150px'}} src={this.state.image?'http://7xpruf.com1.z0.glb.clouddn.com/'+this.state.image:''}/>
                </div>
                <div className="row">
                  <div className="col-sm-offset-3">
                    <Dropzone onDrop={this.onDropImage} width={150} height={50}>
                      <div>更改图片</div>
                    </Dropzone>
                  </div>
                </div>
              </fieldset>
              <FRC.Row layout={'horizontal'}>
                <input name="cancel" className="btn btn-default" type="button" defaultValue="Cancel" />
                {' '}
                <input name="submit" className="btn btn-primary" formNoValidate={true} type="submit" defaultValue="Submit" />
              </FRC.Row>
            </Formsy.Form>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = EditSticker;
