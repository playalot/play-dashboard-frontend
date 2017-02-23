class CDN {
  constructor() {
    this.isDev = true;
    $.get('/api/mode', (data) => {
      this.isDev = data.isDev;
    })
  }

  show(img) {
    if (img.startsWith('http')) {
      return img;
    } else {
      if (this.isDev) {
        return 'http://7xiuyp.com1.z0.glb.clouddn.com/' + img;
      } else {
        return 'http://img.playalot.cn/' + img;
      }
    }
  }
}


export default new CDN()
