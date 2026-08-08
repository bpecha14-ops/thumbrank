'use client'
import { useState } from 'react'

export function Accordion({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2">{children}</div>
}

export function AccordionItem({ title, children }: { title: string, children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-gray-800 rounded-lg">
      <button onClick={() => setOpen(!open)} className="w-full text-left p-4 text-white font-medium flex justify-between">
        {title}
        <span>{open ? '−' : '+'}</span>
      </button>
      {open && <div className="px-4 pb-4 text-gray-400">{children}</div>}
    </div>
  )
}