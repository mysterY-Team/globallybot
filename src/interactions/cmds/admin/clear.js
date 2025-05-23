import djs from "discord.js"
const { ChatInputCommandInteraction, Client } = djs
import conf from "../../../config.js"
const { customEmoticons } = conf
import { wait } from "../../../functions/useful.js"

export default {
    /**
     *
     * @param {import("discord.js").Client} client
     * @param {import("discord.js").ChatInputCommandInteraction} interaction
     */

    async execute(client, interaction) {
        var amount = interaction.options.get("ilość", true).value

        if (!(await interaction.guild.members.fetchMe()).permissions.has("Administrator")) {
            interaction.reply({
                flags: ["Ephemeral"],
                content: `${customEmoticons.info} Ta, jak i inne komendy z kategorii \`admin\` wymagają od bota posiadania permisji "Administrator".`,
            })
        }

        var messages = await interaction.channel.bulkDelete(amount)
        await interaction.reply(`${customEmoticons.approved} Udało się usunąć ${messages.size} wiadomości`)
        await wait(3000)
        interaction.deleteReply()
    },
}
