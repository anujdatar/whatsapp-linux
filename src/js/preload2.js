// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
// only runs after the DOM elements are loaded, can't be loaded before that.
window.addEventListener('DOMContentLoaded', () => {
  // const { Menu, MenuItem, remote, webFrame } = require('electron')
  const electron = require('electron')  
  const remote = electron.remote
  const spellChecker = require('spellchecker')
  const webFrame = electron.webFrame
  const Menu = remote.require('electron').Menu
  const MenuItem = remote.require('electron').MenuItem

  // initialize selection object to avoid auto-garbage-collection
  // let selection = {}
  // function resetSelection() {
  //   selection = {
  //     isMisspelled: false,
  //     spellingSuggestions: []
  //   };
  // }
  // resetSelection();
  // Reset the selection when clicking around
  // window.addEventListener('mousedown', resetSelection);

  

  webFrame.setSpellCheckProvider('en-US', {
    spellCheck (words, callback) {
      setTimeout(() => {
        const misspelled = words.filter(word => spellChecker.isMisspelled(word))
        callback(misspelled)
        console.log(misspelled)
        // for (index in misspelled) {
        //   let misspelledWord = misspelled[index]
        //   options = spellChecker.getCorrectionsForMisspelling(misspelledWord)
        //   if (Object.values(corrections).indexOf(misspelledWord < 0)) {
        //     let newSuggestions = {misspelled: misspelledWord, correct: options}
        //     corrections.push(newSuggestions)
        //   }
        //   console.log(corrections)
        // }
      }, 0)
    }
  })
  const ctxMenu = new Menu()
  ctxMenu.append(new MenuItem({
    label: 'hola',
    click() {
      console.log('clicked hola')
    }
  }))

  window.addEventListener('contextmenu', (e) => {
    console.log('ctxMenu requested')
    e.preventDefault()
    ctxMenu.popup(remote.getCurrentWindow())
  })
})
