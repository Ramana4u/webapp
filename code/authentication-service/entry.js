require('../common/server entry')

global.log = require('./log')

require('./store').connect().then(() => require('./web server'))