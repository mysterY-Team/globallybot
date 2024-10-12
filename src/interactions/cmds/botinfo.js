const { ChatInputCommandInteraction, Client, EmbedBuilder } = require("discord.js")
const { customEmoticons } = require("../../config")
const { codeTime } = require("../..")
const { freemem, totalmem } = require("os")

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(client, interaction) {
        const time = Math.floor((Date.now() - codeTime()) / 1000)
        const readyTime = Math.floor(client.readyTimestamp / 1000)
        var guildsName = client.guilds.cache.sort((a, b) => b.memberCount - a.memberCount)
        var i = 0
        guildsName.forEach((guild) => {
            if (i == 0) guildsName = ""
            if (i < 10) guildsName += `${guild.name} (${guild.id}; ${guild.memberCount} osób)\n`
            i++
        })

        var uCount = 0
        client.guilds.cache.forEach((serv) => {
            uCount += serv.memberCount
        })

        var embed = new EmbedBuilder()
            .setTitle(`${customEmoticons.info} Informacje o bocie`)
            .setDescription("Dodaj bota: [link](https://discord.com/oauth2/authorize?client_id=1173359300299718697)\nSerwer support: [link](https://discord.gg/7S3P2DUwAm)")
            .addFields(
                {
                    name: "Czasy",
                    value: `Uruchomienia bota: **<t:${time}:F> (<t:${time}:R>)**\nGotowości bota: **<t:${readyTime}:F> (<t:${readyTime}:R>)**`,
                    inline: false,
                },
                {
                    name: "Pamięci",
                    value: `RAM: **${Math.round(totalmem() * 10 * 2 ** -20) / 10}** MB (**${Math.round(((totalmem() - freemem()) / totalmem()) * 10000) / 100}%** zajęte)`,
                },
                {
                    name: "Serwery",
                    value: `Ilość: **${client.guilds.cache.size}**\nIlość osób: **${uCount}**\nNazwy: ||Wyświetlane są max. 10 serwerów|| \`\`\`${guildsName}\`\`\``,
                    inline: false,
                }
            )
            .setFooter({ text: "Globally, powered by team mysterY | Licensed on GNU GPL v3" })
            .setColor("Yellow")

        interaction.reply({
            content: "",
            embeds: [embed],
        })
    },
}
