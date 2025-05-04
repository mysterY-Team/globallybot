import djs from "discord.js"
/** @type {{ GuildMember: import("discord.js").GuildMember }} */
const { GuildMember } = djs
import { createCarrrd } from "../../../functions/imaca.js"
import conf from "../../../config.js"
const { db } = conf
import { imacaData } from "../../../functions/dbSystem.js"

export default {
    /**
     *
     * @param {import("discord.js").Client} client
     * @param {import("discord.js").ChatInputCommandInteraction} interaction
     */
    async execute(client, interaction) {
        const option = interaction.options.get("osoba")
        /**
         * @type {import("discord.js").User}
         */
        var user
        /**
         * @type {import("discord.js").GuildMember | import("discord.js").APIInteractionGuildMember | null | undefined}
         */
        var member

        if (option) {
            user = option.user
            member = option.member
        } else {
            user = interaction.user
            member = interaction.member
        }

        await interaction.deferReply()
        var snpsht = await db.aget(`userData/${user.id}/imaca`)
        var data = imacaData.encode(snpsht.val)

        const attachment = await createCarrrd(data, [user, member])

        interaction.editReply({ files: [attachment] })
    },
}
