import React from 'react'
//new
import App from './components/App/App.jsx'
import Home from './components/Home/index'
import ExplorePage from './components/ExplorePage/index'
import RecommendHome from './components/RecommendHome/index'
import PostList from './components/PostList/index'
import ArticleList from './components/ArticleList/index'
import UserList from './components/UserList/index'
import TagList from './components/TagList/index'
import UserDetail from './components/UserDetail/index'
import ToyList from './components/ToyList/index'
import StickerList from './components/StickerList/index'
import ReportList from './components/ReportList/index'
import FeedbackList from './components/FeedbackList/index'

import EditArticle from './components/EditArticle/EditArticle'
import EditStickerSet from './components/EditStickerSet/EditStickerSet'
import EditSticker from './components/EditSticker/EditSticker'
//old
// import UserDetail from './components/userdetail'
// import Home from './components/home';
// import RecommendHome from './components/recommendhome';
// import ExplorePage from './components/explorepage';
// import TagList from './components/taglist';
// import UserList from './components/userlist';
// import ToyList from './components/toylist';
// import StickerList from './components/stickerlist';
// import ArticleList from './components/articlelist';

import EditTag from './components/edittag';
import EditShortVideo from './components/editshortvideo';
// import EditSticker from './components/editsticker';
// import EditStickerSet from './components/editstickerset';
import EditRecommend from './components/editrecommend';
import EditToy from './components/edittoy';
// import EditArticle from './components/editarticle';

import Test from './components/test';

export default {
    path: '/',
    component: App,
    indexRoute: { component:Home },
    childRoutes: [
        { path:'/home', component:Home },
        { path:'/recommendhome', component:RecommendHome },
        { path:'/explorepage', component:ExplorePage },
        { path:'/post', component:PostList },
        { path:'/article', component:ArticleList },
        { path:'/user', component:UserList },
        { path:'/tag', component:TagList },
        { path:'/toy', component:ToyList },
        { path:'/sticker', component:StickerList },
        { path:'/report', component:ReportList },
        { path:'/feedback', component:FeedbackList },

        { path:'/user/:id', component:UserDetail },
        { path:'/tag/:id', component:EditTag },
        { path:'/sticker/set/:id/edit', component:EditStickerSet },
        { path:'/sticker/set/:id/add', component:EditSticker },
        { path:'/recommend/:id/edit', component:EditRecommend },
        { path:'/toy/:id/edit', component:EditToy },
        { path:'/video/edit', component:EditShortVideo },
        { path:'/article/edit', component:EditArticle },
        { path:'/test', component:Test },
    ]
}