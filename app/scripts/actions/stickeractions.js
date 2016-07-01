var Reflux = require('reflux');

var StickerActions = Reflux.createActions([
    'fetchStickers',
    'addStickerSet',
    'removeStickerSet',
    'updateCollection',
    'deleteSticker',
    'riseSticker',
    'riseStickerSet'
]);

module.exports = StickerActions;
