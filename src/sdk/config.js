// @flow
import {
  type BaseParamsT,
  type CustomConfigT,
  type InitOptionsT,
  type BaseParamsListT,
  type BaseParamsMandatoryListT,
  type CustomConfigListT
} from './types'
import {MINUTE, SECOND, DAY} from './constants'
import {buildList, reducer} from './utilities'
import Logger from './logger'

/**
 * Base parameters set by client
 * - app token
 * - environment
 * - default tracker
 * - external device ID
 *
 * @type {Object}
 * @private
 */
let _baseParams: BaseParamsT = {}

/**
 * Custom config set by client
 * - url override
 * - event deduplication list limit
 *
 * @type {Object}
 * @private
 */
let _customConfig: CustomConfigT = {}

/**
 * Mandatory fields to set for sdk initialization
 *
 * @type {string[]}
 * @private
 */
const _mandatory: BaseParamsMandatoryListT = [
  'appToken',
  'environment'
]

/**
 * Allowed params to be sent with each request
 *
 * @type {string[]}
 * @private
 */
const _allowedParams: BaseParamsListT = [
  ..._mandatory,
  'defaultTracker',
  'externalDeviceId',
  'gps_adid',
  'oaid',
  'android_uuid',
  'fb_id',
  'fire_adid',
  'persistent_ios_uuid',
  'ios_uuid',
  'idfa',
  'idfv',
  'primary_dedupe_token',
  'push_token',
]

/**
 * Allowed configuration overrides
 *
 * @type {string[]}
 * @private
 */
const _allowedConfig: CustomConfigListT = [
  'customUrl',
  'dataResidency',
  'urlStrategy',
  'eventDeduplicationListLimit',
  'namespace'
]

/**
 * Global configuration object used across the sdk
 *
 * @type {{
 * namespace: string,
 * version: string,
 * sessionWindow: number,
 * sessionTimerWindow: number,
 * requestValidityWindow: number
 * }}
 */
const _baseConfig = {
  sessionWindow: 30 * MINUTE,
  sessionTimerWindow: 60 * SECOND,
  requestValidityWindow: 28 * DAY
}

/**
 * Check of configuration has been initialized
 *
 * @returns {boolean}
 */
function isInitialised (): boolean {
  return _mandatory.reduce((acc, key) => acc && !!_baseParams[key], true)
}

/**
 * Get base params set by client
 *
 * @returns {Object}
 */
function getBaseParams (): BaseParamsT {
  return {..._baseParams}
}

/**
 * Set a single base parameter
 *
 * @param {string} key
 * @param {string} value
 */
function setBaseParam (key: $Keys<BaseParamsT>, value: ?string): void {
  if (_allowedParams.indexOf(key) === -1) {
    return
  }

  if (typeof value === 'string' && value.length > 0) {
    _baseParams = {..._baseParams, [key]: value}
    return
  }

  if (_baseParams[key]) {
    const updated = {..._baseParams}
    delete updated[key]
    _baseParams = updated
  }
}

/**
 * Set base params and custom config for the sdk to run
 *
 * @param {Object} options
 */
function set (options: InitOptionsT): void {
  if (hasMissing(options)) {
    return
  }

  const filteredParams = [..._allowedParams, ..._allowedConfig]
    .filter(key => !!options[key])
    .map(key => [key, options[key]])

  _baseParams = filteredParams
    .filter(([key]) => _allowedParams.indexOf(key) !== -1)
    .reduce(reducer, {})

  _customConfig = filteredParams
    .filter(([key]) => _allowedConfig.indexOf(key) !== -1)
    .reduce(reducer, {})
}

/**
 * Get custom config set by client
 *
 * @returns {Object}
 */
function getCustomConfig (): CustomConfigT {
  return {..._customConfig}
}

/**
 * Check if there are  missing mandatory parameters
 *
 * @param {Object} params
 * @returns {boolean}
 * @private
 */
function hasMissing (params: BaseParamsT): boolean {
  const missing = _mandatory.filter(value => !params[value])

  if (missing.length) {
    Logger.error(`You must define ${buildList(missing)}`)
    return true
  }

  return false
}

/**
 * Restore config to its default state
 */
function destroy (): void {
  _baseParams = {}
  _customConfig = {}
}

const Config = {
  ..._baseConfig,
  set,
  setBaseParam,
  getBaseParams,
  getCustomConfig,
  isInitialised,
  hasMissing,
  destroy
}

export default Config
