import Adtrace from '../../sdk/main'
import SimpleAction from '../simple-action'

function init () {
  SimpleAction('cleargcp', Adtrace.clearGlobalCallbackParameters)()
}

export default init
