import Adtrace from '../../sdk/main'
import SimpleAction from '../simple-action'

function init () {
  SimpleAction('restart', Adtrace.restart)()
}

export default init
