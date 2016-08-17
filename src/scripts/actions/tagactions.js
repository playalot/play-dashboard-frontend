var Reflux = require('reflux');

var TagActions = Reflux.createActions([
    'fetchTags',
    'setTagClassification',
    'removeTagClassification',
    'recommendTag',
    'deleteTag'
]);

module.exports = TagActions;
