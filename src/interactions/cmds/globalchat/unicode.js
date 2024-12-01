import djs from "discord.js"
const { Client, ChatInputCommandInteraction, AutocompleteFocusedOption, Snowflake } = djs
import conf from "../../../config.js"

export default {
    /**
     * @type {{savenames: string[], symbol: string, name: string }[]}
     */
    unicodeList: [
        {
            savenames: ["pi", "piLower"],
            name: "Mały znak Pi",
            symbol: "π",
        },
        {
            savenames: ["piUpper", "math.multiplicationFunction", "math.multFunction", "math.multiplicatonFunc", "math.multfunc"],
            name: "Duży znak Pi",
            symbol: "Π",
        },
        {
            savenames: ["math.multiplication", "math.mult"],
            name: "Znak mnożenia",
            symbol: "×",
        },
        {
            savenames: ["math.division", "math.div"],
            name: "Znak dzielenia",
            symbol: "÷",
        },
        {
            savenames: ["half", "oneHalf", "fraction.one_two", "frac.one_two"],
            name: "Ułamek 1/2",
            symbol: "½",
        },
        {
            savenames: ["oneThird", "fraction.one_three", "frac.one_three"],
            name: "Ułamek 1/3",
            symbol: "⅓",
        },
        {
            savenames: ["quarter", "fraction.one_four", "frac.one_four"],
            name: "Ułamek 1/4",
            symbol: "¼",
        },
        {
            savenames: ["threeQuarters", "3quarters", "fraction.three_four", "frac.three_four"],
            name: "Ułamek 3/4",
            symbol: "¾",
        },
        {
            savenames: ["oneSeventh", "fraction.one_seven", "frac.one_seven"],
            name: "Ułamek 1/7",
            symbol: "⅐",
        },
        {
            savenames: ["oneNinth", "frac.one_nine", "fraction.one_nine"],
            name: "Ułamek 1/9",
            symbol: "⅑",
        },
        {
            savenames: ["oneFifth", "frac.one_five", "fraction.one_five"],
            name: "Ułamek 1/5",
            symbol: "⅕",
        },
        {
            savenames: ["oneSixth", "frac.one_six", "fraction.one_six"],
            name: "Ułamek 1/6",
            symbol: "⅙",
        },
        {
            savenames: ["oneEighth", "fraction.one_eight", "frac.one_eight"],
            name: "Ułamek 1/8",
            symbol: "⅛",
        },
        {
            savenames: ["zeroThirds", "fraction.zero_three", "frac.zero_three"],
            name: "Ułamek 0/3",
            symbol: "↉",
        },
        {
            savenames: ["oneTenth", "fraction.one_ten", "frac.one_ten"],
            name: "Ułamek 1/10",
            symbol: "⅒",
        },
    ],

    /**
     * @param {import("discord.js").AutocompleteFocusedOption} acFocusedInformation
     * @param {import("discord.js").Client<true>} client
     */
    autocomplete(acFocusedInformation, client) {
        var options = this.unicodeList.map((x) => x.savenames).flat()
        options = options.filter((x) => x.includes(acFocusedInformation.value)).filter((x, i) => i < 25)
        return options
    },
    /**
     *
     * @param {import("discord.js").Client} client
     * @param {import("discord.js").ChatInputCommandInteraction} interaction
     */
    async execute(client, interaction) {
        const queryOption = interaction.options.get("query")
        //this.unicodeList = this.unicodeList.filter((x) => typeof x.server === "undefined" || typeof client.guilds.cache.get(x.server.id) !== "undefined")
        if (!queryOption) {
            interaction.reply({
                content: `# Lista wspieranych znaków unicode\n${conf.customEmoticons.info} Użycie: \`{unicode:<nazwa>}\` lub \`{uc:<nazwa>}\`\n${this.unicodeList
                    .sort(() => Math.random() - 0.5)
                    .filter((x, i) => i < 10)
                    .map((x, index) => {
                        return `\n\`${x.symbol}\` (${x.name[0].toLowerCase() + x.name.substring(1)}) - \`${x.savenames[0]}\` (aliasy: ${
                            x.savenames.length > 1 ? `${conf.customEmoticons.approved}, ilość: ${x.savenames.length - 1}` : conf.customEmoticons.denided
                        })`
                    })}\n-# Tutaj się wyświetla maksymalnie 10 emotek. Możesz użyć parametru \`query\`, aby wyszukać emotki.\n-# Wpisuj nazwę bez ostrych nawiasów.`,
            })
        } else {
            const queryVal = queryOption.value
            var query = this.unicodeList.filter((x) => {
                var have = false
                x.savenames.forEach((savename) => {
                    have ||= savename.includes(queryVal)
                })

                return have
            })

            if (query.length == 0) {
                interaction.reply(`${conf.customEmoticons.denided} Niestety, nie posiadamy obecnie emotki`)
            } else if (query.length == 1) {
                const em = query[0]
                interaction.reply(
                    `# \`${em.symbol}\` jako \`{emote:${em.savenames[0]}}\`\nAlternatywy dla tej emotki: ${
                        em.savenames.filter((x, i) => i > 0).length > 0 ? `\`\`\`\n${em.savenames.filter((x, i) => i > 0).join("\n")}\n\`\`\`` : "brak"
                    }\n*Możesz także użyć \`{e:${em.savenames[0]}}\`*`
                )
            } else {
                interaction.reply(
                    `Znaleziono kilka znaków  z tym zapytaniem. Wyświetlanie losowych **${Math.min(query.length, 12)}** z **${query.length}**\n${query
                        .sort(() => Math.random() - 0.5)
                        .filter((x, index) => index < 12)
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
