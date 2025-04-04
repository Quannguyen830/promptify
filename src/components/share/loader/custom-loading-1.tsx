import React from 'react'

export default function CustomLoading1() {
  return (
    <div className="flex flex-row gap-2">
      <div
        style={{
          backgroundImage:
            'conic-gradient(from 0deg, violet, indigo 30%, blue 50%, green 60%, yellow 70%, orange 80%, red 100%)',
        }}
        className="w-10 h-10 rounded-full bg-radial bg-gradient-to-tr animate-spin [animation-delay:.7s]"
      ></div>
    </div>
  )
}
