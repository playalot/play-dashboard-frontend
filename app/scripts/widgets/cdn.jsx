import $ from 'jquery';

class CDN {
  constructor() {
    this.isDev = true;
    $.get('/api/mode', function(data){
      this.isDev = data.isDev;
    }.bind(this));
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

let _cdn = new CDN();

export default _cdn;
