const { CommandInteraction, Client } = require("discord.js")
const imacaInfo = require("../../functions/imaca")
const { db, customEmoticons } = require("../../config")
const { imacaData } = require("../../functions/dbs")
const { checkUserInSupport } = require("../../functions/useful")

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        var user = interaction.options.get("osoba")?.user || interaction.user

        await interaction.deferReply()
        if (!(await checkUserInSupport(client, user.id))) {
            if (user.id == interaction.user.id)
                interaction.editReply(
                    `${customEmoticons.info} Aby móc korzystać z całego potencjału ImaCarrrd, musisz dołączyć na serwer support! Możesz znaleźć link pod \`botinfo\`.`
                )
            else interaction.editReply(`${customEmoticons.minus} Ta osoba na tą chwilę nie ma dostępu do ImaCarrrd!`)

            return
        }
        var snpsht = db.get(`userData/${user.id}/imaca`)
        var data = imacaData.encode(snpsht.val)

        const attachment = await imacaInfo.createCarrrd(data, user)

        interaction.editReply({ files: [attachment] })
    },
}
