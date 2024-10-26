import djs from "discord.js"
const { Client, ChatInputCommandInteraction, AutocompleteFocusedOption, Snowflake } = djs
import conf from "../../../config.js"

export default {
    /**
     * @type {{savenames: string[], emote: string, server?: { id: dSnowflake, iCode: string } | undefined }[]}
     */
    emoticons: [
        { savenames: ["pixel.kekw", "px.kekw"], emote: "<:PX_kekw:1182025687566123078>" },
        // {
        //     savenames: ["pixel.pepeWithGun", "px.pepeWithGun", "pixel.pepewgun", "px.pepewgun", "pixel.pepegun", "px.pepegun"],
        //     emote: "<:PX_pepeWithGun:1174022124000792639>",
        // },
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
        {
            savenames: ["genshin.kokomiCry"],
            emote: "<:Kokomi_Fish_Cry_Moothify:1226270778463617205>",
            server: { id: "1199605405245001838", iCode: "kaneami" },
        },
        {
            savenames: ["genshin.kokomiFullOfHearts", "genshin.kokomiHearts"],
            emote: "<:kokomi_hearts:1226271152771563561>",
            server: { id: "1199605405245001838", iCode: "kaneami" },
        },
        {
            savenames: ["genshin.nahidaWink"],
            emote: "<:Nahida_Wink:1226271383856873542>",
            server: { id: "1199605405245001838", iCode: "kaneami" },
        },
        {
            savenames: ["starcieInternetu.botekSkull", "stin.botekSkull"],
            emote: "<:StIn_botekSkull:1240889285734039622>",
        },
        {
            savenames: ["starcieInternetu.patyArguing", "stin.patyArguing"],
            emote: "<:StIn_patyArguing:1240889327064453161>",
        },
        {
            savenames: ["starcieInternetu.szymekDymekChilling", "stin.szymekDymekChilling", "starcieInternetu.szymekDymekChill", "stin.szymekDymekChill"],
            emote: "<:StIn_szymekDymekChill:1240889372610396180>",
        },
        {
            savenames: ["kanae.angry"],
            emote: "<:save_Kanae_Angry_NF2U:1262860476178497536>",
            server: { id: "1199605405245001838", iCode: "WkYHb57jw7" },
        },
        {
            savenames: ["kanae.confused", "kanae.loading"],
            emote: "<:save_Kanae_Confused_NF2U:1262860474584793199>",
            server: { id: "1199605405245001838", iCode: "WkYHb57jw7" },
        },
        {
            savenames: ["kanae.laughing"],
            emote: "<:save_Kanae_lol_NF2U:1262860478439358594> ",
            server: { id: "1199605405245001838", iCode: "WkYHb57jw7" },
        },
        {
            savenames: ["kanae.scared", "kanae.traumatized"],
            emote: "<:save_Kanae_Traumatized_NF2U:1262860480725389333>",
            server: { id: "1199605405245001838", iCode: "WkYHb57jw7" },
        },
        // {
        //     savenames: ["kanae.holdingHeart", "kanae.love"],
        //     emote: "<:Kanae_Love_NF2U:1244393501274144768>",
        //     server: { id: "1199605405245001838", iCode: "WkYHb57jw7" },
        // },
    ],

    /**
     * @param {AutocompleteFocusedOption} acFocusedInformation
     * @param {Client<true>} client
     */
    autocomplete(acFocusedInformation, client) {
        var options = this.emoticons.map((x) => x.savenames).flat()
        // options.push(
        //     ...servers
        //         .get()
        //         .filter((x) => !ServersNotUsingTheirEmotesFeature.includes(x.id))
        //         .map((x) => `serwer=${x.id}`)
        // )
        options = options.filter((x) => x.includes(acFocusedInformation.value)).filter((x, i) => i < 25)
        return options
    },
    /**
     *
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(client, interaction) {
        const queryOption = interaction.options.get("query")
        this.emoticons = this.emoticons.filter((x) => typeof x.server === "undefined" || typeof client.guilds.cache.get(x.server.id) !== "undefined")
        if (!queryOption) {
            interaction.reply({
                content: `# Lista globalnych emotek\n${conf.customEmoticons.info} Użycie: \`{e:<nazwa>}\` lub \`{emote:<nazwa>}\`\n${this.emoticons
                    .sort(() => Math.random() - 0.5)
                    .filter((x, i) => i < 10)
                    .map((x) => {
                        return `\n${x.emote} - \`${x.savenames[0]}\` (aliasy: ${
                            x.savenames.length > 1 ? `${conf.customEmoticons.approved}, ilość: ${x.savenames.length - 1}` : conf.customEmoticons.denided
                        })${typeof x.server === "undefined" ? "" : ` *//ze serwera [${client.guilds.cache.get(x.server.id).name}](<https://discord.gg/${x.server.iCode}>)*`}`
                    })}\n\nTutaj się wyświetla maksymalnie 10 emotek. Możesz użyć parametru \`query\`, aby wyszukać emotki`,
            })
        } /*else if (queryOption.value.startsWith("serwer=")) {
            const ServersWithTheirEmotesFeature = servers.get().filter((x) => !ServersNotUsingTheirEmotesFeature.includes(x.id))
            const sid = queryOption.value.split("=")[1]

            if (ServersWithTheirEmotesFeature.map((x) => x.id).includes(sid)) {
                try {
                    await interaction.deferReply()
                    var server = await client.guilds.fetch(sid)
                    var _perms = (await server.members.fetchMe()).permissions
                    const permsToInvite = _perms.has("Administrator") || (_perms.has("CreateInstantInvite") && _perms.has("ManageGuild"))
                    var sName = server.name
                    const allEmotes = (await server.emojis.fetch()).map((em) => `<${em.animated ? "a" : ""}:${em.name}:${em.id}>`).sort(() => Math.random() - 0.5)
                    var showedEmotes = allEmotes
                    var moreEmojis = false
                    if (showedEmotes.length > 16) {
                        showedEmotes = showedEmotes.filter((X, i) => i < 16)
                        moreEmojis = true
                    }
                    delete server

                    if (server.vanityURLCode) {
                        invition = server.vanityURLCode
                    }
                    if (permsToInvite && !invition) {
                        const inv = await server.invites.fetch()
                        var invition = inv.map((x) => x).filter((x) => x.inviterId === _bot.id)[0] ?? ""
                        var channels = (await server.channels.fetch()).map((x) => x)
                        var i = 0
                        while (i < channels.length && !invition) {
                            try {
                                invition = await server.invites.create(channels[i].id, { maxAge: 0 })
                                invition = invition.code
                            } catch (err) {
                                i++
                            }
                        }
                    }

                    const comp = !invition
                        ? []
                        : [
                              new ActionRowBuilder().addComponents([
                                  new ButtonBuilder().setStyle(ButtonStyle.Link).setURL(`https://discord.gg/${invition}`).setLabel("Dołącz do serwera"),
                              ]),
                          ]

                    interaction.editReply({
                        content: `# Lista emotek ze serwera *\`${sName}\`* \nUżycie: \`{serverEmote.${sid}:<nazwa emotki>}\` lub \`{se.${sid}:<nazwa emotki>}\`\n## ${
                            showedEmotes.join(" | ") || "||Tutaj jakieś powinny być? Nie ma żadnych na tą chwilę||"
                        } ${moreEmojis ? ` (+${allEmotes.length - showedEmotes.length} emotek)` : ""}`,
                        components: comp,
                    })
                } catch (err) {
                    console.warn(err)
                    interaction.editReply({
                        content: `## <:84710joesad:1249316152341958756> Ojoj...\nPoszedł jakiś błąd, przypatrzymy się temu`,
                    })
                }
            } else {
                interaction.reply(`${customEmoticons.denided} Nie widzę takiego serwera. Odświeżę teraz listę serwerów, a Ty spróbuj użyć komendy ponownie!`)
                servers.fetch(client)
            }
        }*/ else {
            const queryVal = queryOption.value
            var query = this.emoticons.filter((x) => {
                var have = false
                x.savenames.forEach((savename) => {
                    have ||= savename.includes(queryVal)
                })

                return have
            })

            if (query.length == 0) {
                interaction.reply(`${conf.customEmoticons.denided} Niestety, ta emotka nie istnieje w bazie danych lub jest niedostępna`)
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
                                x.savenames.length > 1 ? `${conf.customEmoticons.approved}, ilość: ${x.savenames.length - 1}` : conf.customEmoticons.denided
                            })${typeof x.server === "undefined" ? "" : ` *//ze serwera [${client.guilds.cache.get(x.server.id).name}](<https://discord.gg/${x.server.iCode}>)*`}`
                        })}`
                )
            }
        }
    },
}
