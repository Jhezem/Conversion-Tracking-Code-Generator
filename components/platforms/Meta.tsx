import React, { Fragment, useState } from "react"
import { useTranslation } from "react-i18next"

import { Button } from "~components/ui/button"
import CustomSelect from "~components/ui/CustomSelect"
import { Input } from "~components/ui/input"

const FB_EVENTS = [
  "AddPaymentInfo",
  "AddToCart",
  "AddToWishlist",
  "CompleteRegistration",
  "Contact",
  "CustomizeProduct",
  "Donate",
  "FindLocation",
  "InitiateCheckout",
  "Lead",
  "Purchase",
  "Schedule",
  "Search",
  "StartTrial",
  "SubmitApplication",
  "Subscribe",
  "ViewContent"
]

const Meta = ({ customParams, setCustomParams }) => {
  const [fbEventType, setFbEventType] = useState("track")
  const [fbStandardEvent, setFbStandardEvent] = useState("Lead")

  const { t } = useTranslation()

  return (
    <Fragment>
      <div className="w-full">
        <label className="block text-sm font-medium text-white mb-1">
          {t("fbEventTypeLabel")}
        </label>

        <CustomSelect
          name="fbEventType"
          value={fbEventType}
          onChange={setFbEventType}
          options={[
            { label: t("fbStandardEventLabel"), value: "track" },
            { label: t("fbCustomEventLabel"), value: "trackCustom" }
          ]}
          placeholder="Selecciona un tipo"
        />
      </div>

      {fbEventType === "track" && (
        <Fragment>
          <div className="w-full">
            <label className="block text-sm font-medium text-white mb-1">
              {t("fbEventName")}
            </label>

            <CustomSelect
              name="fbStandardEvent"
              options={FB_EVENTS}
              value={fbStandardEvent}
              onChange={setFbStandardEvent}
              placeholder="Evento estándar"
            />
          </div>

          {["Purchase", "StartTrial", "Subscribe"].includes(
            fbStandardEvent
          ) && (
            <Fragment>
              <div className="w-full">
                <label className="block text-sm font-medium text-white mb-1">
                  {t("fbValueLabel")}
                </label>
                <Input name="value" placeholder="0.00" />
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-white mb-1">
                  {t("fbCurrencyLabel")}
                </label>
                <Input name="currency" placeholder="USD" />
              </div>

              {["StartTrial", "Subscribe"].includes(fbStandardEvent) && (
                <div className="w-full">
                  <label className="block text-sm font-medium text-white mb-1">
                    {t("fbPredictedLtvLabel")}
                  </label>
                  <Input name="predicted_ltv" placeholder="0.00" />
                </div>
              )}
            </Fragment>
          )}
        </Fragment>
      )}

      {fbEventType === "trackCustom" && (
        <Fragment>
          <div className="w-full">
            <label className="block text-sm font-medium text-white mb-1">
              {t("fbEventName")}
            </label>
            <Input name="fbCustomEvent" required />
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

export default Meta
