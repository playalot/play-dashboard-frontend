import { parse } from 'qs'

export default (str) => {
    if(str === ''){
        return {}
    }else {
        return parse(str.substr(1))
    }
}

export const parsePage = (str) => {
    const page = parse(str.substr(1)).page
    if(page){
        return parseInt(page)
    }else{
        return 0
    }
}
