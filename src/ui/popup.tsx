import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {css} from '@linaria/core'

import unified from 'unified'
import markdown from 'remark-parse'
import {Node, Parent} from 'unist'

import * as browser from 'webextension-polyfill'

import '../styles/popup.css'

import WindowExport from './tabs/window_export'
import WindowImport from './tabs/window_import'
import WindowDiff from './tabs/window_diff'
import BookmarkExport from './tabs/bookmark_export'

const enum TabId {
  Export,
  Import,
  Diff,
  BookmarkExport
}

interface Tab {
  id: TabId
  title: string
  element: JSX.Element
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
  const [tab, setTab] = React.useState(TabId.Export)

  const tabs = React.useMemo<Tab[]>(
    () => [
      {
        id: TabId.Export,
        title: 'export',
        element: <WindowExport />
      },
      {
        id: TabId.Import,
        title: 'import',
        element: <WindowImport />
      },
      {
        id: TabId.Diff,
        title: 'diff',
        element: <WindowDiff />
      },
      {
        id: TabId.BookmarkExport,
        title: 'export bookmarks',
        element: <BookmarkExport />
      }
    ],
    []
  )

  return (
    <div className="popup-padded">
      <div
        className={css`
          display: flex;
          margin-bottom: 15px;
        `}
      >
        {tabs.map((t) => (
          <TabButton key={t.id} onClick={() => setTab(t.id)}>
            {t.title}
          </TabButton>
        ))}
      </div>

      {tabs.find((t) => t.id === tab)?.element}
    </div>
  )
}

// --------------

ReactDOM.render(<Popup />, document.querySelector('#root'))
