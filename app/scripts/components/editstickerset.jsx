var React = require('react');
var Reflux = require('reflux');
var Router = require('react-router');
var $ = require('jquery');
var Dropzone = require('react-dropzone');
var Formsy = require('formsy-react');
var Modal = require('react-modal');
var RB = require('react-bootstrap');
var FRC = require('formsy-react-components');
var CDN = require('../widgets/cdn');

var EditStickerSet = React.createClass({
  contextTypes: {
    router: React.PropTypes.object
  },
  getInitialState: function() {
    return {
      image: "",
      alert: false
    };
  },
  componentDidMount: function() {
    $.get('/api/sticker/set/'+this.props.params.id, function(data) {
      if (this.isMounted()) {
        this.refs.form.resetModel(data);
        this.setState({id: data.id, image: data.image});
      }
    }.bind(this));
  },
  onDropImage: function(images) {
    console.log(images);
    var formData = new FormData();
    formData.append('file', images[0]);
    $.ajax({
      url : '/api/upload?key=stickerset/'+this.props.params.id + '.png',
      type : 'POST',
      data : formData,
      processData: false,  // tell jQuery not to process the data
      contentType: false,  // tell jQuery not to set contentType
      success : function(data) {
         console.log(data);
         this.refs.image.setValue(data);
         this.setState({image: data});
      }.bind(this)
    });
  },
  onConfirm: function() {
    this.context.router.push('/sticker');
  },
  onClose: function() {
     this.setState({alert: false});
  },
  submit: function(model) {
    console.log(model);
    $.ajax({
      url: '/api/sticker/set/'+this.props.params.id,  //Server script to process data
      type: 'POST',
      data: JSON.stringify(model),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (res) {
        console.log(res);
        this.setState({alert: true});
      }.bind(this)
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
            <Formsy.Form ref="form" className="pl-form form-horizontal" onSubmit={this.submit} >
              <fieldset>
                <FRC.Input ref="name" name="name" id="cname" value="" label="Name" type="text" placeholder="Input the collection name" required/>
                <FRC.Input ref="description" name="description" id="cdescription" value="" label="Description" type="text" placeholder="Input the collection description" />
                <FRC.Input ref="author" name="author" id="cauthor" value="" label="Author" type="text" placeholder="Input the collection author name" />
                <FRC.Checkbox ref="frame" name="frame" value={false} label="check me out" rowLabel="Frame" />
                <FRC.Input ref="image" name="image" id="cimage" value="" label="Image" type="text" disabled />
                <div className="row">
                  <Dropzone onDrop={this.onDropImage} className="col-sm-offset-3 col-sm-2" style={{width:150, height:100, borderWidth: 2, borderColor: '#666', borderStyle: 'dashed'}}>
                    <div>将图片拖入该区域</div>
                  </Dropzone>
                  <div className="col-sm-3">
                    <img className="img-responsive" style={{maxHeight:'100px'}} src={this.state.image?CDN.show(this.state.image):''}/>
                  </div>
                </div>
                <FRC.Checkbox ref="active" name="active" value={false} label="check me out" rowLabel="Active" />
              </fieldset>
              <FRC.Row layout={'horizontal'}>
                <input name="submit" className="btn btn-primary" formNoValidate={true} type="submit" defaultValue="Submit" />
              </FRC.Row>
            </Formsy.Form>
          </div>
        </div>
        <Modal
          isOpen={this.state.alert}
          style={customStyles}
          onRequestClose={this.onClose} >
          <div className="static-modal">
            <RB.Modal.Body>
              更新成功
            </RB.Modal.Body>
            <RB.Modal.Footer>
              <RB.Button bsStyle="primary"　onClick={this.onConfirm}>确定</RB.Button>
            </RB.Modal.Footer>
          </div>
        </Modal>
      </div>
    );
  }
});

module.exports = EditStickerSet;
