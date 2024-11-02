import djs from "discord.js"
const { Client, ChatInputCommandInteraction, AutocompleteFocusedOption } = djs
import conf from "../../../config.js"
const { customEmoticons, db } = conf
import { imacaData } from "../../../functions/dbSystem.js"
import { classes } from "../../../functions/imaca.js"

export default {
    /**
     * @param {AutocompleteFocusedOption} acFocusedInformation
     * @param {Client<true>} client
     */
    autocomplete(acFocusedInformation, client) {
        var options = classes.map((x, i) => {
            return { name: x.name, value: i.toString() }
        })
        options = options.filter((x) => x.name.toLowerCase().includes(acFocusedInformation.value.toLowerCase())).filter((x, i) => i < 25)
        return options
    },
    /**
     *
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(client, interaction) {
        const receivedVal = interaction.options.get("styl", true).value
        const sid = classes.map((x) => x.name).indexOf(receivedVal)
        if (sid === -1 && !classes[receivedVal]) {
            return interaction.reply({ content: `${customEmoticons.denided} Ten styl nie istnieje!`, ephemeral: true })
        }

        await interaction.deferReply()

        var snpsht = await db.aget(`userData/${interaction.user.id}/imaca`)
        var data = imacaData.encode(snpsht.val)

        data.cardID = sid
        data.description = data.description.replace(/\n/g, " ")

        await db.aset(`userData/${interaction.user.id}/imaca`, imacaData.decode(data))

        interaction.editReply(
            `${customEmoticons.approved} Zmieniono styl karty\n${customEmoticons.info} Aby uniknąć ewentualnych problemów renderowania, zamieniono wszystkie nowe linie spacjami. Możesz uruchomić ponownie komendę \`imacarrrd konfiguruj\` i zedytować swój opis`
        )
    },
}
