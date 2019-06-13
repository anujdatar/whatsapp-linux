// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  // const contentDiv = document.getElementById('something')
  // contentDiv.innerHTML = 'test html text'
  navigator.serviceWorker.getRegistrations().then(
    function(registrations) {
      for (let registration in registrations) {
        registration.unregister()
      }
    }).catch(function(err) {
      console.log('unregister failed: ', err)
    })
})
