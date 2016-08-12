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
import EditArticle from './components/EditArticle/EditArticle'
//old
// import UserDetail from './components/userdetail'
// import Home from './components/home';
// import RecommendHome from './components/recommendhome';
// import ExplorePage from './components/explorepage';
// import TagList from './components/taglist';
// import UserList from './components/userlist';
import SkuList from './components/skulist';
import StickerList from './components/stickerlist';
// import ArticleList from './components/articlelist';

import EditTag from './components/edittag';
import EditShortVideo from './components/editshortvideo';
import EditSticker from './components/editsticker';
import EditStickerSet from './components/editstickerset';
import EditRecommend from './components/editrecommend';
import EditSku from './components/editsku';
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
        { path:'/sku', component:SkuList },
        { path:'/sticker', component:StickerList },
        
        { path:'/user/:id', component:UserDetail },
        { path:'/tag/:id', component:EditTag },
        { path:'/sticker/set/:id/edit', component:EditStickerSet },
        { path:'/sticker/set/:id/add', component:EditSticker },
        { path:'/recommend/:id/edit', component:EditRecommend },
        { path:'/sku/:id/edit', component:EditSku },
        { path:'/video/edit', component:EditShortVideo },
        { path:'/article/edit', component:EditArticle },
        { path:'/test', component:Test },
    ]
}
