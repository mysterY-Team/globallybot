import djs from "discord.js"
const { ChatInputCommandInteraction, Client } = djs
import imacaInfo from "../../../functions/imaca.js"
import conf from "../../../config.js"
const { db, customEmoticons } = conf
import { imacaData } from "../../../functions/dbSystem.js"

export default {
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
