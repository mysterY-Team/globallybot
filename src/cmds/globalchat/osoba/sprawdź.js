const { CommandInteraction, Client, EmbedBuilder } = require("discord.js")
const { getDatabase, ref, get } = require("@firebase/database")
const { firebaseApp, customEmoticons, _bot } = require("../../../config")
const { gcdata } = require("../../../functions/dbs")

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        await interaction.deferReply()
        var snapshot = await get(ref(getDatabase(firebaseApp), `${_bot.type}/userData/${interaction.options.getUser("osoba", true).id}/gc/block`))
        var info = gcdata.encode(snapshot.val())

        if (!snapshot.exists()) var msg = `Jest zablokowany: ${customEmoticons.minus} (brak profilu)`
        else if (info.isBlocked)
            var msg = `Jest zablokowany: ${customEmoticons.approved}\nPowód blokady: ${info.blockReason === "" ? customEmoticons.minus : "```" + info.blockReason + "```"}`
        else var msg = `Jest zablokowany: ${customEmoticons.denided}`

        var embed = new EmbedBuilder()
            .setAuthor({
                name: (interaction.options.getUser("osoba", true).discriminator = "0"
                    ? interaction.options.getUser("osoba", true).username
                    : `${interaction.options.getUser("osoba", true).username}#${interaction.options.getUser("osoba", true).discriminator}`),
                iconURL: interaction.options.getUser("osoba", true).avatarURL({ size: 256 }),
            })
            .setTitle("Informacje o blokadzie")
            .setDescription(msg)
            .setColor(typeof interaction.options.getUser("osoba", true).hexAccentColor !== "undefined" ? interaction.options.getUser("osoba", true).hexAccentColor : null)
        interaction.editReply({
            embeds: [embed],
        })
    },
}
