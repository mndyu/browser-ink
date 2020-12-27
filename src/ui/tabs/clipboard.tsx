import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {css} from '@linaria/core'

import unified from 'unified'
import parse from 'rehype-parse'
import rehype2remark from 'rehype-remark'
import gfm from 'remark-gfm'
import stringify from 'remark-stringify'
import {Node, Parent} from 'unist'

import * as browser from 'webextension-polyfill'

const processor = unified()
  .use(parse)
  .use(rehype2remark)
  .use(gfm)
  .use(stringify)

const Clipboard = () => {
  const [text, setText] = React.useState('')
  const [md, setMd] = React.useState('')

  return (
    <div>
      <textarea
        className={css`
          width: 100%;
        `}
        value={text}
        placeholder="Paste here"
        onChange={(event) => {
          setText(event.target.value)
        }}
        onPaste={(event) => {
          const paste = event.clipboardData.getData('text/html')
          const markdown = processor.processSync(paste).contents as string
          setMd(markdown)
        }}
      />
      <textarea
        className={css`
          width: 100%;
        `}
        value={md}
        onChange={(event) => {
          setMd(event.target.value)
        }}
      />
    </div>
  )
}

export default Clipboard
