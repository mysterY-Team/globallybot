const { ChatInputCommandInteraction, Client } = require("discord.js")
const { customEmoticons, db } = require("../../../config")
const fs = require("fs")
module.exports = {
    /**
     *
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(client, interaction) {
        let textes = fs.readFileSync("src/others/regulamingc.txt")
        if (typeof textes === "object") textes = textes.toString("utf-8")
        textes = textes
            .replace(/{{custom:([a-zA-Z0-9]+)}}/g, (match, arg1) => {
                return customEmoticons[arg1]
            })
            .split("#--#")

        await interaction.reply(textes[0])
        for (let i = 1; i < textes.length; i++) {
            try {
                if (interaction.channel !== null) await interaction.channel.send(textes[i])
                else await interaction.user.send(textes[i])
            } catch (e) {
                try {
                    await interaction.followUp(textes[i])
                } catch (f) {
                    await interaction.editReply("Nie udało się wysłać reszty regulaminu!")
                }
            }
        }
    },
}
