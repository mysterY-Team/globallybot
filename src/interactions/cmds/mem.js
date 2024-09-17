const { ChatInputCommandInteraction, Client, EmbedBuilder } = require("discord.js")
const { Octokit } = require("@octokit/rest")
const { customEmoticons } = require("../../config")

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(client, interaction) {
        await interaction.deferReply()
        try {
            const octokit = new Octokit()
            const { data } = await octokit.repos.getContent({ owner: "patYczakus", repo: "Memhub-API-filesystem", path: "images" })
            var files = data.filter((it) => it.type == "file").map((it) => it.name)
            files = files[Math.floor(Math.random() * files.length)]

            interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setImage("https://raw.githubusercontent.com/patYczakus/Memhub-API-filesystem/main/images/" + files)
                        .setColor("Random")
                        .setFooter({ text: "Źródło: Memhub (repo patYczakus/Memhub-API-filesystem)" }),
                ],
            })
        } catch (error) {
            interaction.editReply({
                content: `${customEmoticons.denided} Nie udało się pobrać mema`,
            })
            throw console.error(error)
        }
    },
}
