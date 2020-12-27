import * as browser from 'webextension-polyfill'

declare let navigator: any

console.log('Background loaded')

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background got a message!:', message)
  console.log('sender:', sender)
  sendResponse({})
})
