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
        var user = interaction.options.get("osoba", true).user
        await interaction.deferReply()
        var snapshot = db.get(`userData/${user.id}/gc`)

        if (!snapshot.exists) var msg = `Jest zablokowany: ${customEmoticons.minus} (nie zarejestrowany)`
        else {
            var info = gcdata.encode(snapshot.val)
            if (info.isBlocked) {
                var msg = `Jest zablokowany: ${customEmoticons.approved}\nPowód blokady: ${info.blockReason === "" ? customEmoticons.minus : "```" + info.blockReason + "```"}`
            } else var msg = `Jest zablokowany: ${customEmoticons.denided}`
        }

        var embed = new EmbedBuilder()
            .setAuthor({
                name: (user.discriminator = "0" ? user.username : `${user.username}#${user.discriminator}`),
                iconURL: user.displayAvatarURL({ size: 256 }),
            })
            .setTitle("Informacje o blokadzie")
            .setDescription(msg)
            .setColor(typeof user.hexAccentColor !== "undefined" ? user.hexAccentColor : null)
        interaction.editReply({
            embeds: [embed],
        })
    },
}
