import { tokens } from '../../config.json'
import request from 'request'

const apiHost = 'http://ws.audioscrobbler.com/2.0/'

export function lastfm (settings) {
  return new Promise((resolve, reject) => {
    let un = settings.un
    let token = tokens.lastfm

    if (token === '') {
      reject(new Error('There\'s no API key set or last.fm! Register one and add it to your config.'))
    }

    request(`${apiHost}?method=user.getrecenttracks&user=${un}&api_key=${token}&format=json`, (err, req, body) => {
      if (err) {
        reject(err)
      }

      let json = JSON.parse(body)

      if (json.recenttracks.track.length > 0) {
        let track = json.recenttracks.track[0]
        let nowListening = false

        if (track['@attr'] !== undefined && track['@attr'].nowplaying) {
          nowListening = track['@attr'].nowplaying
        }

        resolve({
          isNowListening: nowListening,
          title: track.name,
          artist: track.artist['#text']
        })
      } else {
        reject(new Error('This user hasn\'t scrobbled any tracks.'))
      }
    })
  })
}
