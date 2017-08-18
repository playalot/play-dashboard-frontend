import Request from 'superagent'


export const uploadFiles = async (files,prefix,uploadUrl = 'http://upload.qiniu.com/') => {
    const uptoken = await Request.get('/api/uptoken').then(res => res.body.uptoken)

    const promises = files.map((file) => {
        const uploadKey = `${prefix}${Math.round(Date.now() / 1000)}_${makeId()}.${file.name.split('.').pop()}`
        return Request
            .post(uploadUrl)
            .field('key', uploadKey)
            .field('token', uptoken)
            .field('x:filename', file.name)
            .field('x:size', file.size)
            .attach('file', file, file.name)
            .set('Accept', 'application/json')
            .then(() => uploadKey)
            .catch(e => e)
    })
    const keys = await Promise.all(promises)

    return keys.filter(key => typeof key == 'string')
}

export const uploadImageWithWH = async (file,prefix,uploadUrl = 'http://upload.qiniu.com/') => {
    const img = new Image()
    img.src = file.preview

    const [uptoken] = await Promise.all([
        Request.get('/api/uptoken').then(res => res.body.uptoken), 
        img.onload
    ])
    const uploadKey = `${prefix}${Math.round(Date.now() / 1000)}_w_${img.width}_h_${img.height}_${makeId()}.${file.name.split('.').pop()}`
    return await Request
    .post(uploadUrl)
    .field('key', uploadKey)
    .field('token', uptoken)
    .field('x:filename', file.name)
    .field('x:size', file.size)
    .attach('file', file, file.name)
    .set('Accept', 'application/json')
    .then(() => uploadKey)
}



export const makeId = () => {
    let text = ''
    const possible = 'abcdefghijklmnopqrstuvwxyz0123456789'
	for( let i=0; i < 10; i++ ) {
		text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
}
