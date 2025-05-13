import cssText from "data-text:~style.css"
import { Fragment, useEffect, useState } from "react"

import Overlay from "~components/overlay"
import type { PlasmoCSConfig } from "~node_modules/plasmo/dist/type"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  run_at: "document_idle"
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

let lastHovered: HTMLElement | null = null

const highlight = (el: HTMLElement) => {
  if (lastHovered) lastHovered.style.outline = ""
  el.style.outline = "2px solid red"
  lastHovered = el
}

const onMouseOver = (e: MouseEvent) => {
  highlight(e.target as HTMLElement)
}

export default function ShowOverlay() {
  const [open, setOpen] = useState(false)
  const [selectedSelector, setSelectedSelector] = useState({ el: "" })
  const [selectedEvent, setSelectedEvent] = useState<string>("click")
  const [selectedPlatform, setSelectedPlatform] = useState<string>("Google Ads")
  const [selectedParams, setSelectedParams] = useState({})
  const [locale, setLocale] = useState("en")

  const onClick = async (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const target = e.target as HTMLElement
    cleanup()

    const selector = generateUniqueSelector(target)

    setSelectedSelector(selector)
    setOpen(true)
  }

  const cleanup = () => {
    if (lastHovered) lastHovered.style.outline = ""
    document.removeEventListener("mouseover", onMouseOver, true)
    document.removeEventListener("click", onClick, true)
    document.body.style.cursor = ""
  }

  useEffect(() => {
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.type === "START_PICKER") {
        // save the platform and event in local state
        setSelectedEvent(msg.event)
        setSelectedPlatform(msg.platform)
        setSelectedParams(msg)

        // start the listeners
        document.addEventListener("mouseover", onMouseOver, true)
        document.addEventListener("click", onClick, true)
        document.body.style.cursor = "crosshair"
        return
      }
    })
  }, [])

  if (!open) return <Fragment></Fragment>

  return (
    <Overlay
      event={selectedEvent}
      platform={selectedPlatform}
      selector={selectedSelector}
      params={selectedParams}
      setOpen={setOpen}
    />
  )
}

function escapeClassName(className: string): string {
  return className.replace(/([!\"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~])/g, "\\$1")
}

const generateUniqueSelector = (el: HTMLElement) => {
  if (el.id)
    return {
      el: `#${el.id}`
    }

  const tag = el.tagName.toLowerCase()
  const classSelector = el.className
    .trim()
    .split(/\s+/)
    .map((cls) => cls && `.${escapeClassName(cls)}`)
    .join("")

  const baseSelector = `${tag}${classSelector}`

  const matches = document.querySelectorAll(baseSelector)
  const index = Array.from(matches).indexOf(el)

  if (matches.length <= 1) return { el: baseSelector }

  return {
    el: baseSelector,
    index
  }
}
