const axios = require('axios');
let trashplug = async (m, {trashcore,replymenu,menu}) => {
replymenu(`${menu}
`)
};
trashplug.help = ['trashcore']
trashplug.tags = ['menu']
trashplug.command = ['menu']


module.exports = trashplug;