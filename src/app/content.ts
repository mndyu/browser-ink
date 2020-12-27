import * as browser from 'webextension-polyfill'

declare let navigator: any

console.log('content loaded')

const run = async () => {
  const response = browser.runtime.sendMessage({})
  const checkReady = setInterval(() => {
    if (document.readyState === 'complete') {
      clearInterval(checkReady)
      console.log("We're in the injected content script!")
    }
  })
}

run()
