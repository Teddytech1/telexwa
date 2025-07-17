const axios = require('axios');
let trashplug = async (m, {trashcore,reply,trashpic,fkontak}) => {
  try {
    let me = m.sender;
 const response = await axios.get(`https://api.github.com/repos/Tennor-modz/trashcore-system`)
    if (response.status === 200) {
      const repoData = response.data
      const repos = `
*BOT NAME:*
> ${repoData.name}

*STARS:* 
> ${repoData.stargazers_count}

*FORKS:* 
> ${repoData.forks_count}

*GITHUB LINK:* 
https://github.com/Tennor-modz/trashcore-system 

@${me.split("@")[0]}👋, Star ⭐ fork and deploy my repo 🤭

> 🩸⃟‣𝐓𝐑𝐀𝐒𝐇𝐂𝐎𝐑𝐄-𝐂𝐋𝐈𝐄𝐍𝐓≈🚭`;
trashcore.sendMessage(m.chat, { text : repos,
contextInfo: {
mentionedJid: [m.sender],
forwardingScore: 99, 
isForwarded: true, 
forwardedNewsletterMessageInfo: {
newsletterJid: '120363418618707597@newsletter',
serverMessageId: 20,
newsletterName: '🩸⃟‣𝐓𝐑𝐀𝐒𝐇𝐂𝐎𝐑𝐄-𝐂𝐋𝐈𝐄𝐍𝐓≈🚭'
},
externalAdReply: {
title: "🩸⃟‣𝐓𝐑𝐀𝐒𝐇𝐂𝐎𝐑𝐄-𝐂𝐋𝐈𝐄𝐍𝐓≈🚭", 
body: "🩸⃟‣𝐓𝐑𝐀𝐒𝐇𝐂𝐎𝐑𝐄-𝐂𝐋𝐈𝐄𝐍𝐓≈🚭",
thumbnail: replypic, 
sourceUrl: null,
mediaType: 1
}}}, { quoted : fkontak })
    } else {
      await reply(`Failed to fetch repository data!`)
    }
  } catch (error) {
    console.error(error)
    await reply(`Couldn't find repository!`)
  }
};
trashplug.help = ['sc']
trashplug.tags = ['script']
trashplug.command = ['repo']


module.exports = trashplug;
