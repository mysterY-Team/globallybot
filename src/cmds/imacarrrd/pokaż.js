const { CommandInteraction, Client } = require("discord.js")
const imacaInfo = require("../../functions/imaca")
const { db, customEmoticons } = require("../../config")
const { imacaData } = require("../../functions/dbs")

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        var user = interaction.options.get("osoba")?.user || interaction.user

        await interaction.deferReply()
        var snpsht = db.get(`userData/${user.id}/imaca`)
        var data = imacaData.encode(snpsht.val)

        const attachment = await imacaInfo.createCarrrd(data, user)

        interaction.editReply({ files: [attachment] })
    },
}
