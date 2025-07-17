const axios = require('axios');
let trashplug = async (m, { trashcore, trashown,reply,text }) => {
    if (!trashown) return reply(mess.owner) 

    // Parse command for 'on' or 'off'
    const args = text.trim().split(' ')[0];
    if (!args || !["on", "off"].includes(args)) {
        return reply('⚠️ 𝚄𝚂𝙴: *autoreact on* 𝙾𝚁 *autoreact off*');
    }

    if (!global.autoReact) global.autoReact = {};

    // Set auto-react status based on command
    if (args === "on") {
        global.autoReact[m.chat] = true;
        return reply('🟢Autoreact  enabled ✅');
    } else if (args === "off") {
        global.autoReact[m.chat] = false;
        return reply('🔴 autoreact is off ❌');
    }
};
trashplug.command = ['autoreact']
trashplug.tags = ['autoreact']
trashplug.help = ['autoreact']

module.exports = trashplug;