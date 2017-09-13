import React,{ Component } from 'react'
import { Route,Link,Switch,NavLink } from 'react-router-dom'

import PlayMainHeader from '../Common/PlayMainHeader'
import PlayMainSide from '../Common/PlayMainSide'
import PlayWeekPage from '../Common/PlayWeekPage'

import Home from '../Home'
import ExplorePage from '../ExplorePage'
import RecommendHome from '../RecommendHome'
import PostList from '../PostList'
import PageList from '../PageList'
import UserList from '../UserList'
import TagList from '../TagList'
import ToyList from '../ToyList'
import TradeList from '../TradeList'
import StickerList from '../StickerList'
import SkuList from '../SkuList'
import OrderList from '../OrderList'
import FeedbackList from '../FeedbackList'

import Tools from '../Tools'

import Post from '../Post'
import UserDetail from '../UserDetail'
import EditTag from '../EditTag'
import EditToy from '../EditToy'
import EditSku from '../EditSku'
import EditRecommend from '../EditRecommend'

import EditSticker from '../EditSticker'
import EditStickerSet from '../EditStickerSet'
import EditShortVideo from '../EditShortVideo'

import OrderDetail from '../OrderDetail'
import OrderToyList from '../OrderToyList'
import OrderUserList from '../OrderUserList'

import EditPage from '../EditPage'

import PlayAliBaichuan from '../Common/PlayAliBaichuan'

export default class App extends Component{
	render() {
		return (
			<div className="m-grid m-grid--hor m-grid--root m-page">
				<PlayMainHeader/>
				<div className="m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body">
					<PlayMainSide/>
					<div className="m-grid__item m-grid__item--fluid m-wrapper">
						<div className="m-content">
							<Switch>
								<Route exact path="/" component={Home}/>
								<Route path="/home" component={Home}/>
								<Route path="/recommendhome" component={RecommendHome}/>
								<Route path="/explorepage" component={ExplorePage}/>
								<Route path="/posts" component={PostList}/>
								<Route path="/pages" component={PageList}/>
								<Route path="/users" component={UserList}/>
								<Route path="/toys" component={ToyList}/>
								<Route path="/tags" component={TagList}/>
								<Route path="/trades" component={TradeList}/>
								<Route path="/stickers" component={StickerList}/>
								<Route path="/skus" component={SkuList}/>
								<Route path="/orders" component={OrderList}/>
								<Route path="/feedbacks" component={FeedbackList}/>

								<Route path="/post/:id" component={Post}/>
								<Route path="/tools" component={Tools}/>
								<Route path="/weekpage" component={PlayWeekPage}/>

								<Route path="/user/:id" component={UserDetail}/>
								<Route path="/tag/:id" component={EditTag}/>
								<Route path="/toy/:id" component={EditToy}/>
								<Route path="/sku/:id" component={EditSku}/>
								<Route path="/page/edit" component={EditPage}/>
								<Route path="/recommend/:id" component={EditRecommend}/>
								<Route path="/sticker/:id/add" component={EditSticker}/>
								<Route path="/sticker/:id/edit" component={EditStickerSet}/>
								<Route path="/video/edit" component={EditShortVideo}/>
								<Route path="/order/edit/:id" component={OrderDetail}/>
								<Route path="/order/toy/:id" component={OrderToyList}/>
								<Route path="/order/user/:id" component={OrderUserList}/>
							</Switch>
						</div>
					</div>
				</div>
		  	</div>
		)
	}
}
