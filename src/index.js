import { setuser, getuser, nowplaying } from './commands'
import { connect, message } from 'coffea'
import config from '../config.json'
import dude from 'debug-dude'
import low from 'lowdb'

const { log, info } = dude('nowplaying')
const db = low('../db.json')
const networks = connect(config.networks)

info('Starting nowplaying bot...')
db.read()

networks.on('command', (evt, reply) => {
  let p
  log('Received command event: %o', evt)

  switch (evt.cmd.toLowerCase()) {
    case 'getuser':
      p = getuser
      break
    case 'setuser':
      p = setuser
      break
    case 'np':
    case 'nowplaying':
      p = nowplaying
      break
  }

  p(db, evt).then((msg, flush) => {
    reply(message(evt.channel, msg))
    if (flush === true) {
      db.write()
    }
  }).catch((e) => {
    reply(message(evt.channel, `Error: ${e}`))
  })
})
