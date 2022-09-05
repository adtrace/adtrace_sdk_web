import Adtrace from '../../sdk/main'
import SimpleAction from '../simple-action'

function init () {
  SimpleAction('stop', Adtrace.stop)()
}

export default init
