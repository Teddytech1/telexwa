// Owner Setting
global.owner = ["254104245659",]
global.error = ["6666",]
global.ownername = "Trashcore"
//━━━━━━━━━━━━━━━━━━━━━━━━//
// Bot Setting
global.botname = "Trashcore"
global.botversion = "1.2.0"
global.typebot = "Plugin"
global.session = "trashsession"
global.connect = true
global.statusview = true
global.thumb = "https://files.catbox.moe/4ryp6k.jpg"
global.wagc = "https://chat.whatsapp.com/BPyIptm3ZH68y4pSPrLMyq?mode=r_t"
//━━━━━━━━━━━━━━━━━━━━━━━━//
// Sticker Marker
global.packname = "𝐓𝐑𝐀𝐒𝐇𝐂𝐎𝐑𝐄"
global.author = "©𝐏𝐚𝐂𝐊𝐒"
//━━━━━━━━━━━━━━━━━━━━━━━━//
// Respon Message
global.mess = {
    success: '✅ Done.',
    admin: '🚨 Admin only.',
    premium: '🆘must be a premium user.',
    botAdmin: '🤖 Make me admin first.',
    owner: '👑 Owner only.',
    OnlyGrup: '👥 Group only.',
    private: '📩 Private chat only.',
    wait: '⏳ Processing...',
    error: '⚠️ Error occurred.',
}
//━━━━━━━━━━━━━━━━━━━━━━━━//
// File Update
let fs = require('fs')
let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(`Update File 📁 : ${__filename}`)
delete require.cache[file]
require(file)
})