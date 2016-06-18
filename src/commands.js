import { lastfm } from './services'

function getIdentifier(evt) {
  return evt['0'].from;
}

export function setuser(db, evt) {
  return new Promise((resolve) => {
    if (evt.args.length === 0) {
      return resolve('Please provide a username to associate with your current identity.')
    }

    // Get the sender and get their settings.
    let id = getIdentifier(evt)
    let settings = db.get(`s.${id}`).value() || {}

    // Set their username with key 'un'
    settings.un = evt.args[0]

    // Persist!
    db.set(`s.${id}`, settings).value()

    return resolve(`You've now associated your current identity to the username ${settings.un}`)
  })
}

export function getuser(db, evt) {
  return new Promise((resolve) => {
    // Get the sender and get their settings.
    let id = getIdentifier(evt)
    let settings = db.get(`s.${id}`).value() || {}

    if (typeof settings.un !== 'undefined') {
      resolve(`You're currently associated with the username ${settings.un}`)
    } else {
      resolve(`You're currently not associated with any username!`)
    }
  })
}

export function nowplaying(db, evt) {
  return new Promise((resolve, reject) => {
    let p
    let id = getIdentifier(evt)
    let settings = db.get(`s.${id}`).value() || {}

    if (typeof settings.un === 'undefined') {
      resolve(`You're currently not associated with any username!`)
    }

    switch (settings.srv) {
      case 'lastfm':
      default:
        p = lastfm
    }

    p(settings).then((data) => {
      let is_doing

      if (data.isNowListening) {
        is_doing = 'is now listening to'
      } else {
        is_doing = 'is not listening to anything right now. The last track they listened to was'
      }
      
      resolve(`'${settings.un}' ${is_doing} ${data.title} by ${data.artist}`)
    }).catch(reject)
  })
}