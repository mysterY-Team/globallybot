const { Client, ButtonInteraction } = require("discord.js")
const { customEmoticons, firebaseApp, _bot } = require("../config")
const { get, ref, getDatabase } = require("@firebase/database")
const { gcdata } = require("../functions/dbs")

module.exports = {
    /**
     * @param {Client} client
     * @param {ButtonInteraction} interaction
     * @param {string[]} args
     */
    async execute(client, interaction, ...args) {
        if (args[0] !== interaction.user.id) {
            return interaction.reply({
                content: `${customEmoticons.denided} Nie jesteś właścicielem wiadomości!`,
                ephemeral: true,
            })
        }
        const comp = interaction.message.components
        await interaction.deferReply({
            ephemeral: true,
        })
        const msgid = interaction.message.id
        const snpsht = await get(ref(getDatabase(firebaseApp), `${_bot.type}/userData/${interaction.user.id}/gc`))
        var data = gcdata.encode(snpsht.val())

        data.messagesToDelete = data.messagesToDelete.split("|")
        if (!data.messagesToDelete.includes(`${interaction.guildId}/${interaction.channelId}/${msgid}`)) {
            interaction.editReply("Możliwość usunięcia tej wiadomości wygasła!")
            return
        }
    },
}
