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
        if (!snpsht.exists) {
            if (user.id == interaction.user.id)
                interaction.editReply(`${customEmoticons.minus} Nie masz profilu, aby wyświetlić kartę...\n${customEmoticons.info} Załóż pod \`profil utwórz typ:ImaCarrrd\``)
            else interaction.editReply(`${customEmoticons.minus} Ta osoba nie ma profilu!`)
            return
        }
        var data = imacaData.encode(snpsht.val)

        const attachment = await imacaInfo.createCarrrd(data, user)

        interaction.editReply({ files: [attachment] })
    },
}
