const { SlashCommandBuilder } = require("@discordjs/builders")
const { CommandInteraction, Client } = require("discord.js")
const { getDatabase, ref, get, set } = require("@firebase/database")
const { firebaseApp } = require("./config")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("konfigurujkanał")
        .setDescription("Konfiguruje kanał do GlobalChata")
        .addChannelOption((option) =>
            option
                .setName("kanał")
                .setDescription("Kanał, na którym ma się znajdywać GlobalChat.")
                .setRequired(true),
        ),
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        var channel = interaction.options.get("kanał", true)
        interaction
            .reply("\\🔄️ Wczytywanie wyniku z bazy danych...")
            .then(() => {
                get(
                    ref(
                        getDatabase(firebaseApp),
                        `globalchat/channels/${interaction.guildId}`,
                    ),
                ).then((snapshot) => {
                    var _bool = snapshot.exists()

                    if (_bool && snapshot.val() == channel.value)
                        return interaction.editReply(
                            "\\❌ Na tym kanale już jest GlobalChat!",
                        )

                    interaction.editReply("\\🔄️ Zapisywanie danych...")
                    set(
                        ref(
                            getDatabase(firebaseApp),
                            `globalchat/channels/${interaction.guildId}`,
                        ),
                        channel.value,
                    ).then(() => {
                        if (!_bool)
                            interaction.editReply(
                                "\\✅ Dodano pomyślnie kanał!",
                            )
                        else
                            interaction.editReply(
                                `:information_source: Jako że ten serwer już miał ustawiony kanał GlobalChata na kanale <#${snapshot.val()}>, spowodowało to nadpis na nowy kanał`,
                            )
                    })
                })
            })
    },
}
