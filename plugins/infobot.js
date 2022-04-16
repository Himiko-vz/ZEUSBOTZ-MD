let handler = async (m, { conn, command, usedPrefix, text }) => {
const { default: makeWASocket, BufferJSON, WA_DEFAULT_EPHEMERAL, generateWAMessageFromContent, downloadContentFromMessage, downloadHistory, proto, getMessage, generateWAMessageContent, prepareWAMessageMedia } = require('@adiwajshing/baileys-md')
let { performance } = require('perf_hooks')
let { sizeFormatter } = require('human-readable')
let fs = require('fs')
let os = require('os')
let _uptime = process.uptime() * 1000
    let _muptime
    if (process.send) {
      process.send('uptime')
      _muptime = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
      }) * 1000
    }
    let muptime = clockString(_muptime)
    let uptime = clockString(_uptime) 
    let tag = `@${m.sender.split('@')[0]}`
 m, { contextInfo: { mentionedJid: conn.parseMention(tag) }}
    let ow = `@${'6289625556161'.split('@')[0]}`
 m, { contextInfo: { mentionedJid: conn.parseMention(tag) }}
 let getGroups = await conn.groupFetchAllParticipating()
let groups = Object.entries(getGroups).slice(0).map(entry => entry[1])
let chats = Object.keys(conn.chats).filter(v => v.endsWith('s.whatsapp.net')).map(v => v)
let anu = groups.map(v => v.id)
 let old = performance.now()
   let neww = Math.round(performance.now())
   let speed = neww 
   let fakespeed = `${pickRandom(['42','120','10','30','15','24','52','405','130','95','91','90','230','302','620','192','5','8','45','67'])}` //Awokokawok fake speed
let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
 let totalreg = Object.keys(global.db.data.users).length
let info = `╭─────「 *❏ INFO BOT ❏* 」─────
│ ▧ *Library : Baileys-MD*
│ ▧ *Language : JavaScript*
│ ▧ *Database : MongoDB*
│ ▧ *Version : 1.8*
│ ▧ *Owner : @6283131214121*
│ ▧ *Runtime : ${uptime}*
│ ▧ *Speed : ${fakespeed} Ms*
│ ▧ *Mode : ${global.opts['self'] ? 'Self' : 'Publik'}*
│ ▧ *User : ${totalreg}*
│ ▧ *Register : ${rtotalreg}*
│ ▧ *Platform:* ${os.platform()} 
╰──────────────࿐${readMore}
╭─────「 *❏ CHAT INFO ❏* 」─────
│ ▧ *${chats.length}* Total Chats
│ ▧ *${anu.length}* Total Grup
│ ▧ *${Object.entries(global.db.data.chats).filter(chat => chat[1].isBanned).length}* Chat Terbanned
│ ▧ *${Object.entries(global.db.data.users).filter(user => user[1].banned).length}* Pengguna Terbanned
╰──────────────࿐`
const template = generateWAMessageFromContent(m.chat, proto.Message.fromObject({
     templateMessage: {
         hydratedTemplate: {
           hydratedContentText: info,
           locationMessage: { 
           jpegThumbnail: fs.readFileSync('./src/welcome.jpg') },
           hydratedFooterText: wm,
           hydratedButtons: [{
            urlButton: {
               displayText: 'MY INSTAGRAM 💌',
               url: 'https://instagram.com/kevinafsar_'
             }

           },
             {
              quickReplyButton: {
               displayText: 'SC BOT',
               id: '.sc',
             }

           },
           {
             quickReplyButton: {
               displayText: 'MENU',
               id: '.menu',
             }
           }]
         }
       }
     }), { userJid: m.sender, quoted: m });
    //conn.reply(m.chat, text.trim(), m)
    return await conn.relayMessage(
         m.chat,
         template.message,
         { messageId: template.key.id }
     )
}
handler.help = ['info', 'botinfo']
handler.tags = ['info']
handler.command = /^(botinfo|info)$/i

module.exports = handler
let more = String.fromCharCode(8206)
let readMore = more.repeat(4001)

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}
function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}
