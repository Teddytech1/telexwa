const axios = require("axios");
 
let trashplug = async (m, { trashown,reply,trashcore }) => {
                if (!trashown) return reply(mess.owner)
                trashcore.public = false
                reply('*Successful in Changing To Self Usage*')
            };
            
trashplug.help = ['self']
trashplug.tags = ['private']
trashplug.command = ['private']
 
module.exports = trashplug;