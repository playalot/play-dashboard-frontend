import React from 'react'
//new
import App from './components/App'
import Home from './components/Home'
import ExplorePage from './components/ExplorePage'
import RecommendHome from './components/RecommendHome'
import PostList from './components/PostList'
import PageList from './components/PageList'
import UserList from './components/UserList'
import TagList from './components/TagList'
import UserDetail from './components/UserDetail'
import ToyList from './components/ToyList'
import StickerList from './components/StickerList'
import ReportList from './components/ReportList'
import FeedbackList from './components/FeedbackList'
import SkuList from './components/SkuList'
import OrderList from './components/OrderList'

import OrderDetail from './components/OrderDetail'

import EditPage from './components/EditPage'
import EditStickerSet from './components/EditStickerSet/EditStickerSet'
import EditSticker from './components/EditSticker/EditSticker'
import EditTag from './components/EditTag'
import EditToy from './components/EditToy/EditToy'
import EditRecommend from './components/EditRecommend/EditRecommend'
import EditShortVideo from './components/EditShortVideo/EditShortVideo'
import EditSku from './components/EditSku'

import Notification from './components/Notification/Notification.jsx'

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
        { path:'/page', component:PageList },
        { path:'/user', component:UserList },
        { path:'/tag', component:TagList },
        { path:'/toy', component:ToyList },
        { path:'/sku', component:SkuList },
        { path:'/order', component:OrderList },
        { path:'/sticker', component:StickerList },
        { path:'/report', component:ReportList },
        { path:'/feedback', component:FeedbackList },

        { path:'/order/:id', component:OrderDetail },
        
        { path:'/user/:id', component:UserDetail },
        { path:'/tag/:id', component:EditTag },
        { path:'/sticker/set/:id/edit', component:EditStickerSet },
        { path:'/sticker/set/:id/add', component:EditSticker },
        { path:'/recommend/:id/edit', component:EditRecommend },
        { path:'/toy/:id/edit', component:EditToy },
        { path:'/sku/:id/edit', component:EditSku },
        { path:'/video/edit', component:EditShortVideo },
        { path:'/page/edit', component:EditPage },
        { path:'/page/edit/:id', component:EditPage },
        { path:'/test', component:Test },
        
        { path:'/notification', component:Notification },

    ]
}
