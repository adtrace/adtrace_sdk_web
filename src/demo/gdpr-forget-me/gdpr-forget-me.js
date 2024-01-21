import Adtrace from '../../sdk/main'
import SimpleAction from '../simple-action'

function init () {
  SimpleAction('gdpr', Adtrace.gdprForgetMe)()
}

export default init
