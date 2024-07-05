const { CommandInteraction, Client, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js")
const { db, customEmoticons } = require("../../config")
const { imacaData } = require("../../functions/dbs")

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        var snpsht = db.get(`userData/${interaction.user.id}/imaca`)
        var data = imacaData.encode(snpsht.val)
        const modal = new ModalBuilder()
            .setTitle("Edycja informacji ImaCarrrd")
            .setCustomId(`imacaedit\u0000${interaction.user.id}`)
            .setComponents(
                new ActionRowBuilder().setComponents(
                    new TextInputBuilder()
                        .setCustomId("name")
                        .setMinLength(3)
                        .setMaxLength(24)
                        .setLabel("Podaj swoją unikalną nazwę")
                        .setRequired(true)
                        .setValue(data.name)
                        .setPlaceholder("Może to być imię, nick, pseudonim etc.")
                        .setStyle(TextInputStyle.Short)
                ),
                new ActionRowBuilder().setComponents(
                    new TextInputBuilder()
                        .setCustomId("description")
                        .setMinLength(10)
                        .setMaxLength(1024)
                        .setLabel("Opisz siebie")
                        .setPlaceholder("Możesz dawać prawie wszystkie znaki")
                        .setRequired(true)
                        .setValue(data.description)
                        .setStyle(TextInputStyle.Paragraph)
                ),
                new ActionRowBuilder().setComponents(
                    new TextInputBuilder()
                        .setCustomId("gradient1")
                        .setLabel("Podaj HEX koloru #1 do gradientu")
                        .setPlaceholder("(#)RRGGBB")
                        .setMinLength(6)
                        .setMaxLength(7)
                        .setRequired(true)
                        .setValue(data.nameGradient1)
                        .setStyle(TextInputStyle.Short)
                ),
                new ActionRowBuilder().setComponents(
                    new TextInputBuilder()
                        .setCustomId("gradient2")
                        .setLabel("Podaj HEX koloru #2 do gradientu")
                        .setPlaceholder("(#)RRGGBB")
                        .setMinLength(6)
                        .setMaxLength(7)
                        .setRequired(true)
                        .setValue(data.nameGradient2)
                        .setStyle(TextInputStyle.Short)
                ),
                new ActionRowBuilder().setComponents(
                    new TextInputBuilder()
                        .setCustomId("imgurl")
                        .setLabel("Podaj URL bannera")
                        .setPlaceholder("Optymalnie 700x300")
                        .setStyle(TextInputStyle.Short)
                        .setRequired(false)
                        .setValue(data.bannerURL ?? "")
                )
            )
        interaction.showModal(modal)
    },
}
