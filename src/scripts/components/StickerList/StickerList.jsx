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
			<div>
				<div className="row mb-3">
					<button className="btn btn-outline-info" onClick={this.addStickerSet}>Add Collection</button>
				</div>
				{
					this.props.sets.map((set) => {
						return (
							<div className="row my-2" key={'set_'+set.id} style={{borderBottom:'1px solid #ccc'}}>
								<div className="col-sm-12">
									<div>
										<div className="d-flex justify-content-between">
											<h3><img style={{maxHeight:'45px'}} src={set.image}/>{' '}{set.name}</h3>
											<div>
												<span onClick={() => this.riseStickerSet(set.id) } className="btn btn-sm"><i className="fa fa-angle-double-up"></i></span>
												<Link to={`/sticker/${set.id}/add`} className="btn btn-sm" style={{color:'#333'}} ><i className="fa fa-plus"></i></Link>
												<Link to={`/sticker/${set.id}/edit`} className="btn btn-sm"  style={{color:'#333'}} ><i className="fa fa-edit"></i></Link>
											</div>
										</div>
										<div className="row">
											{set.stickers.map((sticker) => {
												return (
													<div className="col-6 col-sm-1" key={'sticker_'+sticker.id}>
														<div className="box box-solid">
															<div className="box-body" style={{backgroundColor:'#aaaaaa'}}>
																	<img className="w-100" src={sticker.image} />
															</div>
															<div className="box-footer">
																<div className="pull-right btn-toolbar">
																	<span onClick={() => this.riseSticker(set.id, sticker.id) } className="btn btn-sm"><i className="fa fa-angle-double-up"></i></span>
																	<span onClick={() => this.deleteSticker(set.id, sticker.id) } className="btn btn-sm"><i className="fa fa-trash"></i></span>
																</div>
															</div>
														</div>
													</div>
												);
											})}
										</div>
									</div>
								</div>
							</div>
						)
					})
				}
			</div>
		)
	}
}