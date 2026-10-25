'use client'

import { useState } from 'react'

export function CopyEmail({ email, label, done }: { email: string; label: string; done: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      className="btn"
      onClick={() => {
        navigator.clipboard?.writeText(email).then(
          () => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2200)
          },
          () => undefined
        )
      }}
    >
      {copied ? done : label}
    </button>
  )
}
