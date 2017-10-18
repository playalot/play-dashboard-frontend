import Moment from 'moment'
import { parse } from 'qs'

Moment.locale('zh-cn')


export const dateFormat = (time) => {
    return Moment(time).format("MMM Do, H:mm A")
}

export const dateFromNow = (time) => {
    return Moment(time).fromNow() 
}

export const parsePage = (str) => {
    const page = parse(str.substr(1)).page
    if(page){
        return parseInt(page)
    }else{
        return 0
    }
}
