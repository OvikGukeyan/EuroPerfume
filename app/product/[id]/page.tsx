import React from 'react'

export default function Product ({params: {id}}: {params: {id: string}}) {
  return (
    <div>Product{id}</div>
  )
}
