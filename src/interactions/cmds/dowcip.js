const cheerio = require("cheerio")
const { ChatInputCommandInteraction, Client, EmbedBuilder } = require("discord.js")
const { customEmoticons } = require("../../config")
const { request } = require("undici")

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(client, interaction) {
        await interaction.deferReply()
        try {
            var response = await request("https://perelki.net/random")
            const $ = cheerio.load(await response.body.text())
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
            interaction.editReply({
                content: `${customEmoticons.denided} Nie udało się pobrać dowcipu`,
            })
            throw console.error(error)
        }
    },
}
