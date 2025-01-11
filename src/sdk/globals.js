// @flow
declare var __ADTRACE__NAMESPACE: string
declare var __ADTRACE__SDK_VERSION: string
declare var process: {|
  env: {|
    NODE_ENV: 'development' | 'production' | 'test'
  |}
|}

const Globals = {
  namespace: __ADTRACE__NAMESPACE || 'adtrace-sdk',
  version: __ADTRACE__SDK_VERSION || '2.3.3',
  env: process.env.NODE_ENV
}

export default Globals
