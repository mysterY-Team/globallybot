const { CommandInteraction, Client, AttachmentBuilder } = require("discord.js")
const { createCanvas, Image, SKRSContext2D } = require("@napi-rs/canvas")
const { drawText } = require("canvas-txt")
const { readFile } = require("fs/promises")
const { request } = require("undici")
const { generateGradientText } = require("../../functions/gradient")
const imacaInfo = require("../../functions/imaca")
const { get, ref, getDatabase } = require("@firebase/database")
const { firebaseApp, customEmoticons, _bot } = require("../../config")
const { imacaData } = require("../../functions/dbs")

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        var user = interaction.options.getUser("osoba") || interaction.user

        await interaction.deferReply()
        var snpsht = await get(ref(getDatabase(firebaseApp), `${_bot.type}/userData/${user.id}/imaca`))
        if (!snpsht.exists()) {
            interaction.editReply(`${customEmoticons.minus} Nie masz profilu, aby wyświetlić kartę...\n${customEmoticons.info} Załóż pod \`profil utwórz typ:ImaCarrrd\``)
            return
        }
        var data = imacaData.encode(snpsht.val())
        const canvas = createCanvas(700, 1000)
        const context = canvas.getContext("2d")

        /**
         *
         * @param {SKRSContext2D} $canvasContext
         * @param {number} x
         * @param {number} y
         * @param {number} wh
         */
        async function setImageInCircle($canvasContext, x, y, wh, img) {
            $canvasContext.beginPath()
            $canvasContext.arc(x + wh / 2, y + wh / 2, wh / 2, 0, Math.PI * 2, true)
            $canvasContext.closePath()
            $canvasContext.save()
            $canvasContext.clip()
            const { body } = await request(img)
            const imgs = new Image()
            imgs.src = Buffer.from(await body.arrayBuffer())
            $canvasContext.drawImage(imgs, x, y, wh, wh)
            $canvasContext.restore()
        }

        /**
         *
         * @param {SKRSContext2D} $canvasContext
         * @param {number} x
         * @param {number} y
         * @param {string} text
         * @param {`#${string}`[]} colors
         * @param {string} font
         */
        function createGradientText($canvasContext, x, y, text, colors, font) {
            var info = generateGradientText(colors, text)
            var width = 0

            for (let i = 0; i < info.length; i++) {
                $canvasContext.font = font
                $canvasContext.fillStyle = info[i].color
                const letterW = $canvasContext.measureText(info[i].text).width
                $canvasContext.fillText(info[i].text, x + width, y)
                width += letterW
            }
        }

        switch (data.cardID) {
            case 0:
                if (data.bannerURL !== null) {
                    const minHeight = 300

                    const { body } = await request(data.bannerURL)
                    const banner = new Image()
                    banner.src = Buffer.from(await body.arrayBuffer())
                    var width = canvas.width
                    var height = (canvas.width / banner.width) * banner.height
                    if (height < minHeight) {
                        width = (minHeight / height) * width
                        height = minHeight
                    }
                    context.drawImage(banner, Math.min((canvas.width - width) / 2, 0), Math.min((minHeight - height) / 2, 0), width, height)
                }

                const background0 = await readFile("./src/others/imacarrrd0.png")
                const backgroundImage0 = new Image()
                backgroundImage0.src = background0
                context.drawImage(backgroundImage0, 0, 0, canvas.width, canvas.height)

                await setImageInCircle(context, 23, 123, 210, user.displayAvatarURL({ format: "png", size: 512 }))

                createGradientText(context, 23, 396, data.name, [data.nameGradient1, data.nameGradient2, "#FFFFFF"], "68px Jersey 10")
                createGradientText(context, 23, 443, user.username, [data.nameGradient1, data.nameGradient2, "#FFFFFF"], "34px Jersey 10")

                drawText(context, data.description, {
                    x: 23,
                    y: 500,
                    width: 654,
                    height: imacaInfo.classes[0].TextDesc.MaxHeight,
                    fontSize: imacaInfo.classes[0].TextDesc.TextSize,
                    align: "left",
                    vAlign: "top",
                    font: imacaInfo.classes[0].TextDesc.FontName,
                })
                break
            case 1:
                if (data.bannerURL === null) {
                    const add = await readFile("./src/others/imaca_addtional1_1.png")
                    const addimg = new Image()
                    addimg.src = add
                    context.drawImage(addimg, 104, 0, 596, (596 / canvas.width) * 300)
                } else {
                    const minWidth = 596
                    const minHeight = (minWidth / canvas.width) * 300

                    const { body } = await request(data.bannerURL)
                    const banner = new Image()
                    banner.src = Buffer.from(await body.arrayBuffer())
                    var width = minWidth
                    var height = (minWidth / banner.width) * banner.height
                    if (height < minHeight) {
                        width = (minHeight / height) * width
                        height = minHeight
                    }
                    context.drawImage(banner, Math.min((596 - width) / 2 + 104, 104), Math.min((minHeight - height) / 2, 0), width, height)
                }

                const background1 = await readFile("./src/others/imacarrrd1.png")
                const backgroundImage1 = new Image()
                backgroundImage1.src = background1
                context.drawImage(backgroundImage1, 0, 0, 700, 1000)

                await setImageInCircle(context, 8, 73, 160, user.displayAvatarURL({ format: "png", size: 512 }))

                createGradientText(context, 23, 355, data.name, [data.nameGradient1, data.nameGradient2, "#000000"], "44px Audiowide")
                createGradientText(context, 140, 295, user.username, [data.nameGradient1, data.nameGradient2, "#000000"], "21px Audiowide")

                drawText(context, data.description, {
                    x: 23,
                    y: 375,
                    width: 654,
                    height: imacaInfo.classes[1].TextDesc.MaxHeight,
                    fontSize: imacaInfo.classes[1].TextDesc.TextSize,
                    align: "left",
                    vAlign: "top",
                    font: imacaInfo.classes[1].TextDesc.FontName,
                    lineHeight: imacaInfo.classes[1].TextDesc.LineWidth,
                })

                break
        }

        const attachment = new AttachmentBuilder(canvas.toBuffer("image/png"), { name: `imacarrd_${user.id}.png` })

        interaction.editReply({ files: [attachment] })
    },
}
