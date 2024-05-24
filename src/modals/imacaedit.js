const { Client, ModalSubmitInteraction } = require("discord.js")
const { createCanvas } = require("@napi-rs/canvas")
const { drawText } = require("canvas-txt")
const { db, customEmoticons } = require("../config")
const { imacaData } = require("../functions/dbs")
const imacaInfo = require("../functions/imaca")

module.exports = {
    /**
     * @param {Client} client
     * @param {ModalSubmitInteraction} interaction
     * @param {string[]} args
     */
    async execute(client, interaction, ...args) {
        await interaction.deferReply()

        const canvas = createCanvas(654, 1000)
        const context = canvas.getContext("2d")
        var txt = interaction.fields.getTextInputValue("description")

        var snpsht = db.get(`userData/${interaction.user.id}/imaca`)
        const data = imacaData.encode(snpsht.val)
        var newData = imacaData.create()
        newData.cardID = data.cardID
        newData.description = interaction.fields.getTextInputValue("description")
        newData.name = interaction.fields.getTextInputValue("name")
        newData.nameGradient1 = `#${interaction.fields.getTextInputValue("gradient1")}`.replace("##", "#").toUpperCase()
        newData.nameGradient2 = `#${interaction.fields.getTextInputValue("gradient2")}`.replace("##", "#").toUpperCase()
        newData.bannerURL = interaction.fields.getTextInputValue("imgurl")

        const _class = imacaInfo.classes[0]

        var g = drawText(context, txt, {
            x: 0,
            y: 0,
            width: 654,
            height: 1000,
            fontSize: _class.TextDesc.TextSize,
            align: "left",
            vAlign: "top",
            font: _class.TextDesc,
            lineHeight: _class.TextDesc.LineWidth,
        })

        if (newData.name.match(/\p{Extended_Pictographic}/gu)) {
            interaction.editReply(`${customEmoticons.denided} Nazwa zawiera znaki, które nie są obsługiwane, sprawdź poprawność swojej nazwy!`)
            return
        }
        if (g.height > _class.TextDesc.MaxHeight) {
            interaction.editReply(`${customEmoticons.denided} Opis przekracza normy obecnego typu karty (za dużo linijek), spróbuj skrócić opis!`)
            return
        }

        if (!newData.nameGradient1.match(/#[0-9A-F]{6}/g) || !newData.nameGradient2.match(/#[0-9A-F]{6}/g)) {
            interaction.editReply(`${customEmoticons.denided} Któryś argument koloru **nie jest** kolorem HEX, sprawdź poprawność i użyj komendy jeszcze raz!`)
            return
        }
        db.set(`userData/${interaction.user.id}/imaca`, imacaData.decode(newData))
        interaction.editReply(`${customEmoticons.approved} Dane zostały zaktualizowane!`)
    },
}
