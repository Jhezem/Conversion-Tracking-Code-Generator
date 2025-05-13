import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { generateTrackingCode } from "~lib/generateTrackingCode"

import { SnippetPreview } from "./SnippetPreview"

import "../i18n/locales/index"

export interface OverlayProps {
  selector: { el: string; index?: number }
  event: string
  platform: string
  params: Record<string, any>
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const Overlay: React.FC<OverlayProps> = ({
  selector,
  event,
  platform,
  setOpen,
  params
}) => {
  const [copied, setCopied] = useState(false)
  const { t, i18n } = useTranslation()
  const code = generateTrackingCode({ selector, event, platform, ...params })
  const { locale } = params

  useEffect(() => {
    i18n.changeLanguage(locale)
  }, [])

  return (
    <div
      className="fixed inset-0 bg-black/30 z-[2147483646] flex items-center justify-center"
      onClick={() => setOpen(false)}>
      <div
        className="relative bg-white p-6 rounded-2xl max-w-[90vw] sm:max-w-[60vw] max-h-[80vh] overflow-auto shadow-lg"
        onClick={(e) => e.stopPropagation()}>
        <button
          className="absolute top-3 right-4 text-2xl leading-none hover:text-gray-600"
          onClick={() => setOpen(false)}
          aria-label="Cerrar">
          &times;
        </button>

        <h2 className="text-xl font-semibold mb-4">{t("snippetGenerated")}</h2>

        <SnippetPreview>{escapeForDisplay(code)}</SnippetPreview>

        <button
          className="mt-4 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          onClick={() => {
            navigator.clipboard
              .writeText(`<script>\n${escapeForDisplay(code)}\n</script>`)
              .then(() => {
                setCopied(true)
                setTimeout(() => setCopied(false), 1500)
              })
          }}>
          {copied ? t("btnCopied") : t("btnCopy")}
        </button>
      </div>
    </div>
  )
}

export default Overlay

function escapeForDisplay(str: string) {
  return str.replace(/\\/g, "\\\\")
}
