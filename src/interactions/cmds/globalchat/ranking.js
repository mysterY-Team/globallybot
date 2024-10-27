import djs from "discord.js"
const { Client, ChatInputCommandInteraction, EmbedBuilder, AttachmentBuilder } = djs
import canvasPKG from "@napi-rs/canvas"
const { Canvas, loadImage } = canvasPKG
import conf from "../../../config.js"
const { db, supportServer } = conf
import { gcdata } from "../../../functions/dbSystem.js"
import { checkUserStatus, botPremiumInfo } from "../../../functions/useful.js"

export default {
    /**
     *
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    execute: async function (client, interaction) {
        await interaction.deferReply()

        var users = []
        await Promise.all(
            Object.entries(db.get("userData").val).map(async (x) => {
                var fastData = { gc: gcdata.encode(x[1].gc), userID: x[0], premium: x[1].premium }
                try {
                    const ssstatus = await checkUserStatus(client, fastData.userID)
                    var user = await client.users.fetch(fastData.userID, { cache: false })
                    var z = Object.assign(fastData.gc, { user, premium: botPremiumInfo(fastData.userID, ssstatus, fastData.premium).have, ssstatus })
                    users.push(z)
                } catch (e) {}

                return
            })
        )

        const leaderboard = users.sort((a, b) => (b.karma > a.karma ? 0 : -1))

        const userPanel = {
            size: 100,
            padding: 10,
        }
        var canvas = new Canvas(800, userPanel.size * 10)
        var context = canvas.getContext("2d")

        function rank(data) {
            if (data.ssstatus.mysteryTeam) return "mysterY"
            else
                switch (data.modPerms) {
                    case 4:
                        return "Starszy naczelnik GlobalChatu"
                    case 3:
                        return "Naczelnik GlobalChatu"
                    case 2:
                        return "Starszy moderator GlobalChatu"
                    case 1:
                        return "Moderator GlobalChatu"
                    case 0:
                        return "Użytkownik"
                }
        }

        context.fillStyle = "black"
        context.fillRect(0, 0, canvas.width, canvas.height)

        for (let i = 0; i < 10; i++) {
            context.strokeStyle = "white 3px"
            context.strokeRect(userPanel.padding, i * 100 + userPanel.padding, canvas.width - userPanel.padding * 2, userPanel.size - userPanel.padding * 2)
            if (i < leaderboard.length) {
                {
                    const imgs = await loadImage(leaderboard[i].user.displayAvatarURL({ extension: "png", size: 512, forceStatic: true }))
                    context.drawImage(imgs, 15, i * 100 + 15, 70, 70)
                }

                context.textAlign = "left"
                context.textBaseline = "top"
                context.fillStyle = "white"
                let size = 30
                let end = true
                do {
                    context.font = `${size}px Jersey 10`
                    end = context.measureText(leaderboard[i].user.username).width <= 500
                    size--
                } while (!end)

                context.fillText(leaderboard[i].user.username, 95, i * 100 + 17)
                //karma
                context.textAlign = "left"
                context.textBaseline = "bottom"
                context.fillStyle = "white"
                context.font = "14px sans-serif"
                context.fillText(`${rank(leaderboard[i])}${leaderboard[i].premium ? " | Konto premium" : ""}`, 95, i * 100 + userPanel.size - 38)
                context.font = "bold 16px sans-serif"
                context.fillText(`Karma: ${leaderboard[i].karma}`, 95, i * 100 + userPanel.size - 15)

                //miejsce
                context.save()
                context.textAlign = "right"
                context.textBaseline = "top"
                context.fillStyle = ["gold", "silver", "#cd7f32"][i] ?? "white"
                context.font = `48px Jersey 10`
                context.translate(canvas.width - userPanel.padding - 30, i * 100 + 20)
                context.rotate(0.4)
                context.translate(-(canvas.width - userPanel.padding - 30), -(i * 100 + 20))
                context.fillText(`#${i + 1}`, canvas.width - userPanel.padding - 5, i * 100 + 25)
                context.restore()
            } else {
                context.textAlign = "center"
                context.textBaseline = "top"
                context.fillStyle = "white"
                context.font = "20px sans-serif"
                context.fillText("[ wolny slot ]", canvas.width / 2, i * 100 + 20)
            }
        }

        var attachment = new AttachmentBuilder().setFile(canvas.toBuffer("image/png")).setName("rank.png")

        let channel = await client.channels.fetch(supportServer.gclogs.msg)
        if (channel && channel.isTextBased())
            var msg = await channel.send({
                content: `Ta wiadomość jest zarezerwowana dla komendy \`globalchat ranking\` (ID interakcji: ${interaction.id})`,
                files: [attachment],
            })
        else throw console.error("Nie udało się wysłać do tego kanału; nie istnieje taka możliwość (/globalchat ranking)")

        const _place = leaderboard.findIndex((x) => x.user.id == interaction.user.id) + 1
        var embed = new EmbedBuilder()
            .setImage(msg.attachments.first().url)
            .setDescription(
                `Twoja ilość karmy: **${gcdata.encode(db.get(`userData/${interaction.user.id}/gc`).val).karma}**\nTwoje miejsce w rankingu: ${
                    _place ? "**" + _place + "**" : "brak - Twoja karma jest za mała, aby móc brać udział w rankingu"
                }`
            )

        interaction.editReply({
            embeds: [embed],
        })
    },
}