import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {css} from '@linaria/core'

import unified from 'unified'
import markdown from 'remark-parse'
import {Node, Parent} from 'unist'

import * as browser from 'webextension-polyfill'

import Select from '../components/select'

const useWindowAsMarkdown = (windows): [string, number] => {
  const [code, setCode] = React.useState('')
  const [winCount, setWinCount] = React.useState(0)

  React.useEffect(() => {
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
  }, [windows])

  return [code, winCount]
}

const ExportTab = () => {
  const [allWindows, setAllWindows] = React.useState([])
  React.useEffect(() => {
    const run = async () => {
      const windows = await browser.windows.getAll({populate: true})
      setAllWindows(windows)
    }

    void run()
  }, [])

  const options = React.useMemo(
    () =>
      [
        {
          value: 'all',
          label: 'All'
        }
      ].concat(
        allWindows.map((window) => ({
          value: window?.id.toString(),
          label: `Window ${window?.id}`
        }))
      ),
    [allWindows]
  )
  const [selectedWindow, setSelectedWindow] = React.useState('all')
  const handleChange = React.useCallback((selectedOption) => {
    setSelectedWindow(selectedOption)
  }, [])

  const windows = React.useMemo(() => {
    if (selectedWindow === 'all') {
      return allWindows
    }

    return allWindows.filter(
      (window) => window.id.toString() === selectedWindow
    )
  }, [allWindows, selectedWindow])
  const [code, winCount] = useWindowAsMarkdown(windows)

  return (
    <div>
      <div>
        {winCount} windows
        <Select
          value={selectedWindow}
          options={options}
          onChange={handleChange}
        />
      </div>
      <textarea
        value={code}
        // OnChange={(e) => setCode(e.target.value)}
        rows={15}
        cols={50}
      />
    </div>
  )
}

export default ExportTab
