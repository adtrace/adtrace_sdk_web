import Adtrace from '../../sdk/main'
import SimpleAction from '../simple-action'

function init () {
  SimpleAction('cleargpp', Adtrace.clearGlobalValueParameters)()
}

export default init
