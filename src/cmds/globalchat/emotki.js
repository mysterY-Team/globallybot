const { Client, CommandInteraction, AutocompleteFocusedOption } = require("discord.js")
const { customEmoticons } = require("../../config")
const { servers } = require("../../functions/useful")

const ServersNotUsingTheirEmotesFeature = ["1173361427159994478"]

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
            savenames: ["pixel.iLoveYou", "px.iLoveYou", "pixel.ilvu", "px.ilvu"],
            emote: "<a:I3U:1079115912520663152>",
            server: { id: "1034494983102791802", iCode: "2A5FXGAxmw" },
        },
        {
            savenames: ["minecraft.parrotRainbowDance", "mc.parrotRainbowDance", "minecraft.parrotdance+", "mc.parrotdance+"],
            emote: "<a:minecraftpapuga:1110643419023417395>",
            server: { id: "1044423105185075270", iCode: "xSKaqGy6Bp" },
        },
        {
            savenames: ["neko.danceWithLightSaber", "neko.dancewsabers", "neko.dancels"],
            emote: "<a:68325745f4384d44b712783704c1703e:1178798104540086373>",
            server: { id: "1171034775142809611", iCode: "ewjecpVJBT" },
        },
        {
            savenames: ["neko.nosign", "neko.no"],
            emote: "<:NekoNo:1178798122701430826>",
            server: { id: "1171034775142809611", iCode: "ewjecpVJBT" },
        },
        {
            savenames: ["neko.what", "neko.wow"],
            emote: "<:NekoWhat:1179832592569225317>",
            server: { id: "1171034775142809611", iCode: "ewjecpVJBT" },
        },
        {
            savenames: ["neko.gun"],
            emote: "<:NekoGun:1178798009065148456>",
            server: { id: "1171034775142809611", iCode: "ewjecpVJBT" },
        },
        {
            savenames: ["neko.hello", "neko.hi"],
            emote: "<:NekoHi:1179090616265756752>",
            server: { id: "1171034775142809611", iCode: "ewjecpVJBT" },
        },
        {
            savenames: ["neko.bored"],
            emote: "<:NekoBored:1178798615112716361>",
            server: { id: "1171034775142809611", iCode: "ewjecpVJBT" },
        },
        {
            savenames: ["neko.dumb"],
            emote: "<:NekoDumb:1178798715851509824>",
            server: { id: "1171034775142809611", iCode: "ewjecpVJBT" },
        },
        {
            savenames: ["neko.yummy", "neko.horny"],
            emote: "<:NekoHorny:1179832318232367154>",
            server: { id: "1171034775142809611", iCode: "ewjecpVJBT" },
        },
        {
            savenames: ["neko.drink"],
            emote: "<:NekoDrink:1178798178892529704>",
            server: { id: "1171034775142809611", iCode: "ewjecpVJBT" },
        },
        {
            savenames: ["joe.shurg", "joe.idk"],
            emote: "<:joe_shurg:1225854273104117770>",
        },
        {
            savenames: ["joe.stare", "joe.staring"],
            emote: "<:joe_stare:1225854355937296504>",
        },
        {
            savenames: ["joe.swag"],
            emote: "<:joe_swag:1225854488691343520>",
        },
        {
            savenames: ["joe.swag"],
            emote: "<:joe_swag:1225854488691343520>",
        },
        {
            savenames: [
                "genshin.pixelKokomiWithFish",
                "genshin.pxkokomifish",
                "pixel.kokomiWithFish",
                "px.kokomiWithFish",
                "pixel.kokomifish",
                "px.kokomifish",
                "pixel.kokomifish",
            ],
            emote: "<a:Genshin_PX_kokomiWithFish:1225853709729402911>",
        },
        {
            savenames: [
                "genshin.pixelKleeGivingBombGift",
                "genshin.pixelKleeGivingGift",
                "genshin.pixelKleeGivingBomb",
                "genshin.pixelKleeWithGift",
                "genshin.pixelKleeWithBomb",
                "genshin.pxkleegift",
                "pixel.kleeGivingBombGift",
                "px.kleeGivingBombGift",
                "pixel.kleeGivingGift",
                "px.kleeGivingGift",
                "pixel.kleeGivingBomb",
                "px.kleeGivingBomb",
                "pixel.KleeWithGift",
                "px.KleeWithGift",
                "pixel.KleeWithBomb",
                "px.KleeWithBomb",
                "pixel.kleegift",
                "px.kleegift",
            ],
            emote: "<a:Genshin_PX_kleeGivingBombGift:1225853946543865976>",
        },
        {
            savenames: ["minecraft.parrotDance", "mc.parrotDance"],
            emote: "<a:Minecraft_parrotDance:1225857243787034716>",
        },
        {
            savenames: ["pixel.pepeRidingOnSkateboard", "px.pepeRidingOnSkateboard", "pixel.pepeOnSkateboard", "px.pepeOnSkateboard"],
            emote: "<a:PX_pepeOnSkateboard:1225853604179607622>",
        },
        {
            savenames: ["joe.pet"],
            emote: "<a:joe_pet:1225857161213513838>",
        },
        {
            savenames: ["joe.swag+"],
            emote: "<a:joe_swagAnimated:1225854530919338034>",
        },
        {
            savenames: ["smiley.adorable"],
            emote: "<:Smiley_adorable:1225888917996310589>",
        },
        {
            savenames: ["smiley.cat", "smiley.withCat"],
            emote: "<:Smiley_cat:1225889194988015646>",
        },
        {
            savenames: ["smiley.tired", "smiley.deadInside"],
            emote: "<:Smiley_deadInside:1225889381718687844>",
        },
        {
            savenames: ["smiley.goToChurch", "smiley.holy"],
            emote: "<:Smiley_goToChurch:1225888697019531394>",
        },
        {
            savenames: ["smiley.heartEyes"],
            emote: "<:Smiley_heartEyes:1225888806557978735>",
        },
        {
            savenames: ["smiley.kiss"],
            emote: "<:Smiley_kiss:1225888574960963694>",
        },
        {
            savenames: ["smiley.plead"],
            emote: "<:Smiley_plead:1225889465340395571>",
        },
        {
            savenames: ["smiley.sleep"],
            emote: "<:Smiley_sleep:1225889319928205444>",
        },
        {
            savenames: ["smiley.veryHappy"],
            emote: "<:Smiley_veryHappy:1225889042160156714>",
        },
        {
            savenames: ["genshin.scaryPaimonWithKnife", "genshin.scaryPaimon"],
            emote: "<:SCARYEMERGENCYFOOD:1012412288856240148>",
            server: { id: "883761027836178502", iCode: "Dec9wvCaBp" },
        },
    ],

    /**
     * @param {AutocompleteFocusedOption} acFocusedInformation
     * @param {Client<true>} client
     */
    autocomplete(acFocusedInformation, client) {
        var options = this.emoticons.map((x) => x.savenames).flat()
        options.push(
            ...servers
                .get()
                .filter((x) => !ServersNotUsingTheirEmotesFeature.includes(x.id))
                .map((x) => `serwer=${x.id}`)
        )
        options = options.filter((x) => x.includes(acFocusedInformation.value)).filter((x, i) => i < 25)
        return options
    },
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        const queryOption = interaction.options.get("query")
        this.emoticons = this.emoticons.filter((x) => typeof x.server === "undefined" || typeof client.guilds.cache.get(x.server.id) !== "undefined")
        if (!queryOption) {
            interaction.reply({
                content: `# Lista globalnych emotek\n${customEmoticons.info} Użycie: \`{e:<nazwa>}\` lub \`{emote:<nazwa>}\`\n${this.emoticons
                    .sort(() => Math.random() - 0.5)
                    .filter((x, i) => i < 10)
                    .map((x) => {
                        return `\n${x.emote} - \`${x.savenames[0]}\` (aliasy: ${
                            x.savenames.length > 1 ? `${customEmoticons.approved}, ilość: ${x.savenames.length - 1}` : customEmoticons.denided
                        })${typeof x.server === "undefined" ? "" : ` *//ze serwera [${client.guilds.cache.get(x.server.id).name}](<https://discord.gg/${x.server.iCode}>)*`}`
                    })}\n\nTutaj się wyświetla maksymalnie 10 emotek. Możesz użyć parametru \`query\`, aby wyszukać emotki`,
            })
        } else if (queryOption.value.startsWith("serwer=")) {
            const ServersWithTheirEmotesFeature = servers.get().filter((x) => !ServersNotUsingTheirEmotesFeature.includes(x.id))
            const sid = queryOption.value.split("=")[1]

            if (ServersWithTheirEmotesFeature.map((x) => x.id).includes(sid)) {
                await interaction.deferReply()
                var server = await client.guilds.fetch(sid)
                const sName = server.name
                const allEmotes = (await server.emojis.fetch()).map((em) => `<${em.animated ? "a" : ""}:${em.name}:${em.id}>`)
                var showedEmotes = allEmotes
                var moreEmojis = false
                if (showedEmotes.join("--------").length > 1500) {
                    //usunięcie nadmiaru po 1500 znaków
                    showedEmotes = showedEmotes
                        .join("--------")
                        .slice(0, showedEmotes.length - 1500)
                        .split("--------")
                    moreEmojis = true
                    if (!showedEmotes[showedEmotes.length - 1].endsWith(">")) showedEmotes.pop()
                }
                delete server

                interaction.editReply(
                    `## Lista emotek ze serwera *\`${sName}\`*\nUżycie: \`{serverEmote.${sid}:<nazwa emotki>}\` lub \`{se.${sid}:<nazwa emotki>}\`\n${showedEmotes.join(" \\| ")}${
                        moreEmojis ? ` (+${allEmotes.length - showedEmotes.length} emotek)` : ""
                    }`
                )
            } else {
                interaction.reply(`${customEmoticons.denided} Nie widzę takiego serwera. Odświeżę teraz listę serwerów, a Ty spróbuj użyć komendy ponownie!`)
                servers.fetch(client)
            }
        } else {
            const queryVal = queryOption.value
            var query = this.emoticons.filter((x) => {
                var have = false
                x.savenames.forEach((savename) => {
                    have ||= savename.includes(queryVal)
                })

                return have
            })

            if (query.length == 0) {
                interaction.reply(`${customEmoticons.denided} Niestety, ta emotka nie istnieje w bazie danych lub jest niedostępna`)
            } else if (query.length == 1) {
                const em = query[0]
                interaction.reply(
                    `# Emotka ${em.emote} jako \`{emote:${em.savenames[0]}}\`\nAlternatywy dla tej emotki: ${
                        em.savenames.filter((x, i) => i > 0).length > 0 ? `\`\`\`\n${em.savenames.filter((x, i) => i > 0).join("\n")}\n\`\`\`` : "brak"
                    }${
                        typeof em.server === "undefined"
                            ? ""
                            : `\nTa emotka pochodzi ze serwera [*${client.guilds.cache.get(em.server.id).name}*](<https://discord.gg/${em.server.iCode}>)*`
                    }\n*Możesz także użyć \`{e:${em.savenames[0]}}\`*`
                )
            } else {
                interaction.reply(
                    `Znaleziono kilka emotek z tym zapytaniem. Wyświetlanie losowych **${Math.min(query.length, 12)}** z **${query.length}**\n${query
                        .sort(() => Math.random() - 0.5)
                        .filter((x, i) => i < 12)
                        .map((x) => {
                            return `\n${x.emote} - \`${x.savenames[0]}\` (aliasy: ${
                                x.savenames.length > 1 ? `${customEmoticons.approved}, ilość: ${x.savenames.length - 1}` : customEmoticons.denided
                            })${typeof x.server === "undefined" ? "" : ` *//ze serwera [${client.guilds.cache.get(x.server.id).name}](<https://discord.gg/${x.server.iCode}>)*`}`
                        })}`
                )
            }
        }
    },
}
