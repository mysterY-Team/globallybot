const { ChatInputCommandInteraction, Client, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require("discord.js")
const { db, customEmoticons } = require("../../../../config")
const { servers, repeats } = require("../../../../functions/useful")

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(client, interaction) {
        const stationsMakers = Object.values(db.get("stations").val || {}).map((x) => x.split("|")[0])
        if (Object.keys(repeats(stationsMakers)).length >= servers.get().length) {
            return interaction.reply({
                content: `${customEmoticons.minus} Stacji jest już za dużo, spróbuj ponownie później!`,
                ephemeral: true,
            })
        }

        const modal = new ModalBuilder()
            .setTitle("Konfiguracja stacji GC")
            .setCustomId("requeststation")
            .addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setStyle(TextInputStyle.Short)
                        .setCustomId("id")
                        .setRequired(true)
                        .setLabel("Podaj przyjazne ID stacji")
                        .setMinLength(4)
                        .setMaxLength(8)
                        .setPlaceholder("Litery, cyfry, myślniki i podłogi")
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setStyle(TextInputStyle.Short)
                        .setCustomId("passwd")
                        .setRequired(false)
                        .setLabel("Podaj hasło dla stacji")
                        .setPlaceholder("Puste oznacza brak hasła")
                        .setMinLength(8)
                        .setMaxLength(30)
                )
            )

        interaction.showModal(modal)
    },
}
