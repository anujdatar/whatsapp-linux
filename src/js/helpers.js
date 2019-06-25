const remote = require('electron').remote

class suggestionMenuItem {
  constructor(correction) {
    this.item = {
      label: correction,
      click: function () {
        remote.getCurrentWebContents().replaceMisspelling(correction)
      }
    }
  }
}

class suggestionsTemplate {
  constructor(list) {
    this.menu = {
      exists: true,
      menuItems: list
    }
  }
}

const noSuggestionsTemplate = {
  exists: true,
  menuItems: [
    {
      label: 'No Suggestions',
      enabled: false
    }
  ]
}

module.exports = {
  suggestionMenuItem,
  suggestionsTemplate,
  noSuggestionsTemplate
}