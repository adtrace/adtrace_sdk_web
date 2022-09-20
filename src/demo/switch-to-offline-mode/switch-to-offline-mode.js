import Adtrace from '../../sdk/main'
import SimpleAction from '../simple-action'

function init () {
  SimpleAction('gooffline', Adtrace.switchToOfflineMode)()
}

export default init
