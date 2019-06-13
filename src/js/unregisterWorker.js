// unregister any registered service workers
// left over service workers cause browser version errors
// with WhatsApp web in electron or other non-standard browsers
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(
    function(registrations) {
      for(let registration of registrations) {
        registration.unregister()
      }
    }).catch(function(err) {
      console.log('Service Worker registration failed: ', err)
  })
}
