import React,{ Component } from 'react'
import { Link } from 'react-router'
import {
	Row, Col, Button, ButtonToolbar, 
} from 'react-bootstrap'

export default class StickerList extends Component{
	constructor(props) {
	  	super(props)
	
	  	this.state = {}
	  	this.addStickerSet = this._addStickerSet.bind(this)
	  	this.riseStickerSet = (id) => this.props.riseStickerSet(id)
	  	this.riseSticker = (id,sid) => this.props.riseSticker(id,sid)
	  	this.deleteSticker = this._deleteSticker.bind(this)
	}
	componentWillMount() {
		if(!this.props.loaded){
			this.props.fetchSets()
		}
	}
	_addStickerSet() {
		if (confirm('创建一个新的贴纸集？')) {
			this.props.addStickerSet()
    	}
	}
	_deleteSticker(id,sid) {
		if (confirm('确定要删除这个贴纸？')) {
			this.props.deleteSticker(id,sid)
    	}
	}
	render() {
		return(
			<div className="content">
	          <Row>
	            <Col sm={3}>
	              <Button bsStyle='success' onClick={this.addStickerSet}>Add Collection</Button>
	              <br/><br/>
	            </Col>
	          </Row>
	          {this.props.sets.map((set) => {
	            return (
	              <Row key={'set_'+set.id}>
	                <Col sm={12}>
	                  <div className="box">
	                    <div className="box-header with-border">
	                      <h3 className="box-title"><img style={{maxHeight:'45px'}} src={set.image}/>{' '}{set.name}</h3>
	                      <div className="box-tools pull-right">
	                        <span onClick={() => this.riseStickerSet(set.id) } className="btn btn-sm"><i className="fa fa-angle-double-up"></i></span>
	                        <Link to={'/sticker/set/' + set.id + '/add'} className="btn btn-box-tool" ><i className="fa fa-plus"></i></Link>
	                        <Link to={'/sticker/set/' + set.id + '/edit'} className="btn btn-box-tool" ><i className="fa fa-edit"></i></Link>
	                      </div>
	                    </div>
	                    <div className="box-body">
	                      {set.stickers.map((sticker) => {
	                        return (
	                          <Col className="col" xs={6} sm={1} lg={1} key={'sticker_'+sticker.id}>
	                            <div className="box box-solid">
	                              <div className="box-body" style={{backgroundColor:'#aaaaaa'}}>
	                                  <img className="img-responsive" src={sticker.image} />
	                              </div>
	                              <div className="box-footer">
	                                <ButtonToolbar className="pull-right">
	                                  <span onClick={() => this.riseSticker(set.id, sticker.id) } className="btn btn-sm"><i className="fa fa-angle-double-up"></i></span>
	                                  <span onClick={() => this.deleteSticker(set.id, sticker.id) } className="btn btn-sm"><i className="fa fa-trash"></i></span>
	                                </ButtonToolbar>
	                              </div>
	                            </div>
	                          </Col>
	                        );
	                      })}
	                    </div>
	                  </div>
	                </Col>
	              </Row>
	            );
	          })}
	        </div>

		)
	}
}