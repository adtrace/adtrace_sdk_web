export const SECOND = 1000
export const MINUTE = SECOND * 60
export const HOUR = MINUTE * 60
export const DAY = HOUR * 24
export const REASON_GENERAL = 'general'
export const REASON_GDPR = 'gdpr'
export const HTTP_ERRORS = {
  'TRANSACTION_ERROR': 'XHR transaction failed due to an error',
  'SERVER_MALFORMED_RESPONSE': 'Response from server is malformed',
  'SERVER_INTERNAL_ERROR': 'Internal error occurred on the server',
  'SERVER_CANNOT_PROCESS': 'Server was not able to process the request, probably due to error coming from the client',
  'NO_CONNECTION': 'No internet connectivity',
  'SKIP': 'Skipping slower attempt',
  'MISSING_URL': 'Url is not provided'
}

export const STORAGE_TYPES = {
  NO_STORAGE: 'noStorage',
  INDEXED_DB: 'indexedDB',
  LOCAL_STORAGE: 'localStorage'
}

export const ENDPOINTS = {
  default: {
    endpointName: 'Default',
    app: 'https://app.adtrace.io',
    gdpr: 'https://gdpr.adtrace.io'
  },
  india: {
    endpointName: 'Indian',
    app: 'https://app.adtrace.net.in',
    gdpr: 'https://gdpr.adtrace.net.in'
  },
  china: {
    endpointName: 'Chinese',
    app: 'https://app.adtrace.world',
    gdpr: 'https://gdpr.adtrace.world'
  },
  EU: {
    endpointName: 'EU',
    app: 'https://app.eu.adtrace.io',
    gdpr: 'https://gdpr.eu.adtrace.io'
  },
  TR: {
    endpointName: 'TR',
    app: 'https://app.tr.adtrace.io',
    gdpr: 'https://gdpr.tr.adtrace.io'
  },
  US: {
    endpointName: 'US',
    app: 'https://app.us.adtrace.io',
    gdpr: 'https://gdpr.us.adtrace.io'
  }
}
