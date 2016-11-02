import React, { Component } from 'react'

export default class extends Component {
	render() {
		return(
			<div style={{padding:20}}>
				<div className="box">
				  	<div className="box-header with-border text-center">
				    	<h3 className="box-title">推送内容</h3>
				  	</div>
				  	<div className="box-body">
				    	推送内容bala............
				  	</div>
				</div>
				<div className="box">
				  	<div className="box-header with-border text-center">
				    	<h3 className="box-title">推送对象</h3>
				  	</div>
				  	<div className="box-header with-border">
				    	平台选择(必选)
				  	</div>
				  	<div className="box-body">
				    	<div className="row">
				    		<div className="col-sm-3 col-xs-6">
	                        	<div className="description-block border-right">
	                        		<div className="description-header">
	                        			<i className="fa fa-apple"></i>
	                        		</div>
	                          		<span className="description-text">iOS开发环境</span>
	                        	</div>
	                      	</div>
	                      	<div className="col-sm-3 col-xs-6">
	                        	<div className="description-block border-right">
	                        		<div className="description-header">
	                        			<i className="fa fa-apple"></i>
	                        		</div>
	                          		<span className="description-text">iOS生产环境</span>
	                        	</div>
	                      	</div>
	                      	<div className="col-sm-3 col-xs-6">
	                        	<div className="description-block border-right">
	                        		<div className="description-header">
	                        			<i className="fa fa-apple"></i>
	                        		</div>
	                          		<span className="description-text">iOS开发环境</span>
	                        	</div>
	                      	</div>
	                      	<div className="col-sm-3 col-xs-6">
	                        	<div className="description-block border-right">
	                        		<div className="description-header">
	                        			<i className="fa fa-apple"></i>
	                        		</div>
	                          		<span className="description-text">iOS开发环境</span>
	                        	</div>
	                      	</div>
				    	</div>
				  	</div>
				</div>

				推送内容
				<hr/>
				<div>
					bla...............
				</div>
				推送对象
				<hr/>
				平台选择(必选)
				<div>
					<div className="box box-default">...</div>
						
				</div>
				目标人群
				<div>
					<div className="btn-group">
					  	<button type="button" className="btn btn-default">Left</button>
					  	<button type="button" className="btn btn-default">Middle</button>
					  	<button type="button" className="btn btn-default">Right</button>
					</div>
				</div>
				发送时间
				<div>
					<div className="btn-group">
					  	<button type="button" className="btn btn-default">Left</button>
					  	<button type="button" className="btn btn-default">Right</button>
					</div>
					<div>
						<div>
							
						是否定时推送
						</div>
						<div className="checkbox">
				        <label>
				          <input type="checkbox"/> Remember me
				        </label>
				      </div>
					</div>
				</div>
				可选设置
				<div>
					
				</div>
			</div>

		)
	}
}