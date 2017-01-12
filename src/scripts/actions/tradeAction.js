import Request from 'superagent'

export const TRADE_L_RECEIVE_TRADE = 'TRADE_L_RECEIVE_TRADE'

function receiveTrade() {
	return {
		type: TRADE_L_RECEIVE_TRADE,
		res:data.tradeItems,
		totalPages:data.totalPages,
		page:0,
	} 
}

export function getTrade(page = 0) {
	return (dispatch,getState) => {
        let params = { page }
        // return Request
        //     .get(`/api/orders`)
        //     .query(params)
        //     .end((err, res) => {
                dispatch(receiveTrade())
            // })
    }
}

const data = {
	"tradeItems": [
        {
            "id": "586e10a31a00004a008aa156",
            "title": "合成人类",
            "price": {
                "price": 2999
            },
            "cls": [
                "586511cdc0dccdbf4928467a"
            ],
            "tbUrl": null,
            "type": "buy",
            "user": {
                "id": "569209f31100001c00fd83f3",
                "nickname": "TBXark",
                "avatar": "http://img.playalot.cn/user/avatar/5f29a_1475145763_w_479_h_479_569209f31100001c00fd83f3.jpg?imageView2/2/w/120/q/90",
                "cover": "http://img.playalot.cn/user/cover/6cfba_1482910184_w_694_h_694_569209f31100001c00fd83f3.jpg?imageView2/2/w/1280/q/90",
                "bio": "Little birds can remember",
                "gender": "m",
                "level": 0,
                "approval": "程序狗"
            },
            "photos": [
                {
                    "url": "http://img.playalot.cn/trade/ca48e_1483608191_w_1280_h_852_569209f31100001c00fd83f3.jpg?imageView2/2/w/1280/q/90",
                    "url320": "http://img.playalot.cn/trade/ca48e_1483608191_w_1280_h_852_569209f31100001c00fd83f3.jpg?imageView2/2/w/320/q/90",
                    "url640": "http://img.playalot.cn/trade/ca48e_1483608191_w_1280_h_852_569209f31100001c00fd83f3.jpg?imageView2/2/w/640/q/90",
                    "url720": "http://img.playalot.cn/trade/ca48e_1483608191_w_1280_h_852_569209f31100001c00fd83f3.jpg?imageView2/2/w/720/q/90",
                    "url1080": "http://img.playalot.cn/trade/ca48e_1483608191_w_1280_h_852_569209f31100001c00fd83f3.jpg?imageView2/2/w/1080/q/90",
                    "tags": []
                },
                {
                    "url": "http://img.playalot.cn/trade/cb010_1483608191_w_1280_h_852_569209f31100001c00fd83f3.jpg?imageView2/2/w/1280/q/90",
                    "url320": "http://img.playalot.cn/trade/cb010_1483608191_w_1280_h_852_569209f31100001c00fd83f3.jpg?imageView2/2/w/320/q/90",
                    "url640": "http://img.playalot.cn/trade/cb010_1483608191_w_1280_h_852_569209f31100001c00fd83f3.jpg?imageView2/2/w/640/q/90",
                    "url720": "http://img.playalot.cn/trade/cb010_1483608191_w_1280_h_852_569209f31100001c00fd83f3.jpg?imageView2/2/w/720/q/90",
                    "url1080": "http://img.playalot.cn/trade/cb010_1483608191_w_1280_h_852_569209f31100001c00fd83f3.jpg?imageView2/2/w/1080/q/90",
                    "tags": []
                },
                {
                    "url": "http://img.playalot.cn/trade/22159_1483608191_w_1280_h_852_569209f31100001c00fd83f3.jpg?imageView2/2/w/1280/q/90",
                    "url320": "http://img.playalot.cn/trade/22159_1483608191_w_1280_h_852_569209f31100001c00fd83f3.jpg?imageView2/2/w/320/q/90",
                    "url640": "http://img.playalot.cn/trade/22159_1483608191_w_1280_h_852_569209f31100001c00fd83f3.jpg?imageView2/2/w/640/q/90",
                    "url720": "http://img.playalot.cn/trade/22159_1483608191_w_1280_h_852_569209f31100001c00fd83f3.jpg?imageView2/2/w/720/q/90",
                    "url1080": "http://img.playalot.cn/trade/22159_1483608191_w_1280_h_852_569209f31100001c00fd83f3.jpg?imageView2/2/w/1080/q/90",
                    "tags": []
                },
                {
                    "url": "http://img.playalot.cn/trade/0acec_1483608192_w_1280_h_852_569209f31100001c00fd83f3.jpg?imageView2/2/w/1280/q/90",
                    "url320": "http://img.playalot.cn/trade/0acec_1483608192_w_1280_h_852_569209f31100001c00fd83f3.jpg?imageView2/2/w/320/q/90",
                    "url640": "http://img.playalot.cn/trade/0acec_1483608192_w_1280_h_852_569209f31100001c00fd83f3.jpg?imageView2/2/w/640/q/90",
                    "url720": "http://img.playalot.cn/trade/0acec_1483608192_w_1280_h_852_569209f31100001c00fd83f3.jpg?imageView2/2/w/720/q/90",
                    "url1080": "http://img.playalot.cn/trade/0acec_1483608192_w_1280_h_852_569209f31100001c00fd83f3.jpg?imageView2/2/w/1080/q/90",
                    "tags": []
                },
                {
                    "url": "http://img.playalot.cn/trade/9a7d0_1483608192_w_1280_h_958_569209f31100001c00fd83f3.jpg?imageView2/2/w/1280/q/90",
                    "url320": "http://img.playalot.cn/trade/9a7d0_1483608192_w_1280_h_958_569209f31100001c00fd83f3.jpg?imageView2/2/w/320/q/90",
                    "url640": "http://img.playalot.cn/trade/9a7d0_1483608192_w_1280_h_958_569209f31100001c00fd83f3.jpg?imageView2/2/w/640/q/90",
                    "url720": "http://img.playalot.cn/trade/9a7d0_1483608192_w_1280_h_958_569209f31100001c00fd83f3.jpg?imageView2/2/w/720/q/90",
                    "url1080": "http://img.playalot.cn/trade/9a7d0_1483608192_w_1280_h_958_569209f31100001c00fd83f3.jpg?imageView2/2/w/1080/q/90",
                    "tags": []
                },
                {
                    "url": "http://img.playalot.cn/trade/aa716_1483608192_w_1280_h_958_569209f31100001c00fd83f3.jpg?imageView2/2/w/1280/q/90",
                    "url320": "http://img.playalot.cn/trade/aa716_1483608192_w_1280_h_958_569209f31100001c00fd83f3.jpg?imageView2/2/w/320/q/90",
                    "url640": "http://img.playalot.cn/trade/aa716_1483608192_w_1280_h_958_569209f31100001c00fd83f3.jpg?imageView2/2/w/640/q/90",
                    "url720": "http://img.playalot.cn/trade/aa716_1483608192_w_1280_h_958_569209f31100001c00fd83f3.jpg?imageView2/2/w/720/q/90",
                    "url1080": "http://img.playalot.cn/trade/aa716_1483608192_w_1280_h_958_569209f31100001c00fd83f3.jpg?imageView2/2/w/1080/q/90",
                    "tags": []
                },
                {
                    "url": "http://img.playalot.cn/trade/a8c13_1483608192_w_1280_h_958_569209f31100001c00fd83f3.jpg?imageView2/2/w/1280/q/90",
                    "url320": "http://img.playalot.cn/trade/a8c13_1483608192_w_1280_h_958_569209f31100001c00fd83f3.jpg?imageView2/2/w/320/q/90",
                    "url640": "http://img.playalot.cn/trade/a8c13_1483608192_w_1280_h_958_569209f31100001c00fd83f3.jpg?imageView2/2/w/640/q/90",
                    "url720": "http://img.playalot.cn/trade/a8c13_1483608192_w_1280_h_958_569209f31100001c00fd83f3.jpg?imageView2/2/w/720/q/90",
                    "url1080": "http://img.playalot.cn/trade/a8c13_1483608192_w_1280_h_958_569209f31100001c00fd83f3.jpg?imageView2/2/w/1080/q/90",
                    "tags": []
                },
                {
                    "url": "http://img.playalot.cn/trade/bad3b_1483608192_w_1280_h_958_569209f31100001c00fd83f3.jpg?imageView2/2/w/1280/q/90",
                    "url320": "http://img.playalot.cn/trade/bad3b_1483608192_w_1280_h_958_569209f31100001c00fd83f3.jpg?imageView2/2/w/320/q/90",
                    "url640": "http://img.playalot.cn/trade/bad3b_1483608192_w_1280_h_958_569209f31100001c00fd83f3.jpg?imageView2/2/w/640/q/90",
                    "url720": "http://img.playalot.cn/trade/bad3b_1483608192_w_1280_h_958_569209f31100001c00fd83f3.jpg?imageView2/2/w/720/q/90",
                    "url1080": "http://img.playalot.cn/trade/bad3b_1483608192_w_1280_h_958_569209f31100001c00fd83f3.jpg?imageView2/2/w/1080/q/90",
                    "tags": []
                },
                {
                    "url": "http://img.playalot.cn/trade/a44f4_1483608192_w_1280_h_958_569209f31100001c00fd83f3.jpg?imageView2/2/w/1280/q/90",
                    "url320": "http://img.playalot.cn/trade/a44f4_1483608192_w_1280_h_958_569209f31100001c00fd83f3.jpg?imageView2/2/w/320/q/90",
                    "url640": "http://img.playalot.cn/trade/a44f4_1483608192_w_1280_h_958_569209f31100001c00fd83f3.jpg?imageView2/2/w/640/q/90",
                    "url720": "http://img.playalot.cn/trade/a44f4_1483608192_w_1280_h_958_569209f31100001c00fd83f3.jpg?imageView2/2/w/720/q/90",
                    "url1080": "http://img.playalot.cn/trade/a44f4_1483608192_w_1280_h_958_569209f31100001c00fd83f3.jpg?imageView2/2/w/1080/q/90",
                    "tags": []
                }
            ],
            "tags": [],
            "toys": [
                {
                    "id": "57f49fe7010000010034d705",
                    "name": "东亚重工 合成人类 1/12 ...",
                    "image": null
                }
            ],
            "totalLikes": 0,
            "totalComments": 0,
            "caption": "低价大甩卖只要2999，预购速从",
            "comments": [],
            "location": null,
            "city": "110000",
            "created": 1483608227615,
            "status": "open"
        },
        {
            "id": "586d00dd1700004d00520d16",
            "title": "四脚兽",
            "price": {
                "price": 200
            },
            "cls": [],
            "tbUrl": null,
            "type": "buy",
            "user": {
                "id": "569209f31100001c00fd83f3",
                "nickname": "TBXark",
                "avatar": "http://img.playalot.cn/user/avatar/5f29a_1475145763_w_479_h_479_569209f31100001c00fd83f3.jpg?imageView2/2/w/120/q/90",
                "cover": "http://img.playalot.cn/user/cover/6cfba_1482910184_w_694_h_694_569209f31100001c00fd83f3.jpg?imageView2/2/w/1280/q/90",
                "bio": "Little birds can remember",
                "gender": "m",
                "level": 0,
                "approval": "程序狗"
            },
            "photos": [
                {
                    "url": "http://img.playalot.cn/trade/bc77f_1483538650_w_1280_h_720_569209f31100001c00fd83f3.jpg?imageView2/2/w/1280/q/90",
                    "url320": "http://img.playalot.cn/trade/bc77f_1483538650_w_1280_h_720_569209f31100001c00fd83f3.jpg?imageView2/2/w/320/q/90",
                    "url640": "http://img.playalot.cn/trade/bc77f_1483538650_w_1280_h_720_569209f31100001c00fd83f3.jpg?imageView2/2/w/640/q/90",
                    "url720": "http://img.playalot.cn/trade/bc77f_1483538650_w_1280_h_720_569209f31100001c00fd83f3.jpg?imageView2/2/w/720/q/90",
                    "url1080": "http://img.playalot.cn/trade/bc77f_1483538650_w_1280_h_720_569209f31100001c00fd83f3.jpg?imageView2/2/w/1080/q/90",
                    "tags": []
                },
                {
                    "url": "http://img.playalot.cn/trade/ee5a1_1483538650_w_1210_h_1210_569209f31100001c00fd83f3.jpg?imageView2/2/w/1280/q/90",
                    "url320": "http://img.playalot.cn/trade/ee5a1_1483538650_w_1210_h_1210_569209f31100001c00fd83f3.jpg?imageView2/2/w/320/q/90",
                    "url640": "http://img.playalot.cn/trade/ee5a1_1483538650_w_1210_h_1210_569209f31100001c00fd83f3.jpg?imageView2/2/w/640/q/90",
                    "url720": "http://img.playalot.cn/trade/ee5a1_1483538650_w_1210_h_1210_569209f31100001c00fd83f3.jpg?imageView2/2/w/720/q/90",
                    "url1080": "http://img.playalot.cn/trade/ee5a1_1483538650_w_1210_h_1210_569209f31100001c00fd83f3.jpg?imageView2/2/w/1080/q/90",
                    "tags": []
                }
            ],
            "tags": [],
            "toys": [
                {
                    "id": "5697e552010000010029582e",
                    "name": "变形金刚 MasterPiec...",
                    "image": null
                }
            ],
            "totalLikes": 0,
            "totalComments": 0,
            "caption": "变形金刚",
            "comments": [],
            "location": null,
            "city": "110000",
            "created": 1483538653897,
            "status": "open"
        },
        {
            "id": "586c73f41800004a0066f805",
            "title": "Title",
            "price": {
                "price": 100
            },
            "cls": [],
            "tbUrl": null,
            "type": "buy",
            "user": {
                "id": "57a305d21e00000e00e6b945",
                "nickname": "Aa",
                "avatar": "http://img.playalot.cn/user/avatar/9BD5_1481007022_w_980_h_980_57a305d21e00000e00e6b945.jpg?imageView2/2/w/120/q/90",
                "cover": "http://img.playalot.cn/user/cover/2FB1_1481008048_w_980_h_980_57a305d21e00000e00e6b945.jpg?imageView2/2/w/1280/q/90",
                "bio": "我是路人",
                "gender": "f",
                "level": 0,
                "approval": null
            },
            "photos": [
                {
                    "url": "http://img.playalot.cn/trade/58b92_1483502574_w_1280_h_854_57a305d21e00000e00e6b945.jpg?imageView2/2/w/1280/q/90",
                    "url320": "http://img.playalot.cn/trade/58b92_1483502574_w_1280_h_854_57a305d21e00000e00e6b945.jpg?imageView2/2/w/320/q/90",
                    "url640": "http://img.playalot.cn/trade/58b92_1483502574_w_1280_h_854_57a305d21e00000e00e6b945.jpg?imageView2/2/w/640/q/90",
                    "url720": "http://img.playalot.cn/trade/58b92_1483502574_w_1280_h_854_57a305d21e00000e00e6b945.jpg?imageView2/2/w/720/q/90",
                    "url1080": "http://img.playalot.cn/trade/58b92_1483502574_w_1280_h_854_57a305d21e00000e00e6b945.jpg?imageView2/2/w/1080/q/90",
                    "tags": []
                }
            ],
            "tags": [],
            "toys": [],
            "totalLikes": 0,
            "totalComments": 0,
            "caption": "Caption",
            "comments": [],
            "location": null,
            "city": "110000",
            "created": 1483502580909,
            "status": "closed"
        }
    ],
    totalPages:1,
}