// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

window.addEventListener('DOMContentLoaded', () => {
  console.log('hola from preload')
  console.log(process.versions.node)

  somethingSpan = document.getElementById('something')
  somethingSpan.innerHTML = 'something span from preload'
})
