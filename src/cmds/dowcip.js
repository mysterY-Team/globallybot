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
        interaction
            .reply({
                content: customEmoticons.loading,
            })
            .then(() => {
                try {
                    axios.get("https://perelki.net/random").then((response) => {
                        const $ = cheerio.load(response.data)
                        $(".content .container:not(.cntr) .about").remove()
                        var joke = $(".content .container:not(.cntr)")
                            .html()
                            .replace(/<br>/g, "\n")
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
                    })
                } catch (error) {
                    console.error("Wystąpił błąd:", error)
                    interaction.editReply({
                        content: `${customEmoticons.denided} Nie udało się pobrać dowcipu`,
                    })
                }
            })
    },
}
