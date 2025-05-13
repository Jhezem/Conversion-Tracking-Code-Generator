import React, { Fragment } from "react"
import { useTranslation } from "react-i18next"

import { Input } from "~components/ui/input"

const GoogleAds = () => {
  const { t } = useTranslation()
  return (
    <Fragment>
      <div className="w-full">
        <label className="block text-sm font-medium text-white mb-1">
          {t("conversionId")}
        </label>
        <Input name="conversionId" required />
      </div>

      <div className="w-full">
        <label className="block text-sm font-medium text-white mb-1">
          {t("transactionId")}
        </label>
        <Input name="transactionId" />
      </div>
    </Fragment>
  )
}

export default GoogleAds
