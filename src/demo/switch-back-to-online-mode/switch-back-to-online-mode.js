import Adtrace from '../../sdk/main'
import SimpleAction from '../simple-action'

function init () {
  SimpleAction('goonline', Adtrace.switchBackToOnlineMode)()
}

export default init
