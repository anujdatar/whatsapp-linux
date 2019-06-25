// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
// only runs after the DOM elements are loaded, can't be loaded before that.
window.addEventListener('DOMContentLoaded', () => {
  const electron = require('electron')  
  const remote = electron.remote
  const spellChecker = require('spellchecker')
  const webFrame = electron.webFrame

  const { buildContextMenu, copyContextMenu, pasteContextMenu,
    reloadContextMenu } = remote.require('@anujdatar/electron-context-menu')

  const {noSuggestionsTemplate, suggestionMenuItem, suggestionsTemplate} = require('./helpers')

  // run spell check to underline all misspelled words
  webFrame.setSpellCheckProvider('en-US', {
    spellCheck (words, callback) {
      const misspelled = words.filter(word => spellChecker.isMisspelled(word))
      callback(misspelled)
    }
  })

  // generate context menu
  window.addEventListener('contextmenu', (e) => {
    e.preventDefault()
    
    let ctxMenu
    if (!e.target.closest('textarea, input, [contenteditable="true"]')) {
      // if click in uneditable area
      if (window.getSelection().toString() === '') {
        // if no text selected
        ctxMenu = new reloadContextMenu()
        ctxMenu.popup(remote.getCurrentWindow())
      } else {
        // if text is selected
        ctxMenu = new copyContextMenu()
        ctxMenu.popup(remote.getCurrentWindow())
      }
    } else {
      // if click in editable text area
      if (window.getSelection().toString() === '') {
        // if no text is selected in textarea
        ctxMenu = new pasteContextMenu()
        ctxMenu.popup(remote.getCurrentWindow())
      } else {
        // if text is selected in textarea
        selection = window.getSelection().toString()
        if (!spellChecker.isMisspelled(selection)) {
          // if selected word is spelled correctly
          ctxMenu = new buildContextMenu()
          ctxMenu.popup(remote.getCurrentWindow())
        } else {
          // selected word is misspelled
          let suggestions = spellChecker.getCorrectionsForMisspelling(selection)
          if (suggestions.length === 0) {
            // if no suggestions are found for word in dictionary
            ctxMenu = new buildContextMenu(noSuggestionsTemplate, {})
            ctxMenu.popup(remote.getCurrentWindow())
          } else {
            suggestions = suggestions.slice(0, 3)
            // console.log(suggestions)
            const suggestedItems = suggestions.map((suggestion) => {
              menuItem = new suggestionMenuItem(suggestion)
              return menuItem.item
            })
            const suggestedMenu = new suggestionsTemplate(suggestedItems)

            ctxMenu = new buildContextMenu(suggestedMenu.menu, {})
            ctxMenu.popup(remote.getCurrentWindow())
          }
        }
      }
    }
  })
})
