const axios = require("axios");
 
let trashplug = async (m, { isPremium,reply,text,delPremiumUser }) => {
  if (!isPremium) return reply(mess.premium);
  if (!text) return reply("Example: /delacces (number)");

  let user = text.replace(/[^\d]/g, "");
  let removed = delPremiumUser(user);
  reply(removed
    ? `removed ${user} from bot access`
    : "User is bored now");
};
trashplug.help = ['delaccess']
trashplug.tags = ['delvip']
trashplug.command = ['delaccess']
 
module.exports = trashplug;