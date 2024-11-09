import djs from "discord.js"
const { Client, ButtonInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = djs

import conf from "../../../config.js"
const { _bot } = conf

export default {
    /**
     * @param {Client} client
     * @param {ButtonInteraction} interaction
     * @param {string[]} args
     */
    async execute(client, interaction, ...args) {
        await interaction.deferReply({ ephemeral: true })
        var server = await client.guilds.fetch(args[0])
        var _perms = (await server.members.fetchMe()).permissions
        var sowner = await server.fetchOwner()
        const allEmotes = (await server.emojis.fetch()).map((em) => `<${em.animated ? "a" : ""}:${em.name}:${em.id}>`).sort(() => Math.random() - 0.5)
        var showedEmotes = allEmotes
        const permsToInvite = _perms.has("Administrator") || (_perms.has("CreateInstantInvite") && _perms.has("ManageGuild"))
        if (showedEmotes.length > 6) {
            showedEmotes = showedEmotes.filter((X, i) => i < 15)
        }

        if (server.vanityURLCode) {
            invition = server.vanityURLCode
        }
        if (permsToInvite && !invition) {
            const inv = await server.invites.fetch()
            var invition = inv.map((x) => x).filter((x) => x.inviterId === _bot.id)[0] ?? ""
            var channels = (await server.channels.fetch()).map((x) => x)
            var i = 0
            while (i < channels.length && !invition) {
                try {
                    invition = await server.invites.create(channels[i].id, { maxAge: 0 })
                    invition = invition
                } catch (err) {
                    i++
                }
            }
        }

        const components = !invition
            ? []
            : [new ActionRowBuilder().addComponents([new ButtonBuilder().setStyle(ButtonStyle.Link).setURL(invition.toString()).setLabel("Dołącz do serwera")])]

        var embed = new EmbedBuilder()
            .setAuthor({ name: server.name })
            .setTitle("Informacje o serwerze owej wiadomości")
            .setThumbnail(server.iconURL({ extension: "webp", size: 1024 }))
            .setDescription(
                `${server.description ? "> " + server.description + "\n\n" : ""}ID serwera: \`${args[0]}\`\nIlość osób: **${server.memberCount}**\nPoziom boosta: **${
                    server.premiumTier
                }**`
            )
            .setFields(
                {
                    name: "Właściciel(-ka)",
                    value: `<@${sowner.id}>\nNick: \`${sowner.user.username}\`\nID: \`${sowner.id}\``,
                    inline: true,
                },
                {
                    name: "Serwer w czasie",
                    value: `Stworzenie serwera: **<t:${Math.floor(server.createdTimestamp / 1000)}:R>**\nDodanie bota: **<t:${Math.floor(server.joinedTimestamp / 1000)}:R>**`,
                    inline: true,
                },
                {
                    name: "Emotki",
                    value: `${showedEmotes.join(" | ")}\nIlość emotek: **${allEmotes.length}**\n`,
                    inline: false,
                }
            )
            .setColor("Random")
            .setFooter({ value: "Globally, powered by mysterY" })
        interaction.editReply({ embeds: [embed], components })
    },
}
