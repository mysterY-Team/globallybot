import djs from "discord.js"
const { ContextMenuCommandInteraction, Client, ActionRowBuilder, ButtonStyle, EmbedBuilder, ButtonBuilder } = djs
import conf from "../../config.js"
const { db, customEmoticons } = conf
import { gcdataGuild, gcdata } from "../../functions/dbSystem.js"

export default {
    /**
     *
     * @param {Client} client
     * @param {ContextMenuCommandInteraction} interaction
     */
    execute: async function (client, interaction) {
        var targetMsg = await interaction.channel.messages.fetch(interaction.targetId)

        if (!targetMsg.author.bot || targetMsg.author.system) {
            interaction.reply({ content: `${customEmoticons.minus} To **NIE** jest wiadomość od "aplikacji"`, ephemeral: true })
            return
        }

        if (targetMsg.author.discriminator !== "0000") {
            interaction.reply({ content: `${customEmoticons.minus} Wiadomość GlobalChat powinna być Webhookiem!`, ephemeral: true })
            return
        }

        await interaction.deferReply({ ephemeral: true })

        const guilsSnpsht = await db.aget(`serverData/${targetMsg.guildId}/gc`)

        // console.log(guilsSnpsht)

        var data
        if (!guilsSnpsht.exists || !(data = Object.values(gcdataGuild.encode(guilsSnpsht.val)).find((v) => v.channel === targetMsg.channelId))) {
            interaction.editReply(`${customEmoticons.denided} Użyto na złym kanale!`)
            return
        }

        if (data.flag_showGCButtons) {
            interaction.editReply(`${customEmoticons.minus} To zostało wyłączone z powodu pokazywania owych przycisków w wiadomościach!`)
            return
        }

        var IDs = [targetMsg.author.username.split("(")[1]?.split(";")[1].trim(), targetMsg.author.username.split("(")[1]?.split(";")[2]?.trim()?.replace(")", "")].filter((x) => x)

        if (IDs.length != 2) {
            interaction.reply({ content: `${customEmoticons.denided} Niepoprawny syntax Webhooka!`, ephemeral: true })
            return
        }

        if (data.createdTimestamp > targetMsg.createdTimestamp) {
            interaction.editReply(`${customEmoticons.denided} Ta wiadomość pochodzi wcześniej od ostatniego podpięcia kanału!`)
            return
        }

        const uData = gcdata.encode((await db.aget(`userData/${interaction.user.id}/gc`)).val)
        if (uData.karma < 25n) {
            interaction.editReply(`${customEmoticons.denided} Aby użyć tego elementu, potrzeba **minimum** 25 karmy`)
            return
        }

        var row = new ActionRowBuilder().setComponents(
            new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId(`gcgi\u0000${IDs[1]}`).setEmoji(`ℹ️`),
            new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId(`gcui\u0000${IDs[0]}`).setEmoji(`👤`)
        )

        if (interaction.user.id !== IDs[0]) row.addComponents(new ButtonBuilder().setStyle(ButtonStyle.Primary).setCustomId(`gctab\u0000${IDs[0]}`).setEmoji("👉"))

        interaction.editReply({
            embeds: [
                new EmbedBuilder().setDescription(
                    'Wybierz przycisk poniżej. Każdy przycisk posiada w sobie funkcję.\n\nℹ️ - Informacje o serwerze\n👤 - Informacje o użytkowniku\n👉 - "Zaczepka", czyli globalowy ping (jeżeli nie wybrałeś siebie)'
                ),
            ],
            components: [row],
            ephemeral: true,
        })
    },
}
