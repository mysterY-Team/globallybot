import djs from "discord.js"
const { Client, ModalSubmitInteraction } = djs
import canvasPKG from "@napi-rs/canvas"
const { createCanvas, Image } = canvasPKG
import { drawText } from "canvas-txt"
import conf from "../../config.js"
const { db, customEmoticons } = conf
import { imacaData } from "../../functions/dbSystem.js"
import { classes } from "../../functions/imaca.js"
import { request } from "undici"

export default {
    /**
     * @param {import("discord.js").Client} client
     * @param {import("discord.js").ModalSubmitInteraction} interaction
     * @param {string[]} args
     */
    async execute(client, interaction, ...args) {
        await interaction.deferReply()

        const canvas = createCanvas(654, 1000)
        const context = canvas.getContext("2d")
        var txt = interaction.fields.getTextInputValue("description")

        var snpsht = await db.get(`userData/${interaction.user.id}/imaca`)
        var newData = imacaData.encode(snpsht.val)
        newData.description = interaction.fields.getTextInputValue("description")
        newData.name = interaction.fields.getTextInputValue("name")
        newData.nameGradient1 = `#${interaction.fields.getTextInputValue("gradient1")}`.replace("##", "#").replace("#$", "$").toUpperCase()
        newData.nameGradient2 = `#${interaction.fields.getTextInputValue("gradient2")}`.replace("##", "#").replace("#$", "$").toUpperCase()
        newData.bannerURL = interaction.fields.getTextInputValue("imgurl")

        const _class = classes[newData.cardID]

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

        const nameRegex = /\$THEME|\$RANDOM|\$FRAND/
        const colorRegex = /#?[0-9A-F]{6}/
        if (
            (!newData.nameGradient1.match(nameRegex) && !newData.nameGradient1.match(colorRegex)) ||
            (!newData.nameGradient2.match(nameRegex) && !newData.nameGradient2.match(colorRegex))
        ) {
            interaction.editReply(
                `${customEmoticons.denided} Któryś argument koloru **nie jest** kolorem HEX lub specjalną funkcją ImaCarrrd, sprawdź poprawność i użyj komendy jeszcze raz!`
            )
            return
        }

        if (newData.bannerURL)
            try {
                const { body } = await request(newData.bannerURL)
                const banner = new Image()
                banner.src = Buffer.from(await body.arrayBuffer())
                context.drawImage(banner, 0, 0)
            } catch (err) {
                console.warn(err)
                interaction.editReply(`${customEmoticons.denided} Banner nie mógł zostać poprawnie przekonwertowany!`)
                return
            }

        await db.get(`userData/${interaction.user.id}/imaca`, imacaData.decode(newData))
        interaction.editReply(`${customEmoticons.approved} Dane zostały zaktualizowane!`)
    },
}
