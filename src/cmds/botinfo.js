const { CommandInteraction, Client, EmbedBuilder } = require("discord.js")
const { customEmoticons } = require("../config")
const { codeTime } = require("..")

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
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
            .setDescription(
                "Dodaj bota: [link](https://discord.com/oauth2/authorize?client_id=1173359300299718697)\nSerwery: [support (główny)](https://discord.gg/xnMmFejNgz) | [*Server Type-Y* (poboczny)](https://discord.gg/7S3P2DUwAm)"
            )
            .addFields(
                {
                    name: "Czasy",
                    value: `Uruchomienia bota: <t:${time}:F> (<t:${time}:R>)\nGotowości bota: <t:${readyTime}:F> (<t:${readyTime}:R>)`,
                    inline: false,
                },
                {
                    name: "Serwery",
                    value: `Ilość: ${client.guilds.cache.size}\nIlość osób: ${uCount}\nNazwy: ||Wyświetlane są max. 10 serwerów|| \`\`\`${guildsName}\`\`\``,
                    inline: false,
                }
            )
            .setFooter({ text: "Globally, powered by patYczakus" })
            .setColor("Yellow")

        interaction.reply({
            content: "",
            embeds: [embed],
        })
    },
}
