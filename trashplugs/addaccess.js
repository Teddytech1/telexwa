const axios = require("axios");
 
let trashplug = async (m, { trashown,reply,text,addPremiumUser }) => {
  if (!trashown) return reply(mess.owner);
  if (!text) return reply("Example: /addacces (number)");

  let user = text.replace(/[^\d]/g, "");
  addPremiumUser(user, 30);
  m.reply(`Yah user ${user} has now got the access`);
};
trashplug.help = ['addaccess']
trashplug.tags = ['addvip']
trashplug.command = ['addaccess']
 
module.exports = trashplug;