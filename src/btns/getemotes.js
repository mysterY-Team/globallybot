const { Client, ButtonInteraction } = require("discord.js")

module.exports = {
    /**
     * @param {Client} client
     * @param {ButtonInteraction} interaction
     * @param {string[]} args
     */
    async execute(client, interaction, ...args) {
        await interaction.deferReply({ ephemeral: true })
        var server = await client.guilds.fetch(args[0])
        const allEmotes = (await server.emojis.fetch()).map((em) => `<${em.animated ? "a" : ""}:${em.name}:${em.id}>`).sort(() => Math.random() - 0.5)
        var showedEmotes = allEmotes
        var moreEmojis = false
        if (showedEmotes.length > 6) {
            showedEmotes = showedEmotes.filter((X, i) => i < 6)
            moreEmojis = true
        }
        delete server
        interaction.editReply(
            `# ${showedEmotes.join(" | ")}\nID serwera: \`${
                args[0]
            }\`\nWięcej emotek, ich użycie oraz link *w celu posiadania szybkiego dostępu do emotek* znajdziesz pod \`globalchat emotki query:serwer=${args[0]}\`\n`
        )
    },
}
