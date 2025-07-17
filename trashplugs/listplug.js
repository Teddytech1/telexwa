const fs = require("fs")
const path = require('path');

let trashplug = async (m, { trashcore, text, reply, example }) => {
let dir = fs.readdirSync('./trashplugs')
if (dir.length < 1) return reply("no files in the plugins")
let teks = "\n"
for (let e of dir) {
teks += `* ${e}\n`
}
reply(teks)
}

trashplug.command = ["listplugin", "listplugins"]

module.exports = trashplug