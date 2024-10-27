import djs from "discord.js"
const { ChatInputCommandInteraction, Client, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = djs
import conf from "../../../config.js"
const { db, customEmoticons } = conf
import { imacaData } from "../../../functions/dbSystem.js"

export default {
    /**
     *
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    execute: async function (client, interaction) {
        function getRandomizedFunction() {
            var data = ["(#)RRGGBB", "$theme", "$frand", "$random"]
            return data[Math.floor(Math.random() * data.length)]
        }

        var snpsht = db.get(`userData/${interaction.user.id}/imaca`)
        var data = imacaData.encode(snpsht.val)

        const imacaName = new TextInputBuilder()
            .setCustomId("name")
            .setMinLength(3)
            .setMaxLength(24)
            .setLabel("Podaj swoją unikalną nazwę")
            .setRequired(true)
            .setPlaceholder("Może to być imię, nick, pseudonim etc.")
            .setStyle(TextInputStyle.Short)

        const imacaDescription = new TextInputBuilder()
            .setCustomId("description")
            .setMinLength(10)
            .setMaxLength(1024)
            .setLabel("Opisz siebie")
            .setPlaceholder("Możesz dawać prawie wszystkie znaki")
            .setRequired(true)
            .setStyle(TextInputStyle.Paragraph)

        const imacaGradient1 = new TextInputBuilder()
            .setCustomId("gradient1")
            .setLabel("Podaj HEX lub funkcję koloru #1 do gradientu")
            .setPlaceholder(getRandomizedFunction())
            .setMinLength(6)
            .setMaxLength(7)
            .setRequired(true)
            .setStyle(TextInputStyle.Short)

        const imacaGradient2 = new TextInputBuilder()
            .setCustomId("gradient2")
            .setLabel("Podaj HEX lub funkcję koloru #2 do gradientu")
            .setPlaceholder(getRandomizedFunction())
            .setMinLength(6)
            .setMaxLength(7)
            .setRequired(true)
            .setStyle(TextInputStyle.Short)

        const imacaBanner = new TextInputBuilder()
            .setCustomId("imgurl")
            .setLabel("Podaj URL bannera")
            .setPlaceholder("Optymalnie 700x300")
            .setStyle(TextInputStyle.Short)
            .setRequired(false)

        if (snpsht.exists) {
            imacaName.setValue(data.name)
            imacaDescription.setValue(data.description)
            imacaGradient1.setValue(data.nameGradient1)
            imacaGradient2.setValue(data.nameGradient2)
            imacaBanner.setValue(data.bannerURL ?? "")
        }

        const modal = new ModalBuilder()
            .setTitle("Edycja informacji ImaCarrrd")
            .setCustomId(`imacaedit\u0000${interaction.user.id}`)
            .setComponents(
                new ActionRowBuilder().setComponents(imacaName),
                new ActionRowBuilder().setComponents(imacaDescription),
                new ActionRowBuilder().setComponents(imacaGradient1),
                new ActionRowBuilder().setComponents(imacaGradient2),
                new ActionRowBuilder().setComponents(imacaBanner)
            )
        interaction.showModal(modal)
    },
}