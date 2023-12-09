const { Client, CommandInteraction } = require("discord.js")
const { customEmoticons } = require("../../config")

module.exports = {
    emoticons: [
        { savenames: ["pixel.kekw", "px.kekw"], emote: "<:PX_kekw:1182025687566123078>" },
        {
            savenames: ["pixel.pepeWithGun", "px.pepeWithGun", "pixel.pepewgun", "px.pepewgun", "pixel.pepegun", "px.pepegun"],
            emote: "<:PX_pepeWithGun:1174022124000792639>",
        },
        {
            savenames: [
                "pixel.pepeDancingWithLightSabers",
                "px.pepeDancingWithLightSabers",
                "pixel.pepedancewsabers",
                "px.pepedancewsab",
                "pixel.pepedancels",
                "px.pepedancels",
                "pixel.pepels",
                "px.pepels",
            ],
            emote: "<a:PX_pepeDancingWithLightSabers:1182025312188506112>",
        },
        { savenames: ["pixel.sunglasses", "px.sunglasses"], emote: "<:PX_sunglasses:1182025558591283200>" },
        {
            savenames: ["pixel.pressFtoPayRespect", "px.pressFtoPayRespect", "pixel.fFlag", "px.fFlag"],
            emote: "<a:PX_fFlag:1182024906947432569>",
        },
        {
            savenames: ["pixel.hearts", "px.hearts"],
            emote: "<:serducha:1092490017500315751>",
            server: { id: "1091809406078943422", iCode: "YhQRbnCKCF" },
        },
        {
            savenames: ["pixel.iLoveYou", "px.iLoveYou", "pixel.ilvu", "px.ilvu"],
            emote: "<a:I3U:1079115912520663152>",
            server: { id: "1034494983102791802", iCode: "X7HNvaFZ" },
        },
        {
            savenames: ["minecraft.parrotRainbowDance", "mc.parrotRainbowDance", "minecraft.parrotdance+", "mc.parrotdance+"],
            emote: "<a:minecraftpapuga:1110643419023417395>",
            server: { id: "1044423105185075270", iCode: "xSKaqGy6Bp" },
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
                return `\n${x.emote} - \`${x.savenames[0]}\` (aliasy: \`${x.savenames.filter((x, i) => i > 0).join("`, `")}\`)${
                    typeof x.server === "undefined" ? "" : ` *//ze serwera [${client.guilds.cache.get(x.server.id).name}](<https://discord.gg/${x.server.iCode}>)*`
                }`
            })}`
        )
    },
}
