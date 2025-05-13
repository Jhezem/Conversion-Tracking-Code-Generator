import React, { Fragment, useState } from "react"
import { useTranslation } from "react-i18next"

import { Button } from "~components/ui/button"
import CustomSelect from "~components/ui/CustomSelect"
import { Input } from "~components/ui/input"

const TIKTOK_EVENTS = [
  "AddPaymentInfo",
  "AddToCart",
  "AddToWishlist",
  "CompletePayment",
  "CompleteRegistration",
  "Contact",
  "Download",
  "InitiateCheckout",
  "PlaceOrder",
  "Search",
  "SubmitForm",
  "Subscribe",
  "ViewContent"
].map((event) => ({ label: event, value: event }))

const EVENTS_WITH_PARAMETERS = [
  "AddToCart",
  "CompletePayment",
  "PlaceOrder",
  "ViewContent"
]

const TikTok = ({ customParams, setCustomParams }) => {
  const [ttEventType, setTtEventType] = useState("standard")
  const [selectedEvent, setSelectedEvent] = useState("Contact")

  const { t } = useTranslation()

  const showExtraFields = EVENTS_WITH_PARAMETERS.includes(selectedEvent)

  const handleParamChange = (key: string, value: string) => {
    const updated = [...customParams]
    const existingIndex = updated.findIndex((param) => param.key === key)

    if (existingIndex !== -1) {
      updated[existingIndex].value = value
    } else {
      updated.push({ key, value })
    }

    setCustomParams(updated)
  }

  return (
    <Fragment>
      <div className="w-full">
        <label className="block text-sm font-medium text-white mb-1">
          {t("ttEventTypeLabel")}
        </label>

        <CustomSelect
          name="ttEventType"
          value={ttEventType}
          onChange={setTtEventType}
          placeholder={t("ttEventTypeLabel")}
          options={[
            { value: "standard", label: t("ttStandardOption") },
            { value: "custom", label: t("ttCustomOption") }
          ]}
        />
      </div>

      {ttEventType === "standard" && (
        <Fragment>
          <div className="w-full">
            <label className="block text-sm font-medium text-white mb-1">
              {t("ttEventNameLabel")}
            </label>

            <CustomSelect
              value={selectedEvent}
              onChange={(val) => {
                setSelectedEvent(val)
                setCustomParams([])
              }}
              placeholder="Evento estándar"
              options={TIKTOK_EVENTS}
            />
          </div>

          {showExtraFields && (
            <Fragment>
              <div className="w-full">
                <label className="block text-sm font-medium text-white mb-1">
                  {t("ttContentTypeLabel")}
                </label>
                <Input
                  name="content_type"
                  onChange={(e) =>
                    handleParamChange("content_type", e.target.value)
                  }
                />
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-white mb-1">
                  {t("ttQuantityLabel")}
                </label>
                <Input
                  name="quantity"
                  placeholder="0.0"
                  onChange={(e) =>
                    handleParamChange("quantity", e.target.value)
                  }
                />
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-white mb-1">
                  {t("ttDescriptionLabel")}
                </label>
                <Input
                  name="description"
                  onChange={(e) =>
                    handleParamChange("description", e.target.value)
                  }
                />
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-white mb-1">
                  {t("ttContentIdsLabel")}
                </label>
                <Input
                  name="content_ids"
                  onChange={(e) =>
                    handleParamChange("content_ids", e.target.value)
                  }
                />
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-white mb-1">
                  {t("ttCurrencyLabel")}
                </label>
                <Input
                  name="currency"
                  onChange={(e) =>
                    handleParamChange("currency", e.target.value)
                  }
                />
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-white mb-1">
                  {t("ttValueLabel")}
                </label>
                <Input
                  name="value"
                  placeholder="0.0"
                  onChange={(e) => handleParamChange("value", e.target.value)}
                />
              </div>
            </Fragment>
          )}

          {selectedEvent === "Search" && (
            <div className="w-full">
              <label className="block text-sm font-medium text-white mb-1">
                {t("ttQueryLabel")}
              </label>
              <Input
                className="mt-3"
                name="query"
                onChange={(e) => handleParamChange("query", e.target.value)}
              />
            </div>
          )}
        </Fragment>
      )}

      {ttEventType === "custom" && (
        <Fragment>
          <div className="w-full">
            <label className="block text-sm font-medium text-white mb-1">
              {t("ttCustomEventNameLabel")}
            </label>
            <Input name="ttCustomEvent" required />
          </div>

          <label className="block text-sm font-medium text-white mb-1">
            {t("customParamsLabel")}
          </label>

          {customParams.map((param, index) => (
            <div key={index} className="flex w-full gap-2 col-span-2">
              <Input
                placeholder={t("keyPlaceholder")}
                value={param.key}
                onChange={(e) => {
                  const updated = [...customParams]
                  updated[index].key = e.target.value
                  setCustomParams(updated)
                }}
                required
              />
              <Input
                placeholder={t("valuePlaceholder")}
                value={param.value}
                onChange={(e) => {
                  const updated = [...customParams]
                  updated[index].value = e.target.value
                  setCustomParams(updated)
                }}
                required
              />
              <Button
                variant="ghost"
                onClick={() => {
                  const updated = [...customParams]
                  updated.splice(index, 1)
                  setCustomParams(updated)
                }}>
                ❌
              </Button>
            </div>
          ))}

          <Button
            variant="outline"
            type="button"
            className="bg-primary"
            onClick={() =>
              setCustomParams((prev) => [...prev, { key: "", value: "" }])
            }>
            {t("addParamButton")}
          </Button>
        </Fragment>
      )}
    </Fragment>
  )
}

export default TikTok
