// @flow
export type NavigatorT = Navigator & {
  msDoNotTrack?: any,
  userLanguage?: string
}

export type DocumentT = Document & {
  hidden: boolean,
  mozHidden?: boolean,
  msHidden?: boolean,
  oHidden?: boolean,
  webkitHidden?: boolean
}

export type AttributionMapT = $ReadOnly<{|
  adid: string,
  tracker_token: string,
  tracker_name: string,
  network?: string,
  campaign?: string,
  adgroup?: string,
  creative?: string,
  click_label?: string,
  state: string
|}>

export type AttributionWhiteListT = $ReadOnlyArray<$Keys<AttributionMapT>>

export type ActivityStateMapT = $Shape<{|
  uuid: string,
  push_token: string,
  lastActive: number,
  lastInterval: number,
  timeSpent: number,
  sessionWindow: number,
  sessionLength: number,
  sessionCount: number,
  eventCount: number,
  installed: boolean,
  attribution: AttributionMapT,
  sdkClickSent: boolean,
  attrSent: boolean
|}>

export type CommonRequestParams = {|
  timeSpent: $PropertyType<ActivityStateMapT, 'timeSpent'>,
  sessionLength: $PropertyType<ActivityStateMapT, 'sessionLength'>,
  sessionCount: $PropertyType<ActivityStateMapT, 'sessionCount'>,
  lastInterval: $PropertyType<ActivityStateMapT, 'lastInterval'>,
  eventCount?: $PropertyType<ActivityStateMapT, 'eventCount'>
|}

export type GlobalKeyValueParamsT = {[key: string]: string}

export type EventRequestParamsT = {|
  eventToken: string,
  revenue?: string,
  currency?: string,
  callbackParams?: ?GlobalKeyValueParamsT,
  partnerParams?: ?GlobalKeyValueParamsT,
  eventValueParams?: ?{[key: string]: string}
|}

export type SessionRequestParamsT = {|
  callbackParams?: ?GlobalKeyValueParamsT,
  partnerParams?: ?GlobalKeyValueParamsT
|}

export type SdkClickRequestParamsT = {|
  clickTime: string,
  source: string,
  referrer: string
|}

export type WaitT = number

export type UrlT = '/session' | '/attribution' | '/event' | '/gdpr_forget_device' | '/sdk_click' | '/disable_third_party_sharing'

export type MethodT = 'GET' | 'POST' | 'PUT' | 'DELETE'

export type RequestParamsT = $Shape<{|
  createdAt?: string,
  initiatedBy?: 'sdk' | 'backend',
  ...SessionRequestParamsT,
  ...EventRequestParamsT,
  ...SdkClickRequestParamsT,
  ...CommonRequestParams
|}>

export type HttpRequestParamsT = $ReadOnly<{|
  endpoint: string,
  url: UrlT,
  method?: MethodT,
  params: $ReadOnly<{|
    attempts: number,
    ...RequestParamsT
  |}>
|}>

export type HttpSuccessResponseT = $ReadOnly<{|
  status: 'success',
  adid: string,
  timestamp: string,
  continue_in?: number,
  retry_in?: number,
  ask_in?: number,
  tracking_state?: number,
  attribution?: AttributionMapT,
  message?: string
|}>

export type ErrorCodeT =
  'TRANSACTION_ERROR' |
  'SERVER_MALFORMED_RESPONSE' |
  'SERVER_INTERNAL_ERROR' |
  'SERVER_CANNOT_PROCESS' |
  'NO_CONNECTION' |
  'SKIP' |
  'MISSING_URL'

export type HttpErrorResponseT = $ReadOnly<{|
  status: 'error',
  action: 'CONTINUE' | 'RETRY',
  response: {[string]: string} | string,
  message: string,
  code: ErrorCodeT
|}>

export type HttpFinishCbT = () => void

export type HttpRetryCbT = (number) => Promise<HttpSuccessResponseT | HttpErrorResponseT>

export type HttpContinueCbT = (HttpSuccessResponseT | HttpErrorResponseT, HttpFinishCbT, HttpRetryCbT) => mixed

export type AttributionStateT = {|
  state: 'same' | 'changed' | 'unknown'
|}

export type BackOffStrategyT = 'long' | 'short' | 'test'

export type GlobalParamsT = {|
  key: string,
  value: string
|}

export type GlobalParamsMapT = {
  callbackParams: Array<GlobalParamsT>,
  partnerParams: Array<GlobalParamsT>
}

