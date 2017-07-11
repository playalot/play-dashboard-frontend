import React,{ Component } from 'react'
import { Link } from 'react-router-dom'
import {
	Row, Col, Button, ButtonToolbar, 
} from 'react-bootstrap'

export default class StickerList extends Component{
	constructor(props) {
	  	super(props)
	  	this.addStickerSet = () => confirm('创建一个新的贴纸集？') && this.props.addStickerSet()
	  	this.deleteSticker = (id,sid) => confirm('确定要删除这个贴纸？') && this.props.deleteSticker(id,sid)
	  	this.riseStickerSet = (id) => this.props.riseStickerSet(id)
	  	this.riseSticker = (id,sid) => this.props.riseSticker(id,sid)
	}
	componentWillMount() {
		if(!this.props.loaded){
			this.props.fetchSets()
		}
	}
	render() {
		return(
			<div className="content">
				<Row>
					<button className="btn btn-outline green" onClick={this.addStickerSet}>Add Collection</button>
				</Row>
				{
					this.props.sets.map((set) => {
						return (
							<Row key={'set_'+set.id} style={{borderBottom:'1px solid #eee'}}>
								<Col sm={12}>
									<div>
										<div className="d-flex justify-content-between">
											<h3><img style={{maxHeight:'45px'}} src={set.image}/>{' '}{set.name}</h3>
											<div>
												<span onClick={() => this.riseStickerSet(set.id) } className="btn btn-sm"><i className="fa fa-angle-double-up"></i></span>
												<Link to={`/sticker/${set.id}/add`} className="btn btn-sm" style={{color:'#333'}} ><i className="fa fa-plus"></i></Link>
												<Link to={`/sticker/${set.id}/edit`} className="btn btn-sm"  style={{color:'#333'}} ><i className="fa fa-edit"></i></Link>
											</div>
										</div>
										<div>
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
						)
					})
				}
			</div>
		)
	}
}