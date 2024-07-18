const { CommandInteraction, Client } = require("discord.js")
const { customEmoticons } = require("../../config")
const { generateGradientText } = require("../../functions/gradient")

module.exports = {
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        // Zmienna do zwrócenia wartości końcowej
        var returnedText = String()

        // Kolory w formacie HEX
        const colors = interaction.options.get("kolory", true).value.split(/ /g)

        // Tekst do zamiany na gradient
        const text = interaction.options.get("tekst", true).value

        // Lista z parametrami
        const formatList = {
            bold: interaction.options.get("pogrubiony", false),
            italic: interaction.options.get("pochylony", false),
            strikethrough: interaction.options.get("przekreślony", false),
            underline: interaction.options.get("podkreślony", false),
        }

        // Generowanie kodu JSON z gradientowym tekstem
        var gradientJSON = generateGradientText(colors, text)
        for (let i = 0; i < gradientJSON.length; i++) {
            if (gradientJSON[i].text == " ") {
                gradientJSON[i] = " "
                continue
            }

            Object.keys(formatList).forEach((typ) => {
                if (formatList[typ] != null) gradientJSON[i][typ] = formatList[typ].value
            })
        }

        // Znaczniki przy innych formatach
        var formatters = {
            bold: "l",
            italic: "o",
            underline: "n",
            strikethrough: "m",
        }

        // Typ zwracania
        const type = interaction.options.get("typ", true).value

        if (type == "json") {
            gradientJSON.splice(0, 0, "")
            returnedText = JSON.stringify(gradientJSON)
        } else if (type == "legacy" || type == "cnsl" || type == "motd") {
            var prefix
            if (type == "legacy") prefix = "&"
            if (type == "cnsl") prefix = "\u00A7"
            if (type == "motd") prefix = "\\u00A7"

            for (let i = 0; i < gradientJSON.length; i++) {
                if (gradientJSON[i] == " ") {
                    returnedText += `${prefix}r `
                } else {
                    returnedText += `${prefix}x`
                    for (let j = 1; j < gradientJSON[i].color.length; j++) {
                        returnedText += `${prefix}${gradientJSON[i].color[j]}`
                    }

                    Object.keys(formatList).forEach((typ) => {
                        if (typ in gradientJSON[i] && gradientJSON[i][typ]) returnedText += `${prefix}${formatters[typ]}`
                    })
                    returnedText += gradientJSON[i].text
                }
            }
        } else if (type == "br_rgb" || type == "chat") {
            var prefix = type == "br_rgb" ? "&" : "<",
                suffix = type == "br_rgb" ? "" : ">"

            for (let i = 0; i < gradientJSON.length; i++) {
                if (gradientJSON[i] == " ") {
                    returnedText += `&r `
                } else {
                    returnedText += `${prefix}${gradientJSON[i].color}${suffix}`

                    Object.keys(formatList).forEach((typ) => {
                        if (typ in gradientJSON[i] && gradientJSON[i][typ]) returnedText += `&${formatters[typ]}`
                    })

                    returnedText += gradientJSON[i].text
                }
            }
        } else if (type == "bbcode") {
            var bblist = []
            var element = 0
            Object.keys(formatList).forEach((typ) => {
                if (formatList[typ] != null && formatList[typ] != false) {
                    bblist.splice(0, 0, `[${typ.charAt(0).toUpperCase()}]`)
                    bblist[bblist.length] = `[/${typ.charAt(0).toUpperCase()}]`
                    element++
                }
            })

            for (let i = 0; i < gradientJSON.length; i++) {
                if (gradientJSON[i] == " ") {
                    returnedText += " "
                } else {
                    bblist[i + element] = `[COLOR=${gradientJSON[i].color}]${gradientJSON[i].text}[/COLOR]`
                }
            }
        } else {
            interaction.reply(`${customEmoticons.denided} Przepraszamy, ale ta opcja jeszcze nie jest dostępna!`)
            return
        }

        interaction.reply(`${customEmoticons.approved} Gotowe! Oto zwrócona wartość: \n\`\`\`${returnedText}\`\`\``)
    },
}
