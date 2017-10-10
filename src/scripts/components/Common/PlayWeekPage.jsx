import React, { Component } from 'react'
import Request from 'superagent'

export default class extends Component {
    constructor(props) {
        super(props)

        this.state = {
            images:[null,null,null,null,null,null,null,null,null,null],
            curIndex:0,

            id:'',
            index:'',
            comment:'',

            json:''
        }
        this.addImage = this._addImage.bind(this)
        this.addJson = this._addJson.bind(this)
        this.onClick = (i) => {
            const image = this.state.images[i]
            if(image) {
                this.setState({
                    curIndex:i,
                    id:image.id,
                    index:image.index,
                    comment:image.comment
                })
            }else{
                this.setState({
                    curIndex:i,
                    id:'',
                    index:'',
                    comment:''
                }) 
            }
        }

    }
    _addImage() {
        let { id,index,images,curIndex,comment } = this.state
        if(!id.trim()){
            return
        }
        Request.get(`/api/post/${id}`)
        .end((err,res) => {
            if(!err) {
                const image = {
                    id,
                    index,
                    src:res.body.photos[index || 0]['url'],
                    user:res.body.user,
                    comment
                }

                const flag = images.some((item) => {
                    if(item){
                        return item.user.id === res.body.user.id
                    }else{
                        return false
                    }
                })
                if(flag) {
                    return alert('入围用户重复')
                }

                images[curIndex] = image
                if(curIndex<9){
                    curIndex++
                }
                this.setState({ images,id:'',index:'',comment:'',curIndex })
            }
        })
    }
    _addJson() {
        const { images } = this.state
        const entityMap = {}
        const blocks = []
        let key = 0
        images.map(image => {
            if(image){
                blocks.push({
                    "text": "",
                    "type": "unstyled"
                })
                entityMap[key] = {
                    "type": "image",
                    "mutability": "IMMUTABLE",
                    "data": {
                        "src": image.src.split('?')[0] + '!articlestyle' ,
                        "type": "image"
                    }
                }
                blocks.push({
                    "text": " ",
                    "type": "atomic",
                    "entityRanges": [
                        {
                            "offset": 0,
                            "length": 1,
                            "key": key++
                        }
                    ],
                })
                blocks.push({
                    "text": `by:${image.user.nickname}`,
                    "type": "unordered-list-item",
                    "entityRanges": [
                        {
                            "offset": 3,
                            "length": image.user.nickname.length,
                            "key": key
                        }
                    ],
                })
                entityMap[key++] = {
                    "type": "LINK",
                    "mutability": "IMMUTABLE",
                    "data": {
                        "url": `http://www.playalot.cn/user/${image.user.id}`
                    }
                }
                if(image.comment){
                    blocks.push({
                        "text" : `小编点评 : ${image.comment}` ,
                        "type" : "blockquote"
                    })
                }
            }
        })
        const json = {
            entityMap,
            blocks
        }
        this.setState({
            json:JSON.stringify(json)
        })
    }
    render() {
        const raw = {
            "entityMap": {
                "0": {
                    "type": "image",
                    "mutability": "IMMUTABLE",
                    "data": {
                        "src": "http://img.playalot.cn/article/photo/1503220055_hspcgf7rkv.jpg!articlestyle",
                        "type": "image"
                    }
                },
                "1": {
                    "type": "LINK",
                    "mutability": "IMMUTABLE",
                    "data": {
                        "url": "http://www.playalot.cn/user/56daeda917000010007cb9c7"
                    }
                }
            },
            "blocks": [
                {
                    "key": "2643n",
                    "text": "",
                    "type": "unstyled",
                    "depth": 0,
                    "inlineStyleRanges": [],
                    "entityRanges": [],
                    "data": {}
                },
                {
                    "key": "618o2",
                    "text": " ",
                    "type": "atomic",
                    "depth": 0,
                    "inlineStyleRanges": [],
                    "entityRanges": [
                        {
                            "offset": 0,
                            "length": 1,
                            "key": 0
                        }
                    ],
                    "data": {}
                },
                {
                    "key": "3dbn4",
                    "text": "by:月夜_SJ",
                    "type": "unordered-list-item",
                    "depth": 0,
                    "inlineStyleRanges": [],
                    "entityRanges": [
                        {
                            "offset": 3,
                            "length": 5,
                            "key": 1
                        }
                    ],
                    "data": {}
                }
            ]
        }
        const { curIndex,images } = this.state
        return(
            <div>
                <div className="row">
                    <div className="col-sm-4">
                        {
                            images[curIndex] ? <img style={{width:'100%'}} className="play-img-cover" src={images[curIndex]['src']} alt=""/> : null
                        }
                    </div>
                    <div className="col-sm-8">
                        <div className="row">
                            {
                                images.map((image,i) => {
                                    return (
                                        <div className="col-sm-3 d-flex justify-content-center align-items-center" onClick={() => this.onClick(i)} style={{padding:0,height:100,border:`4px solid ${i == curIndex ? '#0ff':'transparent'}`}} key={`play_week_page-${i}`} >
                                           {
                                               image ? <img style={{width:'100%',height:'100%'}} className="play-img-cover" src={image['src']} alt=""/> : <span>第{i+1}名</span>
                                           }
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                <hr/>
                <div className="row">
                    <div className="col-sm-8">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <input className="form-control" value={this.state.id} placeholder="ID" type="text" onChange={e => this.setState({id:e.target.value})}/>
                            </div>
                            <div className="col-sm-6">
                                <input className="form-control" value={this.state.index} placeholder="INDEX" type="text" onChange={e => this.setState({index:e.target.value})}/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-12">
                                <input className="form-control" value={this.state.comment} placeholder="小编点评" type="text" onChange={e => this.setState({comment:e.target.value})}/>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <button className="btn btn-outline-primary" style={{marginRight:20}} onClick={this.addImage}>添加</button>
                    </div>
                </div>
                <hr/>
                <div className="row">
                    <div className="col-sm-8">
                        <textarea style={{width:'100%',resize:'vertical'}} value={this.state.json} onChange={e => this.setState({json:e.target.value})}  rows="10"></textarea>
                    </div>
                    <div className="col-sm-4">
                        <button className="btn btn-outline-primary" onClick={this.addJson}>生成JSON</button>
                    </div>
                </div>
            </div>
        )
    }
}