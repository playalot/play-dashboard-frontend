var React = require('react');
var Link = require('react-router').Link;
var Reflux = require('reflux');
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var Button = require('react-bootstrap').Button;
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;
var StickerStore = require('../stores/stickerstore');
var StickerActions = require('../actions/stickeractions');

var StickerSet = React.createClass({
  mixins: [Reflux.connect(StickerStore, 'sets')],
  getInitialState: function() {
    return {
      showStickerForm: false
    };
  },
  addStickerSet: function() {
    if (confirm('创建一个新的贴纸集？')) {
      StickerActions.addStickerSet();
    }
  },
  deleteSticker: function(setId, stickerId) {
    if (confirm('确定要删除这个贴纸？')) {
      StickerActions.deleteSticker(setId, stickerId);
    }
  },
  riseSticker: function(setId, stickerId) {
    StickerActions.riseSticker(setId, stickerId);
  },
  riseStickerSet: function(setId) {
    StickerActions.riseStickerSet(setId);
  },
  toggleStickerForm: function(sticker) {
    var value = this.state.showStickerForm;
    this.setState({ showStickerForm: !value});
  },
  render: function() {
    if (this.state.sets) {
      return (
        <div className="content">
          <Row>
            <Col sm={3}>
              <Button bsStyle='success' onClick={this.addStickerSet}>Add Collection</Button>
              <br/><br/>
            </Col>
          </Row>
          {this.state.sets.map(function(set) {
            // var toggleSetForm = this.toggleSetForm;
            return (
              <Row key={'set_'+set.id}>
                <Col sm={12}>
                  <div className="box">
                    <div className="box-header with-border">
                      <h3 className="box-title"><img style={{maxHeight:'45px'}} src={set.image}/>{' '}{set.name}</h3>
                      <div className="box-tools pull-right">
                        <span onClick={ this.riseStickerSet.bind(this, set.id) } className="btn btn-sm"><i className="fa fa-angle-double-up"></i></span>
                        <Link to={'/sticker/set/' + set.id + '/add'} className="btn btn-box-tool" ><i className="fa fa-plus"></i></Link>
                        <Link to={'/sticker/set/' + set.id + '/edit'} className="btn btn-box-tool" ><i className="fa fa-edit"></i></Link>
                      </div>
                    </div>
                    <div className="box-body">
                      {set.stickers.map(function(sticker) {
                        return (
                          <Col className="col" xs={6} sm={1} lg={1} key={'sticker_'+sticker.id}>
                            <div className="box box-solid">
                              <div className="box-body" style={{backgroundColor:'#aaaaaa'}}>
                                  <img className="img-responsive" src={sticker.image} />
                              </div>
                              <div className="box-footer">
                                <ButtonToolbar className="pull-right">
                                  <span onClick={ this.riseSticker.bind(this, set.id, sticker.id) } className="btn btn-sm"><i className="fa fa-angle-double-up"></i></span>
                                  <span onClick={ this.deleteSticker.bind(this, set.id, sticker.id) } className="btn btn-sm"><i className="fa fa-trash"></i></span>
                                </ButtonToolbar>
                              </div>
                            </div>
                          </Col>
                        );
                      }, this)}
                    </div>
                  </div>
                </Col>
              </Row>
            );
          }, this)}
        </div>
      );
    } else {
      return (<Row></Row>);
    }
  }
});

module.exports = StickerSet;
