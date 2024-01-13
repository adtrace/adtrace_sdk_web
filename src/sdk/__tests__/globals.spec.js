describe('test global constants', () => {
  describe('test default values', () => {
    jest.isolateModules(() => {
      global.__ADTRACE__NAMESPACE = undefined
      global.__ADTRACE__SDK_VERSION = undefined
      const Globals = require('../globals')

      it('falls back to default values', () => {
        expect(Globals.default.namespace).toBe('adtrace-sdk')
        expect(Globals.default.version).toBe('5.0.0')
      })
    })
  })

  describe('test globally set values', () => {
    jest.isolateModules(() => {
      global.__ADTRACE__NAMESPACE = 'adtrace-web-sdk'
      global.__ADTRACE__SDK_VERSION = '6.0.0'
      const Globals = require('../globals')

      it('sets global values', () => {
        expect(Globals.default.namespace).toBe('adtrace-web-sdk')
        expect(Globals.default.version).toBe('6.0.0')
      })
    })
  })
})
