import {init as logInit} from './log'
import tabsInit from './tabs/tabs'
import trackEventInit from './track-event/track-event'
import addGlobalCallbackParamsInit from './add-global-callback-params/add-global-callback-params'
import addGlobalValueParamsInit from './add-global-value-params/add-global-value-params'
import removeGlobalCallbackParamInit from './remove-global-callback-param/remove-global-callback-param'
import removeGlobalValueParamInit from './remove-global-value-param/remove-global-value-param'
import clearGlobalCallbackParamsInit from './clear-global-callback-params/clear-global-callback-params'
import clearGlobalValueParamsInit from './clear-global-value-params/clear-global-value-params'
import switchToOfflineModeInit from './switch-to-offline-mode/switch-to-offline-mode'
import switchBackToOnlineModeInit from './switch-back-to-online-mode/switch-back-to-online-mode'
import stopInit from './stop/stop'
import restartInit from './restart/restart'
import getWebUUID from './get-web-uuid/get-web-uuid'
import getAttribution from './get-attribution/get-attribution'
import setReferrer from './set-referrer/set-referrer'

function init (defaultAppConfig, defaultEventConfig) {
  logInit()
  tabsInit(defaultAppConfig)
  trackEventInit(defaultEventConfig)
  addGlobalCallbackParamsInit()
  addGlobalValueParamsInit()
  removeGlobalCallbackParamInit()
  removeGlobalValueParamInit()
  clearGlobalCallbackParamsInit()
  clearGlobalValueParamsInit()
  switchToOfflineModeInit()
  switchBackToOnlineModeInit()
  stopInit()
  restartInit()
  getWebUUID()
  getAttribution()
  setReferrer()
}

export default init
