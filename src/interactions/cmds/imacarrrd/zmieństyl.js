import djs from "discord.js"
const { Client, ChatInputCommandInteraction, AutocompleteFocusedOption } = djs
import conf from "../../../config.js"
const { customEmoticons, db } = conf
import { imacaData } from "../../../functions/dbSystem.js"
import { classes } from "../../../functions/imaca.js"

export default {
    /**
     * @param {import("discord.js").AutocompleteFocusedOption} acFocusedInformation
     * @param {import("discord.js").Client<true>} client
     */
    autocomplete(acFocusedInformation, client) {
        return classes
            .filter((x) => {
                if (x.name.toLowerCase().includes(acFocusedInformation.value.toLowerCase())) return true
                if (x.author.toLowerCase() == x.author) return true
            })
            .filter((x, i) => i < 25)
            .map((x, i) => {
                return { name: x.toString(), value: i.toString() }
            })
    },
    /**
     *
     * @param {import("discord.js").Client} client
     * @param {import("discord.js").ChatInputCommandInteraction} interaction
     */
    async execute(client, interaction) {
        const receivedVal = interaction.options.get("styl", true).value
        let sid = classes.findIndex((x) => x.name == receivedVal)
        if (sid === -1 && !classes[receivedVal]) {
            return interaction.reply({ content: `${customEmoticons.denided} Ten styl nie istnieje!`, ephemeral: true })
        }
        if (sid === -1) sid = Number(receivedVal)

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
