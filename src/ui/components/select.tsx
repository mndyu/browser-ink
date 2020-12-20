import * as React from 'react'

const Select = ({value, options, onChange}) => {
  return (
    <select
      value={value}
      onChange={(e) => {
        onChange(e.target.value)
      }}
    >
      {options.map((v) => (
        <option value={v.value} selected={value === v.value}>
          {v.label}
        </option>
      ))}
    </select>
  )
}

export default Select
