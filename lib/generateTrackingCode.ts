interface GenerateTrackingCodePayload {
  selector: { el: string; index?: number }
  event: string
  platform: string
  [key: string]: any
}

export const generateTrackingCode = (
  config: GenerateTrackingCodePayload
): string => {
  const { selector, event, platform } = config

  const {
    conversionId,
    transactionId,
    fbEventType,
    fbStandardEvent,
    fbCustomEvent,
    ttEventType,
    ttStandardEvent,
    ttCustomEvent,
    gtmEventName,
    linkedinConversionId,
    customParams = [],
    useJquery: jqueryCheckbox,
    dynamicEl: dynamicElCheckbox
  } = config.params

  const paramsObj = customParams.reduce(
    (
      acc: Record<string, string>,
      { key, value }: { key: string; value: string }
    ) => {
      acc[key] = value
      return acc
    },
    {}
  )

  const useJquery = jqueryCheckbox === "on"
  const dynamicEl = dynamicElCheckbox === "on"

  let trackingCode = ""

  switch (platform) {
    case "Google Ads":
      trackingCode = `gtag('event', '${event}', { send_to: 'AW-${conversionId}'${
        transactionId ? ", transaction_id: '" + transactionId + "'" : ""
      } });`
      break

    case "Facebook Pixel":
      if (fbEventType === "track") {
        const valueParams: Record<string, any> = {}
        const { value, currency, predicted_ltv } = config.params

        if (value) valueParams.value = value
        if (currency) valueParams.currency = currency
        if (predicted_ltv) valueParams.predicted_ltv = predicted_ltv

        trackingCode = `fbq('track', '${fbStandardEvent}'${
          Object.keys(valueParams).length
            ? ", " + JSON.stringify(valueParams)
            : ""
        });`
      } else {
        trackingCode = `fbq('trackCustom', '${fbCustomEvent}'${
          customParams.length ? ", " + JSON.stringify(paramsObj) : ""
        });`
      }
      break

    case "LinkedIn":
      trackingCode = `lintrk('track', { conversion_id: '${linkedinConversionId}' });`
      break

    case "TikTok":
      if (ttEventType === "standard") {
        trackingCode = `ttq.track('${ttStandardEvent || event}'${
          customParams.length ? ", " + JSON.stringify(paramsObj) : ""
        });`
      } else {
        trackingCode = `ttq.track('${ttCustomEvent}'${
          customParams.length ? ", " + JSON.stringify(paramsObj) : ""
        });`
      }
      break

    case "Google Tag Manager":
      trackingCode = `window.dataLayer.push({ event: '${gtmEventName || event}'${
        customParams.length
          ? ", " +
            Object.entries(paramsObj)
              .map(([k, v]) => `${k}: '${v}'`)
              .join(", ")
          : ""
      } });`
      break

    default:
      trackingCode = ""
      break
  }

  if (useJquery) {
    if (dynamicEl) {
      if (selector.index !== undefined) {
        return `$(document).on("${event}", "${selector.el}", function(e){
        const index = $("${selector.el}").index(this)
        
        if(index === ${selector.index}) {
          ${trackingCode}
        }
        })`
      }
      return `$(document).on("${event}", "${selector.el}", function(e){
      ${trackingCode}
      })`
    }
    if (selector.index !== undefined) {
      return `$("${selector.el}")[${selector.index}].${event}(function(e) { ${trackingCode} });`
    }
    return `$("${selector.el}").${event}(function(e) { ${trackingCode} });`
  }

  if (dynamicEl) {
    if (selector.index) {
      return `document.addEventListener("${event}", function(event){
        if (event.target.matches("${selector.el}")) {
          const elements = document.querySelectorAll("${selector.el}");
          const index = Array.from(elements).indexOf(event.target);
          if (index === ${selector.index}) {
            ${trackingCode}
          }
        }
      });`
    }
    return `document.addEventListener("${event}", function(event){
      if(event.target.matches("${selector.el}")){
        ${trackingCode}
      }
    })`
  }

  if (selector.index !== undefined) {
    return `document.querySelectorAll("${selector.el}")[${selector.index}].addEventListener("${event}", function(e) {
    ${trackingCode}
    });`
  }

  return `document.querySelector("${selector.el}").addEventListener("${event}", function(e) {
    ${trackingCode}
    });`
}
