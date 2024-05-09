const axios = require("axios")
const cheerio = require("cheerio")
const { CommandInteraction, Client, EmbedBuilder } = require("discord.js")
const { customEmoticons } = require("../config")

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        await interaction.deferReply()
        try {
            var response = await axios.get("https://perelki.net/random")
            const $ = cheerio.load(response.data)
            $(".content .container:not(.cntr) .about").remove()
            var joke = $(".content .container:not(.cntr)")
                .html()
                .replace(/<br>|<br \/>/g, "\n")
                .replace(/\*/g, "\\*")
                .replace(/_/g, "\\_")
                .replace(/~/g, "\\~")
                .replace(/#/g, "\\#")
                .replace(/@/g, "\\@")
                .trim()
            joke = joke
                .split("\n")
                .filter((line) => line != "")
                .join("\n")

            const embed = new EmbedBuilder()
                .setDescription(joke)
                .setFooter({
                    text: "Źródło: perelki.net",
                })
                .setColor("Random")

            interaction.editReply({
                content: null,
                embeds: [embed],
            })
        } catch (error) {
            console.warn("Wystąpił błąd:", error)
            interaction.editReply({
                content: `${customEmoticons.denided} Nie udało się pobrać dowcipu`,
            })
        }
    },
}
