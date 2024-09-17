const { ChatInputCommandInteraction, Client } = require("discord.js")
const imacaInfo = require("../../../functions/imaca")
const { db, customEmoticons } = require("../../../config")
const { imacaData } = require("../../../functions/dbSystem")

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
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
