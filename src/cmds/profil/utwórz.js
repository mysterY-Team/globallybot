const { CommandInteraction, Client } = require("discord.js")
const { getDatabase, ref, get, set } = require("@firebase/database")
const { firebaseApp, customEmoticons, _bot } = require("../../config")
const { gcdata } = require(`../../functions/dbs`)

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        await interaction.deferReply({
            ephemeral: true,
        })
        var snpsht = await get(ref(getDatabase(firebaseApp), `${_bot.type}/userData/${interaction.user.id}/${interaction.options.get("typ", true).value}`))
        if (snpsht.exists()) return interaction.editReply(`${customEmoticons.denided} Ty już masz ten profil utworzony!`)

        var structure
        var name
        var addMoreWordsAbout = ""
        switch (interaction.options.get("typ", true).value) {
            case "gc": {
                structure = gcdata.decode(
                    gcdata.create(`${interaction.user.createdAt.getFullYear()}-${interaction.user.createdAt.getMonth() + 1}-${interaction.user.createdAt.getDate()}`)
                )
                name = "GlobalChat"
                addMoreWordsAbout =
                    "Pamiętaj o przestrzeganiu regulaminu - znajdziesz pod komendą `globalchat regulamin`. Weryfikacja wieku powinna być kierowana do użytkownika *patyczakus* na PV/DM!"
                break
            }
            case "imaca": {
                structure = imacaData.decode(imacaData.create())
                name = "ImaCarrrd"
            }
        }
        await set(ref(getDatabase(firebaseApp), `${_bot.type}/userData/${interaction.user.id}/${interaction.options.get("typ", true).value}`), structure)
        interaction.editReply(
            `${customEmoticons.approved} Dodano pomyślnie profil do usługi *${name}*${addMoreWordsAbout === "" ? "" : `\n${customEmoticons.info} ${addMoreWordsAbout}`}`
        )
    },
}
