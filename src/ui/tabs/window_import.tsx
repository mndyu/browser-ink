import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {css} from '@linaria/core'

import unified from 'unified'
import markdown from 'remark-parse'
import {Node, Parent} from 'unist'

import * as browser from 'webextension-polyfill'

const ImportTab: React.FC = () => {
  const [code, setCode] = React.useState('')
  const importWindows = React.useCallback(() => {
    const tree = unified().use(markdown).parse(code) as Parent
    const lists = tree.children.filter((v) => v.type === 'list') as Parent[]
    const tabsInWindows = lists.map((list) =>
      list.children.map((listItem: Parent) => {
        const paragraph = listItem.children[0] as Parent
        const link = paragraph.children[0]
        return link.url as string
      })
    )
    tabsInWindows.forEach((tabs) => {
      browser.windows.create({url: tabs})
    })
  }, [code])

  return (
    <div>
      <button
        onClick={() => {
          importWindows()
        }}
      >
        open
      </button>
      <textarea
        value={code}
        rows={15}
        cols={50}
        onChange={(event) => setCode(event.target.value)}
      />
    </div>
  )
}

export default ImportTab
