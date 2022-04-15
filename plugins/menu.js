const { default: makeWASocket, BufferJSON, WA_DEFAULT_EPHEMERAL, generateWAMessageFromContent, downloadContentFromMessage, downloadHistory, proto, getMessage, generateWAMessageContent, prepareWAMessageMedia } = require('@adiwajshing/baileys-md')
wm = global.wm
let fs = require('fs')
let path = require('path')
let levelling = require('../lib/levelling')
let tags = {
  'main': '*MENU UTAMA*',
  'advanced': '*ADVANCED*',
  'absen': '*MENU ABSEN*',
  'rpg': '*MENU RPG*',
  'anime': '*MENU ANIME*',
  'nsfw': '*MENU NSFW*',
  'sticker': '*MENU CONVERT*',
  'downloader': '*MENU DOWNLOADER*',
  'xp': '*MENU EXP*',
  'fun': '*MENU FUN*',
  'game': '*MENU GAME*',
  'github': '*MENU GITHUB*',
  'group': '*MENU GROUP*',
  'image': '*MENU IMAGE*',
  'info': '*MENU INFO*',
  'internet': '*INTERNET*',
  'islam' : '*MENU ISLAMI*',
  'kerang': '*MENU KERANG*',
  'maker': '*MENU MAKER*',
  'owner': '*MENU OWNER*',
  'quotes' : '*MENU QUOTES*',
  'stalk': '*MENU STALK*',
  'tools': '*MENU TOOLS*',
}
const defaultMenu = {
  before: `
❑┅┅┄┄┅⟨ 𝗠 𝗘 𝗡 𝗨 ⟩┅┅┄┄┅❑
  
❑┅┅┄┄┅⟨ 𝗨 𝗦 𝗘 𝗥
│✾ *Name:* %name
│✾ *Status:* -
│✾ *Limit:* %limit
│✾ *Role:* %role
│✾ *Level:* %level 
│✾ *Xp:* %exp / %maxexp
│✾ *Total Xp:* %totalexp
│✾ *Premium:* ${global.prem ? '✅' : '❌'}
╰❑

❑┅┅┄┄┅⟨ 𝗧 𝗢 𝗗 𝗔 𝗬
│✾ *Days:* %week %weton
│✾ *Date:* %date
│✾ *Islamic Date:* %dateIslamic
│✾ *Time:* %time
╰❑

❑┅┅┄┄┅⟨ 𝗜 𝗡 𝗙 𝗢 𝗕 𝗢 𝗧
│✾ *Bot Name:* ${wm}
│✾ *Lib*: Baileys-MD
│✾ *${Object.keys(global.db.data.users).length}* *Pengguna*
│✾ *Prefix:* [. / #]
│✾ *Uptime:* %uptime ( %muptime )
│✾ *Mode:* ${global.opts['self'] ? 'Self' : 'publik'}
│✾ *Database:* %rtotalreg dari %totalreg
╰❑

❑┅┅┄┄┅⟨ 𝗜 𝗡 𝗙 𝗢 𝗖 𝗠 𝗗
│ *Ⓟ* = Premium
│ *Ⓛ* = Limit
╰❑
  %readmore`.trimStart(), 
   header: '❑‒‒‒‒‒「 %category 」‒‒‒‒‒',
   body: '┆✦ %cmd %isPremium %islimit',
   footer: '╰──······──·····\n',
    after: `
*%npmname @^%version*
${'```%npmdesc```'}
`,
}
let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    let package = JSON.parse(await fs.promises.readFile(path.join(__dirname, '../package.json')).catch(_ => '{}'))
    let who
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    else who = m.sender 
    let user = global.db.data.users[who]
    let { exp, limit, level, money, role } = global.db.data.users[m.sender]
    let { min, xp, max } = levelling.xpRange(level, global.multiplier)
    let name = conn.getName(m.sender)
    let d = new Date(new Date + 3600000)
    let locale = 'id'
    // d.getTimeZoneOffset()
    // Offset -420 is 18.00
    // Offset    0 is  0.00
    // Offset  420 is  7.00
    let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(d)
    let time = d.toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    })
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
    let totalreg = Object.keys(global.db.data.users).length
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
    let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => {
      return {
        help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
        tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
        prefix: 'customPrefix' in plugin,
        limit: plugin.limit,
        premium: plugin.premium,
        enabled: !plugin.disabled,
      }
    })
    for (let plugin of help)
      if (plugin && 'tags' in plugin)
        for (let tag of plugin.tags)
          if (!(tag in tags) && tag) tags[tag] = tag
    conn.menu = conn.menu ? conn.menu : {}
    let before = conn.menu.before || defaultMenu.before
    let header = conn.menu.header || defaultMenu.header
    let body = conn.menu.body || defaultMenu.body
    let footer = conn.menu.footer || defaultMenu.footer
    let after = conn.menu.after || (conn.user.jid == global.conn.user.jid ? '' : `Powered by https://wa.me/${global.conn.user.jid.split`@`[0]}`) + defaultMenu.after
    let _text = [
      before,
      ...Object.keys(tags).map(tag => {
        return header.replace(/%category/g, tags[tag]) + '\n' + [
          ...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
            return menu.help.map(help => {
              return body.replace(/%cmd/g, menu.prefix ? help : '%p' + help)
                .replace(/%islimit/g, menu.limit ? 'Ⓛ' : '')
                .replace(/%isPremium/g, menu.premium ? 'Ⓟ' : '')
                .trim()
            }).join('\n')
          }),
          footer
        ].join('\n')
      }),
      after
    ].join('\n')
    text = typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : ''
    let replace = {
      '%': '%',
      p: _p, uptime, muptime,
      me: conn.user.name,
      npmname: package.name,
      npmdesc: package.description,
      version: package.version,
      exp: exp - min,
      maxexp: xp,
      totalexp: exp,
      xp4levelup: max - exp,
      github: package.homepage ? package.homepage.url || package.homepage : '[unknown github url]',
      level, limit, money, name, weton, week, date, dateIslamic, time, totalreg, rtotalreg, role,
      readmore: readMore
    }
    text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
     const template = generateWAMessageFromContent(m.chat, proto.Message.fromObject({
     templateMessage: {
         hydratedTemplate: {
           hydratedContentText: text.trim(),
           locationMessage: { 
           jpegThumbnail: fs.readFileSync('./src/welcome.jpg') },
           hydratedFooterText: wm,
           hydratedButtons: [{
            urlButton: {
               displayText: 'MY WEBSITE',
               url: 'https://pilarv2.github.io/'
             }

           },
             {
              quickReplyButton: {
               displayText: 'Owner',
               id: '.owner',
             }

           },
           {
             quickReplyButton: {
               displayText: 'Profile',
               id: '.profile',
             }
           }]
         }
       }
     }), { userJid: m.sender, quoted: m });
     let d1 = 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    let d2 = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    let d3  = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    let d4 = 'application/pdf'
    let d5 = 'text/rtf'
    let td = `${pickRandom([d1,d2,d3,d4,d5])}`
    const message = {
            document: { url: 'https://telegra.ph/file/f3253bf1fbe288cc9ffe2.jpg' },
            jpegThumbnail: await fs.readFileSync('./src/welcome.jpg'), fileName: 'ALPIN BOT - MD', mimetype: td, fileLength: '9999', pageCount: '999',
            caption: text,
            footer: wm,
            templateButtons: [
                {
                    urlButton: {
                        displayText: '📍MY INSTAGRAM',
                        url: 'https://instagram.com/en4y.pin'
                    }
                },
                {
                    quickReplyButton: {
                        displayText: 'Owner',
                        id: '.owner'
                    }
                },
                {
                    quickReplyButton: {
                        displayText: 'Speed',
                        id: '.ping'
                    }
                },
                {
                    quickReplyButton: {
                        displayText: 'Donasi',
                        id: '.donasi'
                    }
                },
            ]
        }
       conn.sendMessage(m.chat, message,m)
    //conn.reply(m.chat, text.trim(), m)
    /*return await conn.relayMessage(
         m.chat,
         template.message,
         { messageId: template.key.id }
     )*/
  } catch (e) {
    conn.reply(m.chat, 'Maaf, menu sedang error', m)
    throw e
  }
}
handler.help = ['menu', 'help', '?']
handler.tags = ['main']
handler.command = /^(menu|help|\?)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null
handler.exp = 3

module.exports = handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}
