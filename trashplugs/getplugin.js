const fs = require("fs")

let trashplug = async (m, { trashcore,trashown, reply, text, example }) => {
if (!trashown) return reply(mess.owner)  
if (!text) return reply("provide a plugin name")
if (!text.endsWith(".js")) return m.reply("file name must end with  .js")
if (!fs.existsSync("./trashplugs/" + text.toLowerCase())) return reply("sucess!")
let res = await fs.readFileSync("./trashplugs/" + text.toLowerCase())
return reply(`${res.toString()}`)
}

trashplug.command = ["getp", "gp", "getplugins", "getplugin"]

module.exports = trashplug