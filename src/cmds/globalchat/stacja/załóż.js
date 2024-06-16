const { CommandInteraction, Client, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require("discord.js")
const { db, customEmoticons } = require("../../../config")

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        var snpsht = db.get(`userData/${interaction.user.id}/gc`)
        if (!snpsht.exists) {
            return interaction.reply({
                content: `${customEmoticons.info} Do konfiguracji potrzebny jest profil - \`profil utwórz typ:GlobalChat\``,
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
