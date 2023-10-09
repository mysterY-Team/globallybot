//szkielet komendy, jak w całym folderze ./cmds
const { CommandInteraction, Client, EmbedBuilder } = require("discord.js")
const fs = require("fs")
const { customEmoticons } = require("../config")

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        var embeds = []
        fs.readdirSync("./src/globalactions/")
            .filter((x) => x.endsWith(".js"))
            .map((x) => {
                const file = require("../globalactions/" + x)

                embeds.push(
                    new EmbedBuilder()
                        .setTitle(`${file.data.name}`)
                        .setThumbnail(file.data.avatar)
                        .setDescription(file.data.description)
                        .addFields({ name: "Nazwa wywoławcza", value: `\`${x.replace(".js", "")}\`` })
                        .setColor("Random")
                )
            })

        return interaction.reply({
            content: `${customEmoticons.info} Aby użyć GlobalAction, należy postępować zgodnie z tym przepisem:\`\`\`<nazwa wywoławcza>, <skierowanie do akcji>\`\`\`\n||Przecinek jest ważny, inaczej nie wykona||`,
            embeds: embeds,
        })
    },
}
