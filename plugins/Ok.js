let handler = async (m, { conn, text, usedPrefix, command }) => {

conn.sendImageAsSticker(m.chat, 'https://telegra.ph/file/f61a7c96f3f86b6c5214f.png', m, { packname: "", author: "Himiko－MD" })
}

handler.customPrefix = /^(ok|makasih|thanks)$/i
handler.command = new RegExp

module.exports = handler
