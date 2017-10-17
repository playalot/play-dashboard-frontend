import Moment from 'moment'


Moment.locale('zh-cn')


export const dateFormat = (time) => {
    return Moment(time).format("D MMM, H:mm A")
}

export const dateFromNow = (time) => {
    return Moment(time).fromNow() 
}