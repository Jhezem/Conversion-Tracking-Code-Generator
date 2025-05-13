import React, { Fragment } from "react"
import { useTranslation } from "react-i18next"

import { Button } from "~components/ui/button"
import { Input } from "~components/ui/input"

const GoogleTagManager = ({ customParams, setCustomParams }) => {
  const { t } = useTranslation()
  return (
    <Fragment>
      <div className="w-full space-y-4 col-span-2">
        <label className="block text-sm font-medium text-white mb-1">
          {t("gtmEventNameLabel")}
        </label>
        <Input name="gtmEventName" required />

        <label className="block text-sm font-medium text-white mb-1">
          {t("customParamsLabel")}
        </label>

        {customParams.map((param, index) => (
          <div key={index} className="flex w-full gap-2">
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
      </div>
    </Fragment>
  )
}

export default GoogleTagManager