export type EventParamsT = {|
  eventToken: string,
  revenue?: number,
  currency?: string,
  deduplicationId?: string,
  callbackParams?: Array<GlobalParamsT>,
  partnerParams?: Array<GlobalParamsT>,
  eventValueParams?: Array<GlobalParamsT>
|}

export type BaseParamsT = $ReadOnly<$Shape<{
  appToken: string,
  environment: 'production' | 'sandbox',
  defaultTracker: string,
  externalDeviceId: string,
  gps_adid: string,
  oaid: string,
  android_uuid: string,
  fb_id: string,
  fire_adid: string,
  persistent_ios_uuid: string,
  ios_uuid: string,
  idfa: string,
  idfv: string,
  primary_dedupe_token: string,
  push_token: string,
}>>

export type CustomConfigT = $ReadOnly<$Shape<{
  customUrl: string,
  urlStrategy: 'india' | 'china',
  dataResidency: 'EU' | 'TR' | 'US',
  eventDeduplicationListLimit: number,
  namespace: string
}>>

export type LogOptionsT = $ReadOnly<$Shape<{|
  logLevel: 'none' | 'error' | 'warning' | 'info' | 'verbose',
  logOutput: string
|}>>

export type InitOptionsT = $ReadOnly<$Shape<{|
  appToken: $PropertyType<BaseParamsT, 'appToken'>,
  environment: $PropertyType<BaseParamsT, 'environment'>,
  defaultTracker: $PropertyType<BaseParamsT, 'defaultTracker'>,
  externalDeviceId: $PropertyType<BaseParamsT, 'externalDeviceId'>,
  customUrl: $PropertyType<CustomConfigT, 'customUrl'>,
  dataResidency: $PropertyType<CustomConfigT, 'dataResidency'>,
  urlStrategy: $PropertyType<CustomConfigT, 'urlStrategy'>,
  eventDeduplicationListLimit: $PropertyType<CustomConfigT, 'eventDeduplicationListLimit'>,
  namespace: $PropertyType<CustomConfigT, 'namespace'>,
  attributionCallback: (string, Object) => mixed,
  gps_adid: $PropertyType<BaseParamsT, 'gps_adid'>,
  oaid: $PropertyType<BaseParamsT, 'oaid'>,
  android_uuid: $PropertyType<BaseParamsT, 'android_uuid'>,
  fb_id: $PropertyType<BaseParamsT, 'fb_id'>,
  fire_adid: $PropertyType<BaseParamsT, 'fire_adid'>,
  persistent_ios_uuid: $PropertyType<BaseParamsT, 'persistent_ios_uuid'>,
  ios_uuid: $PropertyType<BaseParamsT, 'ios_uuid'>,
  idfa: $PropertyType<BaseParamsT, 'idfa'>,
  idfv: $PropertyType<BaseParamsT, 'idfv'>,
  primary_dedupe_token: $PropertyType<BaseParamsT, 'primary_dedupe_token'>,
  push_token: $PropertyType<BaseParamsT, 'push_token'>,
|}>>

export type BaseParamsListT = $ReadOnlyArray<$Keys<BaseParamsT>>

export type BaseParamsMandatoryListT = $ReadOnlyArray<'appToken' | 'environment'>

export type CustomConfigListT = $ReadOnlyArray<$Keys<CustomConfigT>>

export type CustomErrorT = {|
  name: string,
  message: string,
  interrupted?: boolean
|}

export type CreatedAtT = {|
  createdAt: string
|}

export type SentAtT = {|
  sentAt: string
|}

export type WebUuidT = {|
  webUuid: string
|}

export type TrackEnabledT = {|
  trackingEnabled?: boolean
|}

export type PlatformT = {|
  platform: string
|}

export type LanguageT = {|
  language: string,
  country?: string
|}

export type MachineTypeT = {|
  machineType?: string
|}

export type QueueSizeT = {|
  queueSize: number
|}

export type SmartBannerOptionsT = {|
  webToken: string,
  logLevel: 'none' | 'error' | 'warning' | 'info' | 'verbose',
  dataResidency: 'EU' | 'TR' | 'US',
|}

export type DefaultParamsT = {|
  ...CreatedAtT,
  ...SentAtT,
  ...WebUuidT,
  ...TrackEnabledT,
  ...PlatformT,
  ...LanguageT,
  ...MachineTypeT,
  ...QueueSizeT
|}

