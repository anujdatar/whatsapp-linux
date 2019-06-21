// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
// only runs after the DOM elements are loaded, can't be loaded before that.
window.addEventListener('DOMContentLoaded', () => {
  const electron = require('electron')  
  const remote = electron.remote
  const spellChecker = require('spellchecker')
  const webFrame = electron.webFrame

  const ctxMenuBuilder = remote.require('@anujdatar/electron-context-menu')

  // initialize selection object to avoid auto-garbage-collection
  let selection = {}
  function resetSelection() {
    selection = {
      isMisspelled: false,
      spellingSuggestions: []
    };
  }
  resetSelection();
  // Reset the selection when clicking around
  window.addEventListener('mousedown', resetSelection);

  

  webFrame.setSpellCheckProvider('en-US', {
    spellCheck (words, callback) {
      const misspelled = words.filter(word => spellChecker.isMisspelled(word))
      callback(misspelled)
      console.log(misspelled)
    }
  })

  prefixMenu = {
    exists: true,
    menuItems: [
      {
        label: 'prefix1',
        click: function() {
          console.log('prefix 1 clicked')
        }
      }
    ]
  }

  suffixMenu = {
    exists: true,
    menuItems: [
      {
        label: 'suffix1',
        click: function() {
          console.log('suffix 1 clicked')
        }
      },
      {
        label: 'suffix2',
        click: function() {
          console.log('suffix 2 clicked')
        }
      }
    ]
  }

  window.addEventListener('contextmenu', function(e) {
    let ctxMenu
    if (!e.target.closest('textarea, input, [contenteditable="true"]')) {
      ctxMenu = new ctxMenuBuilder()
    } else {
      ctxMenu = new ctxMenuBuilder(prefixMenu, suffixMenu, '')
    }
    ctxMenu.popup(remote.getCurrentWindow())
  })

  // window.addEventListener('contextmenu', (e) => {
  //   console.log('ctxMenu requested')
  //   e.preventDefault()
  //   ctxMenu.popup(remote.getCurrentWindow())
  //   if (window.getSelection()) {
  //     const a = window.getSelection().toString()
  //     if (spellChecker.isMisspelled(a)) {
  //       const corrections = spellChecker.getCorrectionsForMisspelling(a)
  //       console.log(corrections)
  //     }
  //   }


    // if (params.misspelledWord) {
    //   console.log('aaaaaaaaaa')
    // }
  // })
})
