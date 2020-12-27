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
  const [currentWindow, setCurrentWindow] = React.useState({})
  React.useEffect(() => {
    const run = async () => {
      const all = await browser.windows.getAll({populate: true})
      const current = await browser.windows.getCurrent({populate: true})
      setAllWindows(all)
      setCurrentWindow(current)
    }

    void run()
  }, [])

  const options = React.useMemo(
    () =>
      [
        {
          value: 'current-window',
          label: 'Current Window'
        },
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
  const [selectedWindowOption, setSelectedWindowOption] = React.useState('all')
  const handleChange = React.useCallback((selectedOption) => {
    setSelectedWindowOption(selectedOption)
  }, [])

  const windows = React.useMemo(() => {
    switch (selectedWindowOption) {
      case 'all':
        return allWindows
      case 'current-window':
        return [currentWindow]
      default:
        return allWindows.filter(
          (window) => window.id.toString() === selectedWindowOption
        )
    }
  }, [allWindows, currentWindow, selectedWindowOption])
  const [code, winCount] = useWindowAsMarkdown(windows)

  return (
    <div>
      <div>
        {winCount} windows
        <Select
          value={selectedWindowOption}
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
