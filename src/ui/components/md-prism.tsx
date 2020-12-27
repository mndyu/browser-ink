import * as React from 'react'
import Highlight, {defaultProps, Language} from 'prism-react-renderer'

export default function MdPrism(props: {code: string; language: Language}) {
  return (
    <Highlight {...defaultProps} {...props}>
      {({className, style, tokens, getLineProps, getTokenProps}) => (
        <pre className={className} style={style}>
          {tokens.map((line, i) => (
            <div {...getLineProps({line, key: i})}>
              {line.map((token, key) => (
                <span {...getTokenProps({token, key})} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  )
}
