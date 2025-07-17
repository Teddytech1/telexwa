const axios = require('axios');
const yts = require('yt-search')
let trashplug = async (m, { text,trashcore,fkontak,reply,trashpic}) => {
  try {
    
    if (!text) return reply('*Example :* .play Only We Know Speed Up')

    let searchResult = await yts(`${text}`)
    let video = searchResult.videos[0]

    let { data } = await axios.get('https://api.yogik.id/downloader/youtube', {
      params: { url: video.url, format: 'audio' },
      headers: { Accept: 'application/json' }
    })

    let result = data.result

    await trashcore.sendMessage(m.chat, {
      audio: { url: result.download_url },
      mimetype: 'audio/mpeg',
      ptt: false,
      contextInfo: {
        externalAdReply: {
          title: result.title,
          body: result.author_name,
          thumbnailUrl: result.thumbnail_url,
          sourceUrl: video.url,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: fkontak })

  } catch (e) {
    reply(e.message)
  }
};
trashplug.help = ['play']
trashplug.tags = ['play']
trashplug.command = ['play']


module.exports = trashplug;