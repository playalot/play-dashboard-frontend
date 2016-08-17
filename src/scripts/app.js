import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import Layout from './components/layout';
import Home from './components/home';
import RecommendHome from './components/recommendhome';
import ExplorePage from './components/explorepage';
import PostList from './components/postlist';
import UserList from './components/userlist';
import ToyList from './components/toylist';
import UserDetail from './components/userdetail';
import TagList from './components/taglist';
import StickerList from './components/stickerlist';
import ArticleList from './components/articlelist';

import EditTag from './components/edittag';
import EditShortVideo from './components/editshortvideo';
import EditSticker from './components/editsticker';
import EditStickerSet from './components/editstickerset';
import EditRecommend from './components/editrecommend';
import EditToy from './components/edittoy';
import EditArticle from './components/editarticle';

import Test from './components/test';

import '../sass/style.scss'
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
			<Route path="toy" component={ToyList} />
			<Route path="sticker" component={StickerList} />
			<Route path="/user/:id" component={UserDetail} />
			<Route path="/tag/:id" component={EditTag} />
			<Route path="/sticker/set/:id/edit" component={EditStickerSet} />
			<Route path="/sticker/set/:id/add" component={EditSticker} />
			<Route path="/recommend/:id/edit" component={EditRecommend} />
			<Route path="/toy/:id/edit" component={EditToy} />
			<Route path="video/edit" component={EditShortVideo} />
			<Route path="article/edit" component={EditArticle} />
	    <Route path="test" component={Test} />
		</Route>
	</Router>
), document.getElementById('app'));
