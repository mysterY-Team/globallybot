const { Client, CommandInteraction } = require("discord.js")
const { customEmoticons } = require("../config")

module.exports = {
    emoticons: [
        { savenames: ["pixel.kekw", "px.kekw"], emote: "<:PX_kekw:1174785945875259402>" },
        {
            savenames: ["pixel.pepeWithGun", "px.pepeWithGun", "pixel.pepewgun", "px.pepewgun", "pixel.pepegun", "px.pepegun"],
            emote: "<:PX_pepeWithGun:1174022124000792639>",
        },
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        interaction.reply(
            `# Cała lista globalnych emotek\n${customEmoticons.info} Użycie: \`{e:<nazwa>}\` lub \`{emote:<nazwa>}\`\n${this.emoticons.map((x) => {
                return `\n${x.emote} - \`${x.savenames[0]}\` (aliasy: \`${x.savenames
                    .filter((x, i) => i > 0)
                    .map((x) => x)
                    .join("`, `")}\`)`
            })}`
        )
    },
}
