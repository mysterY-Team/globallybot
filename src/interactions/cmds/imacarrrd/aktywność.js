import djs from "discord.js"
import conf from "../../../config.js"
const { customEmoticons, db } = conf
import { imacaData } from "../../../functions/dbSystem.js"

export default {
    /**
     *
     * @param {import("discord.js").Client} client
     * @param {import("discord.js").ChatInputCommandInteraction} interaction
     */
    async execute(client, interaction) {
        const receivedVal = interaction.options.get("opcja", true).value

        await interaction.deferReply()

        var snpsht = await db.get(`userData/${interaction.user.id}/imaca`)
        var data = imacaData.encode(snpsht.val)

        if (data.showStatusAndActivity == receivedVal) return interaction.editReply(`${customEmoticons.minus} Nic nie zmieniono, wartość jest taka sama jak argument.`)
        data.showStatusAndActivity = receivedVal

        await db.get(`userData/${interaction.user.id}/imaca`, imacaData.decode(data))

        if (!receivedVal)
            interaction.editReply(
                `${customEmoticons.approved} Poprawnie zapisano dane!\n-# Ta komenda została wprowadzona na rzecz intencji "Aktywność". Rozumiemy, że dbasz o swoje bezpieczeństwo, lecz zalecamy ustawić tą opcję na włączoną - gwarantujemy, że żadne dane tego typu **nie zostają __nigdzie__ zapisywane**.`
            )
        else
            interaction.editReply(
                `${customEmoticons.approved} Poprawnie zapisano dane!\n-# Ta komenda została wprowadzona na rzecz intencji "Aktywność". Dziękujemy, że włączasz tą opcję z powrotem - dzięki temu Twoja karta staje się o wiele lepsza!`
            )
    },
}
