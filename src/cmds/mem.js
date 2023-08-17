const axios = require("axios")
const cheerio = require("cheerio")
const {
    CommandInteraction,
    Client,
    EmbedBuilder,
    AttachmentBuilder,
} = require("discord.js")
const { customEmoticons } = require("../config")

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        //var ID = interaction.options.get("źródło", true).value
        const configMeme = [
            {
                web: "https://memy.pl/losuj",
                text: "Memy.pl",
                booleanReturns: {
                    img: ".meme-primary article.meme-item.meme-preview figure a img",
                    vid: ".meme-primary article.meme-item.meme-preview figure a video source",
                },
            },
            /*{
                web: "https://kwejk.pl/losowy",
                text: "Kwejk.pl",
                booleanReturns: {
                    img: ".wrapper.content-wrapper section article .article-content .article-image img",
                    vid: ".wrapper.content-wrapper section article .article-content .article-image .video-player .plyr__video-wrapper video source",
                },
            },
            {
                web: "https://jbzd.com.pl/losowe",
                text: "JBZD",
                booleanReturns: {
                    img: ".media-element-wrapper .figure-holder figure img",
                    vid: ".media-element-wrapper .figure-holder figure .plyr__video-wrapper video source",
                },
            },*/
        ]
        //if (ID == -1) ID = Math.floor(Math.random() * configMeme.length)
        ID = 0

        interaction
            .reply({
                content: customEmoticons.loading,
            })
            .then(() => {
                try {
                    axios.get(configMeme[ID].web).then((response) => {
                        let $ = cheerio.load(response.data)
                        //najpierw pobiera elementy configMeme[ID].booleanReturns.img do odpowiedniej zmiennej i sprawdza, czy istnieje. Jeżeli nie, to pobiera z configMeme[ID].booleanReturns.vid. Potem pobiera proporcje elementu "src"
                        var element = $(configMeme[ID].booleanReturns.img)
                        if (element == null)
                            element = $(configMeme[ID].booleanReturns.vid)
                        var embed = new EmbedBuilder()
                            .setDescription(
                                `### ${customEmoticons.info} Żródło mema: [${configMeme[ID].text}](${configMeme[ID].web})`
                            )
                            .setColor("White")

                        var src = element.attr("src")

                        interaction.editReply({
                            content: "",
                            files: [src],
                            embeds: [embed],
                        })
                    })
                } catch (error) {
                    console.error("Wystąpił błąd:", error)
                    interaction.editReply({
                        content: `${customEmoticons.denided} Nie udało się pobrać mema`,
                    })
                }
            })
    },
}
