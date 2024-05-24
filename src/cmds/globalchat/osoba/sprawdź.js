const { CommandInteraction, Client, EmbedBuilder } = require("discord.js")
const { db, customEmoticons } = require("../../../config")
const { gcdata } = require("../../../functions/dbs")

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        await interaction.deferReply()
        var snapshot = db.get(`userData/${interaction.options.getUser("osoba", true).id}/gc`)

        if (!snapshot.exists) var msg = `Jest zablokowany: ${customEmoticons.minus} (brak profilu)`
        else {
            var info = gcdata.encode(snapshot.val)
            if (info.isBlocked) {
                var msg = `Jest zablokowany: ${customEmoticons.approved}\nPowód blokady: ${info.blockReason === "" ? customEmoticons.minus : "```" + info.blockReason + "```"}`
            } else var msg = `Jest zablokowany: ${customEmoticons.denided}`
        }

        var embed = new EmbedBuilder()
            .setAuthor({
                name: (interaction.options.getUser("osoba", true).discriminator = "0"
                    ? interaction.options.getUser("osoba", true).username
                    : `${interaction.options.getUser("osoba", true).username}#${interaction.options.getUser("osoba", true).discriminator}`),
                iconURL: interaction.options.getUser("osoba", true).displayAvatarURL({ size: 256 }),
            })
            .setTitle("Informacje o blokadzie")
            .setDescription(msg)
            .setColor(typeof interaction.options.getUser("osoba", true).hexAccentColor !== "undefined" ? interaction.options.getUser("osoba", true).hexAccentColor : null)
        interaction.editReply({
            embeds: [embed],
        })
    },
}
