import Adtrace from '../../sdk/main'
import SimpleAction from '../simple-action'

function init () {
  SimpleAction('dtps', Adtrace.disableThirdPartySharing)()
}

export default init
