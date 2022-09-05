// @flow
declare var __Adtrace__NAMESPACE: string
declare var __Adtrace__SDK_VERSION: string
declare var process: {|
  env: {|
    NODE_ENV: 'development' | 'production' | 'test'
  |}
|}

const Globals = {
  namespace: __Adtrace__NAMESPACE || 'adtrace-sdk',
  version: __Adtrace__SDK_VERSION || '2.1.0',
  env: process.env.NODE_ENV
}

export default Globals
