var Reflux = require('reflux');

var ThemeActions = Reflux.createActions([
    'fetchThemeList',
    'addTheme',
    'deleteTheme'
]);

module.exports = ThemeActions;
