import React,{ Component } from 'react'
import { connect } from 'react-redux'

import { closeBaichuan } from '../../actions/adminAction'

class PlayAliBaichuan2 extends Component {
    constructor(props) {
        super(props)
        this.state = {
            msgs:[],
            text:''
        }
        this.onChange = (e) => {
            this.setState({text:e.target.value})
        }
        this.send = () => {
            const { touid } = this.props.baichuan
            const { text,msgs } = this.state
            this.sdk.Chat.sendMsg({
                touid:touid,
                msg: text,
                success: (data) => {
                    msgs.push({
                        from:"ipl652md5691631a160000370003ad5c",
                        msg:text,
                        time:Date.now()
                    })
                    this.setState({msgs})
                },
                error: function(error){
                  console.log('send fail', error);
                }
            });
        }
    }
    componentWillMount() {
        this.sdk = new WSDK()
        this.sdk.Base.login({
            uid:'5691631a160000370003ad5c',
            appkey: '23289048',
            credential: 'NTY5MTYzMWExNjAw',
            timeout: 4000,
            success: function(data){
              // {code: 1000, resultText: 'SUCCESS'}
              console.log('login success', data);
            },
            error: function(error){
              // {code: 1002, resultText: 'TIMEOUT'}
              console.log('login fail', error);
            }
        });
    }
    componentWillReceiveProps(nextProps) {
        let { touid,toAvatar } = nextProps.baichuan
        
        if(touid !== 'none') {
            this.sdk.Chat.getHistory({
                touid,
                count: 20,
                success: (res) =>{
                    this.setState({msgs:res.data.msgs.reverse()})
                },
                error: function(error){
                    console.log('get history msg fail', error);
                }
            })
            this.sdk.Event.on('CHAT.MSG_RECEIVED', (res) =>{
                const { msgs } = this.state
                msgs.push(...res.data.msgs)
                this.setState({msgs})
            })
            this.sdk.Chat.startListenMsg({touid})
        }else{
            // sdk.Event.off('CHAT.MSG_RECEIVED')
            // console.log(sdk)
            // this.sdk.Chat.stopListenMsg()
        }





        

	}
    render() {
        const { display,toAvatar,touid } = this.props.baichuan
        const { msgs } = this.state
        console.info(display)
        return(
            <div id="alibaichuan2" style={{display}} onClick={this.props.closeBaichuan}>
                <div className="alibaichuan-dialog" onClick={e => e.stopPropagation()}>
                    <div className="chat-container">
                        {
                            msgs.map((msg,i) => {
                                if(msg.from.match('5691631a160000370003ad5c')){
                                    return(
                                        <div key={`alibaichuan_msg${i}`} className="chat-box right">
                                            <img className="avatar" src="http://img.playalot.cn/user/avatar/f518_1503303713_w_1080_h_1080_5691631a160000370003ad5c.jpg?imageView2/2/w/120/q/90" alt=""/>
                                            <p>{msg.msg}</p>
                                        </div>
                                    )
                                }else{
                                    return(
                                        <div key={`alibaichuan_msg${i}`} className="chat-box">
                                            <img className="avatar" src={toAvatar} alt=""/>
                                            <p>{msg.msg}</p>
                                        </div>
                                    )
                                }
                            })
                        }
                    </div>
                    <textarea placeholder="在此输入" onKeyDown={e => e.keyCode === 13 && this.send()} onChange={this.onChange} className="chat-input"></textarea>
                </div>
            </div>
        )
    }
}


const mapActionCreators = {
    closeBaichuan
}
const mapStateToProps = (state) => {
    const { baichuan }  = state.admin.toJS()
    return {
        baichuan
    }
}

export default connect(mapStateToProps, mapActionCreators)(PlayAliBaichuan2)