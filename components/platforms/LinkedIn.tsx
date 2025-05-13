import React, { Fragment } from "react"
import { useTranslation } from "react-i18next"

import { Input } from "~components/ui/input"

const LinkedIn = () => {
  const { t } = useTranslation()
  return (
    <Fragment>
      <div className="w-full">
        <label className="block text-sm font-medium text-white mb-1">
          {t("linkedinConversionIdLabel")}
        </label>
        <Input
          name="linkedinConversionId"
          placeholder={t("linkedinConversionIdPlaceholder")}
          required
        />
      </div>
    </Fragment>
  )
}

export default LinkedIn
