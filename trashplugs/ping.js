const axios = require("axios");
const os = require('os')
let trashplug = async (m, { reply,trashcore }) => {
await m.reply(`𝒄𝒐𝒅𝒆𝒔 𝒔𝒑𝒆𝒂𝒌 𝒍𝒐𝒖𝒅𝒆𝒓 𝒕𝒉𝒂𝒏 𝒕𝒉𝒆 𝒂𝒄𝒕𝒖𝒂𝒍 𝒘𝒐𝒓𝒅𝒔,𝒄𝒉𝒆𝒄𝒌𝒊𝒏𝒈 𝒕𝒓𝒂𝒔𝒉𝒄𝒐𝒓𝒆 𝒔𝒑𝒆𝒆𝒅.........`)
  const memoryUsage = process.memoryUsage();
  const cpuInfo = os.cpus().map(cpu => ({
    total: Object.values(cpu.times).reduce((a, b) => a + b, 0),
    times: cpu.times,
  }));
  const totalCpuInfo = cpuInfo.reduce((acc, cpu) => ({
    total: acc.total + cpu.total,
    times: {
      user: (acc.times.user || 0) + (cpu.times.user || 0),
      nice: (acc.times.nice || 0) + (cpu.times.nice || 0),
      sys: (acc.times.sys || 0) + (cpu.times.sys || 0),
      idle: (acc.times.idle || 0) + (cpu.times.idle || 0),
      irq: (acc.times.irq || 0) + (cpu.times.irq || 0),
    },
  }), {
    total: 0,
    times: {},
  });

  const startTime = performance.now();
  const latency = performance.now() - startTime;
  const finalStatus = `𝒕𝒓𝒂𝒔𝒉𝒄𝒐𝒓𝒆 𝒔𝒚𝒔𝒕𝒆𝒎: ${latency.toFixed(4)} ms`;
  m.reply(finalStatus);
};  
trashplug.help = ['ping']
trashplug.tags = ['status']
trashplug.command = ['ping']


module.exports = trashplug;