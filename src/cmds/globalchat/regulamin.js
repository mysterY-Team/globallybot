const { CommandInteraction, Client } = require("discord.js")
const { customEmoticons } = require("../../config")
const fs = require("fs")
module.exports = {
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        let textes = fs.readFileSync("src/others/regulamingc.txt")
        if (typeof textes === "object") textes = textes.toString("utf-8")
        textes = textes.split("#--#").map((x) => x.replace(/{{custom\.([a-zA-Z0-9])}}/g, (match, arg1) => customEmoticons[arg1]))

        await interaction.reply(textes[0])
        for (let i = 1; i < textes.length; i++) {
            await interaction.channel.send(textes[i])
        }
    },
}
