const { Client, ButtonInteraction, EmbedBuilder } = require("discord.js")

module.exports = {
    /**
     * @param {Client} client
     * @param {ButtonInteraction} interaction
     * @param {string[]} args
     */
    async execute(client, interaction, ...args) {
        await interaction.deferReply({ ephemeral: true })
        var server = await client.guilds.fetch(args[0])
        var sowner = await server.fetchOwner()
        const allEmotes = (await server.emojis.fetch()).map((em) => `<${em.animated ? "a" : ""}:${em.name}:${em.id}>`).sort(() => Math.random() - 0.5)
        var showedEmotes = allEmotes
        var moreEmojis = false
        if (showedEmotes.length > 6) {
            showedEmotes = showedEmotes.filter((X, i) => i < 6)
            moreEmojis = true
        }
        delete server

        var embed = new EmbedBuilder()
            .setAuthor({ name: server.name })
            .setTitle("Informacje o serwerze owej wiadomości")
            .setThumbnail(server.iconURL({ extension: "webp", size: 1024 }))
            .setDescription(
                `${server.description ? "> " + server.description + "\n\n" : ""}ID serwera: \`${args[0]}\`\nIlość osób: **${server.memberCount}**\nPoziom boosta: ${
                    server.premiumTier
                }`
            )
            .setFields(
                {
                    name: "Właściciel/-ka",
                    value: `<@${sowner.id}>\nNick: ${sowner.user.discriminator === "0" ? sowner.user.username : sowner.user.username + "#" + sowner.user.discriminator}\nID: \`${
                        sowner.id
                    }\``,
                    inline: true,
                },
                {
                    name: "Serwer w czasie",
                    value: `Stworzenie serwera: **<t:${Math.floor(server.createdTimestamp / 1000)}:R>**\nDodanie bota: **<t:${Math.floor(server.joinedTimestamp / 1000)}:R>**`,
                    inline: true,
                },
                {
                    name: "Emotki",
                    value: `${showedEmotes.join(" | ")}\nIlość emotek: ${allEmotes.length}\n*Możesz użyć komendy \`globalchat emotki query:serwer=${
                        args[0]
                    }\` w celu dodatkowych informacji*`,
                    inline: false,
                }
            )
            .setColor("Random")
        interaction.editReply({ embeds: [embed] })
    },
}
