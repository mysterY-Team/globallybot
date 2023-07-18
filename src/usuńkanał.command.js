const { SlashCommandBuilder } = require("@discordjs/builders")
const { CommandInteraction, Client } = require("discord.js")
const { getDatabase, ref, get, remove } = require("@firebase/database")
const { firebaseApp } = require("./config")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("usuńkanał")
        .setDescription("Usuwa kanał, na którym był globalchat"),
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        interaction.reply("\\🔄️ Sprawdzanie bazy danych...").then(() => {
            get(
                ref(
                    getDatabase(firebaseApp),
                    `globalchat/channels/${interaction.guildId}`,
                ),
            ).then((snapshot) => {
                if (!snapshot.exists())
                    return interaction.editReply(
                        "\\❌ Nie ma ustawionego kanału!",
                    )
                remove(
                    ref(
                        getDatabase(firebaseApp),
                        `globalchat/channels/${interaction.guildId}`,
                    ),
                ).then(() => {
                    interaction.editReply("\\✅ Usunięto poprawnie kanał!")
                })
            })
        })
    },
}
