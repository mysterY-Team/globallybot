const { ChatInputCommandInteraction, Client, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js")
const { db, customEmoticons } = require("../../../config")
const { imacaData } = require("../../../functions/dbSystem")

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(client, interaction) {
        function getRandomizedFunction() {
            var data = ["(#)RRGGBB", "$theme", "$frand", "$random"]
            return data[Math.floor(Math.random() * data.length)]
        }
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
                        .setValue(snpsht.exists ? data.name : "")
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
                        .setValue(snpsht.exists ? data.description : "")
                        .setStyle(TextInputStyle.Paragraph)
                ),
                new ActionRowBuilder().setComponents(
                    new TextInputBuilder()
                        .setCustomId("gradient1")
                        .setLabel("Podaj HEX lub funkcję koloru #1 do gradientu")
                        .setPlaceholder(getRandomizedFunction())
                        .setMinLength(6)
                        .setMaxLength(7)
                        .setRequired(true)
                        .setValue(snpsht.exists ? data.nameGradient1 : "")
                        .setStyle(TextInputStyle.Short)
                ),
                new ActionRowBuilder().setComponents(
                    new TextInputBuilder()
                        .setCustomId("gradient2")
                        .setLabel("Podaj HEX lub funkcję koloru #2 do gradientu")
                        .setPlaceholder(getRandomizedFunction())
                        .setMinLength(6)
                        .setMaxLength(7)
                        .setRequired(true)
                        .setValue(snpsht.exists ? data.nameGradient2 : "")
                        .setStyle(TextInputStyle.Short)
                ),
                new ActionRowBuilder().setComponents(
                    new TextInputBuilder()
                        .setCustomId("imgurl")
                        .setLabel("Podaj URL bannera")
                        .setPlaceholder("Optymalnie 700x300")
                        .setStyle(TextInputStyle.Short)
                        .setRequired(false)
                        .setValue(snpsht.exists ? data.bannerURL ?? "" : "")
                )
            )
        interaction.showModal(modal)
    },
}
