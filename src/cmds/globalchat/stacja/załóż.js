const { CommandInteraction, Client, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require("discord.js")
const { db, customEmoticons } = require("../../../config")
const { servers, checkUserInSupport } = require("../../../functions/useful")

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        const repeats = (...args) => {
            const count = {}

            // Iteruj przez wszystkie argumenty
            args.forEach((value) => {
                count[value] = (count[value] || 0) + 1
            })

            // Zlicz ilość powtórzeń dla każdej wartości
            const result = {}
            for (const key in count) {
                if (count.hasOwnProperty(key)) {
                    result[key] = count[key]
                }
            }

            return result
        }

        if (!(await checkUserInSupport(client, interaction.user.id))) {
            return interaction.reply({
                content: `${customEmoticons.info} Aby móc korzystać z całego potencjału GlobalChata, musisz dołączyć na serwer support! Możesz znaleźć link pod \`botinfo\`.`,
                ephemeral: true,
            })
        }
        var snpsht = db.get(`userData/${interaction.user.id}/gc`)
        const stationsMakers = Object.values(db.get("stations").val).map((x) => x.split("|")[0])
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
