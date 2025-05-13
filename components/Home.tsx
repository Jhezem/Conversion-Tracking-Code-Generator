import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import GoogleAds from "./platforms/GoogleAds"
import GoogleTagManager from "./platforms/GoogleTagManager"
import LinkedIn from "./platforms/LinkedIn"
import Meta from "./platforms/Meta"
import TikTok from "./platforms/TikTok"
import CustomSelect from "./ui/CustomSelect"

const EVENTS = [
  "click",
  "submit",
  "change",
  "input",
  "blur",
  "keydown",
  "keypress"
]
const PLATFORMS = [
  "Google Ads",
  "Facebook Pixel",
  "LinkedIn",
  "TikTok",
  "Google Tag Manager"
]

const Home = () => {
  const [selectedEvent, setSelectedEvent] = useState<string>("click")
  const [selectedPlatform, setSelectedPlatform] = useState<string>("Google Ads")
  const [customParams, setCustomParams] = useState([{ key: "", value: "" }])
  const [locale, setLocale] = useState(localStorage.getItem("language") ?? "en")

  const { t, i18n } = useTranslation()

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang)
    setLocale(lang)
    localStorage.setItem("language", lang)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const config: Record<string, any> = {
      event: selectedEvent,
      platform: selectedPlatform,
      params: {}
    }

    for (const [key, value] of formData.entries()) {
      config.params[key] = value
    }

    config.params["customParams"] = customParams.filter((p) => p.key && p.value)

    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true
    })

    if (tab.id) {
      chrome.tabs.sendMessage(tab.id, {
        type: "START_PICKER",
        ...config,
        locale
      })
    }

    window.close()
  }

  useEffect(() => {
    const savedLang = localStorage.getItem("language")
    if (savedLang) {
      i18n.changeLanguage(savedLang)
    }
  }, [])

  return (
    <form
      onSubmit={handleSubmit}
      className="relative min-w-[500px] min-h-[500px] bg-[#121212] text-[#f7eedc] rounded-lg shadow-lg p-6 space-y-6 text-base">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-[#333] pb-4">
        <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
        <select
          value={locale}
          onChange={(e) => changeLanguage(e.target.value)}
          className="bg-[#1a1a1a] text-[#f7eedc] border-[1px] border-gold px-2 py-1 rounded text-sm ">
          <option value="en">🇺🇸 EN</option>
          <option value="es">🇪🇸 ES</option>
        </select>
      </div>

      {/* Main Fields */}
      <div className="grid grid-cols-2 gap-4">
        {/* Event */}
        <div className="w-full">
          <label className="block text-sm mb-1">{t("eventToTrack")}</label>
          <CustomSelect
            options={EVENTS}
            placeholder="Select Event"
            onChange={setSelectedEvent}
            value={selectedEvent}
          />
        </div>

        {/* Platform */}
        <div className="w-full">
          <label className="block text-sm mb-1">
            {t("conversionPlatform")}
          </label>
          <CustomSelect
            options={PLATFORMS}
            value={selectedPlatform}
            onChange={(value) => {
              setSelectedPlatform(value)
              setCustomParams([])
            }}
            placeholder="Select platform"
          />
        </div>
      </div>

      {/* Platform-specific options */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedPlatform}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="space-y-6">
          {selectedPlatform === "Google Ads" && <GoogleAds />}
          {selectedPlatform === "Google Tag Manager" && (
            <GoogleTagManager
              customParams={customParams}
              setCustomParams={setCustomParams}
            />
          )}
          {selectedPlatform === "LinkedIn" && <LinkedIn />}
          {selectedPlatform === "Facebook Pixel" && (
            <Meta
              customParams={customParams}
              setCustomParams={setCustomParams}
            />
          )}
          {selectedPlatform === "TikTok" && (
            <TikTok
              customParams={customParams}
              setCustomParams={setCustomParams}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Toggles */}
      <div className="grid grid-cols-2 gap-4">
        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            id="dynamicEl"
            name="dynamicEl"
            className="border-[1px] border-gold"
          />
          {t("trackDynamicElement")}
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            id="useJquery"
            name="useJquery"
            className="border-[1px] border-gold"
          />
          {t("useJquery")}
        </label>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-[#d4af37] text-[#121212] hover:bg-[#ffd700] transition font-semibold mt-2">
        {t("pickElement")}
      </Button>

      <a
        href="https://paypal.me/jairopy"
        target="_blank"
        rel="noopener noreferrer"
        className="block text-center text-primary text-xs underline hover:text-accent mt-4">
        {t("supportMe")}
      </a>
    </form>
  )
}

export default Home
