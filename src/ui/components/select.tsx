import * as React from 'react'

const Select = ({value, options, onChange}) => {
  return (
    <select
      value={value}
      onChange={(e) => {
        onChange(e.target.value)
      }}
    >
      {options.map((v, i) => (
        <option key={i} value={v.value}>
          {v.label}
        </option>
      ))}
    </select>
  )
}

export default Select
