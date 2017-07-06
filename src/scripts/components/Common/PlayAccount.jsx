import React,{ Component } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import PropTypes from 'prop-types'

export default class PlayAccount extends Component {
    render() {
        const { accounts } = this.props
        return(
            <span>
				{
					accounts.map( acc => {
						if (acc.providerID === "weibo") {
							return <a key={acc.providerKey} href={`http://weibo.com/${acc.providerKey}`} style={{color:'#E71D34', marginRight: '5px'}}><i className="fa fa-weibo fa-lg"></i></a>
						} else if (acc.providerID === "mobile") {
                            return (
                                <CopyToClipboard key={acc.providerKey} text={acc.providerKey} onCopy={() => console.log('已复制手机号')}>
                                    <a style={{color:'#55acee', marginRight: '5px'}}><i className="fa fa-mobile-phone fa-lg"></i></a>
                                </CopyToClipboard>
                            )
						} else if (acc.providerID === 'qq') {
							return <a key={acc.providerKey} style={{color:'rgb(21,167,240)', marginRight: '5px'}}><i className="fa fa-qq fa-lg"></i></a>
						} else if (acc.providerID === 'wechat') {
							return <a key={acc.providerKey} style={{color:'rgb(73,190,56)', marginRight: '5px'}}><i className="fa fa-wechat fa-lg"></i></a>
						}
				    })
				}
			</span>
        )
    }
}

PlayAccount.propTypes = {
    accounts:PropTypes.array.isRequired
}