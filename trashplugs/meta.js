const axios = require("axios");
 
let trashplug = async (m, { text,trashcore,reply }) => {
  if (!text) return reply('provide a query *Example :* what is node js?');
 
  let { data } = await axios.get('https://www.abella.icu/hika-ai?q=' + encodeURIComponent(text));
 
 
  let res = data.data;
  await reply(res.answer.trim());
 
  let ref = res.references?.map((v, i) => `${i+1}. ${v.name}\n${v.url}`).join('\n\n');
  if (ref) await m.reply('Results :\n\n' + ref);
};
 
trashplug.help = ['hika']
trashplug.tags = ['ai2']
trashplug.command = ['indo-ai']
 
module.exports = trashplug;