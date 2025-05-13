import React, { type ReactNode } from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism"

export const SnippetPreview: React.FC<{
  children: ReactNode
}> = ({ children }) => {
  const wrappedCode = `<script>\n${children}\n</script>`
  return (
    <SyntaxHighlighter
      language="javascript"
      style={dracula}
      customStyle={{ borderRadius: 8, fontSize: 14 }}>
      {wrappedCode}
    </SyntaxHighlighter>
  )
}
