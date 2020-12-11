import * as React from 'react'
import * as ReactDOM from 'react-dom'

import {css} from '@linaria/core'

import unified from 'unified'
import markdown from 'remark-parse'

import {Node, Parent} from 'unist'

import '../styles/popup.css'

// Import browser = require("webextension-polyfill");

const enum Tab {
  Export,
  Import
}

const useExportTab = (): [string, number] => {
  const [code, setCode] = React.useState('')
  const [winCount, setWinCount] = React.useState(0)

  React.useEffect(() => {
    chrome.windows.getAll({populate: true}, (windows) => {
      const windowsCode = windows
        .map((window) => {
          const windowCode = `## Window ${window.id.toString()}`
          const tabCode = window.tabs
            .map((tab) => {
              return `- [${tab.title || ''}](${tab.url || ''})`
            })
            .join('\n')
          return `${windowCode}\n${tabCode}`
        })
        .join('\n\n')
      setCode(windowsCode)
      setWinCount(windows.length)
    })
  }, [])

  return [code, winCount]
}

const ExportTab = () => {
  const [code, winCount] = useExportTab()
  return (
    <div>
      {winCount} windows
      <textarea
        value={code}
        // OnChange={(e) => setCode(e.target.value)}
        rows={15}
        cols={50}
      />
    </div>
  )
}

const ImportTab: React.FC = () => {
  const [code, setCode] = React.useState('')
  const importWindows = React.useCallback(() => {
    const tree = unified().use(markdown).parse(code) as Parent
    const lists = tree.children.filter((v) => v.type === 'list') as Parent[]
    const tabsInWindows = lists.map((list) =>
      list.children
        .map((listItem) => listItem.children[0].children[0])
        .map((link) => link.url)
    )
    tabsInWindows.forEach((tabs) => {
      chrome.windows.create({url: tabs})
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

const tabs = {
  [Tab.Export]: <ExportTab />,
  [Tab.Import]: <ImportTab />
}

interface TabButtonProps {
  onClick: (event: React.MouseEvent) => void
}
const TabButton: React.FC<TabButtonProps> = ({children, onClick}) => {
  return (
    <div
      className={css`
        margin-right: 15px;
      `}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

const Popup: React.FC = () => {
  const [tab, setTab] = React.useState(Tab.Export)

  return (
    <div className="popup-padded">
      <div
        className={css`
          display: flex;
        `}
      >
        <TabButton onClick={() => setTab(Tab.Export)}>export</TabButton>
        <TabButton onClick={() => setTab(Tab.Import)}>import</TabButton>
      </div>

      {tabs[tab]}
    </div>
  )
}

// --------------

ReactDOM.render(<Popup />, document.querySelector('#root'))
