import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import Layout from './components/layout';
import Home from './components/home';
import RecommendHome from './components/recommendhome';
import ExplorePage from './components/explorepage';
import PostList from './components/postlist';
import UserList from './components/userlist';
import SkuList from './components/skulist';
import UserDetail from './components/userdetail';
import TagList from './components/taglist';
import StickerList from './components/stickerlist';
import ArticleList from './components/articlelist';

import EditTag from './components/edittag';
import EditShortVideo from './components/editshortvideo';
import EditSticker from './components/editsticker';
import EditStickerSet from './components/editstickerset';
import EditRecommend from './components/editrecommend';
import EditSku from './components/editsku';
import EditArticle from './components/editarticle';

import Test from './components/test';

ReactDOM.render((
	<Router history={hashHistory}>
		<Route name="layout" path="/" component={Layout}>
	    <IndexRoute component={Home} />
	    <Route path="home" component={Home} />
			<Route path="manage/home" component={RecommendHome} />
			<Route path="manage/explore" component={ExplorePage} />
	    <Route path="post" component={PostList} />
			<Route path="article" component={ArticleList} />
			<Route path="user" component={UserList} />
			<Route path="tag" component={TagList} />
			<Route path="sku" component={SkuList} />
			<Route path="sticker" component={StickerList} />
			<Route path="/user/:id" component={UserDetail} />
			<Route path="/tag/:id" component={EditTag} />
			<Route path="/sticker/set/:id/edit" component={EditStickerSet} />
			<Route path="/sticker/set/:id/add" component={EditSticker} />
			<Route path="/recommend/:id/edit" component={EditRecommend} />
			<Route path="/sku/:id/edit" component={EditSku} />
			<Route path="video/edit" component={EditShortVideo} />
			<Route path="article/edit" component={EditArticle} />
	    <Route path="test" component={Test} />
		</Route>
	</Router>
), document.getElementById('app'));
