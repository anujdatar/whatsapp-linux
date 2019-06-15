var webFrame = require('electron').webFrame;
var SpellCheckProvider = require('electron-spell-check-provider');

webFrame.setSpellCheckProvider('en-US', new SpellCheckProvider('en-US'));

console.log('hello from index')
