const { User, WebhookMessageCreateOptions } = require("discord.js")
const axios = require("axios")
const cheerio = require("cheerio")
const { wait } = require("../functions/useful")
const { customEmoticons } = require("../config")

module.exports = {
    data: {
        name: "Memiarz",
        description: "Najlepszy przyjaciel z poczuciem humoru. Użyj komendy `help`/`pomoc`, abo poznać jego komendy!",
        avatar: "https://www.pngarts.com/files/11/Haha-Emoji-Transparent-Image.png",
        /**
         * @type {"cmd" | "chat2.0" | "chat"}
         */
        prompt_type: "cmd",
    },
    /**
     * @param {string} msg
     * @param {User} user
     * @returns {Promise<WebhookMessageCreateOptions>}
     */
    execute: async function (msg, user) {
        var a = msg.slice(msg.split("!")[0].length + 1).split(" ")
        const cmd = a[0]
        const args = [...a.filter((x, i) => i > 0)]

        await wait(1500)

        const cmds = ["pomoc", "help", "dowcip"]

        switch (cmd) {
            case cmds[0]:
            case cmds[1]: {
                a =
                    "# Witaj, {uM}\nUżyłeś komendy pomocy. Oto wszystkie komendy, które na chwilę obecną posiadam:\n- `dowcip` - Dowcip z perelki.net\n- `mem` - Mem z memy.pl\n\n||Pamiętaj, aby stosować poprawność w używaniu komend!||"
                break
            }
            case cmds[2]: {
                var joke = await axios.get("https://perelki.net/random")
                if (!joke.data) {
                    a = `${customEmoticons.denided} Nie udało się pobrać dowcipu!`
                    break
                }
                const $ = cheerio.load(joke.data)
                $(".content .container:not(.cntr) .about").remove()
                joke = $(".content .container:not(.cntr)")
                    .html()
                    .replace(/<br>/g, "\n")
                    .replace(/\*/g, "\\*")
                    .replace(/_/g, "\\_")
                    .replace(/~/g, "\\~")
                    .replace(/#/g, "\\#")
                    .replace(/@/g, "\\@")
                    .trim()
                joke = joke
                    .split("\n")
                    .filter((line) => line != "")
                    .join("\n")

                a = `Udało się znaleźć dowcip ze strony [**perelki.net**](<https://perelki.net>)\n\n${joke}`
                break
            }
            default: {
                a = [
                    { core: "Próbujesz się zapytać umierającego, czy żyje. Ja nie mam tej komendy!", proposition: "Może chodzi Ci o `{closeCmd}`?" },
                    { core: "Wybacz, nie mam tej komendy na liście.", proposition: "Bliska jest komenda `{closeCmd}`, jak Ci o nią chodziło - nie dziękuj \\;)" },
                    { core: "(ㆆ_ㆆ)", proposition: "`Joker!{closeCmd}`\\*\\*\\*\\*" },
                    { core: "404 - Not found! (Nie znaleziono!)", proposition: "> Czy chodziło Ci o: *Joker!{closeCmd}*?" },
                ]
                a = a[Math.floor(Math.random() * a.length)]

                const commands = cmds
                const input = cmd
                let closestCommand = ""
                let maxOverlap = 0
                for (let i = 0; i < commands.length && i < 3; i++) {
                    const command = commands[i]
                    let startOverlap = 0
                    let endOverlap = 0
                    for (let j = 1; j <= command.length; j++) {
                        const start = input.substring(0, j)
                        const end = input.substring(input.length - j)
                        if (command.startsWith(start)) {
                            startOverlap = start.length
                        }
                        if (command.endsWith(end)) {
                            endOverlap = end.length
                        }
                    }
                    const overlap = startOverlap + endOverlap
                    if (overlap > maxOverlap && overlap > 2) {
                        closestCommand = command
                        maxOverlap = overlap
                    }
                }

                if (closestCommand !== "") {
                    a = `${a.core}\n${a.proposition.replace("{closeCmd}", closestCommand)}`
                } else {
                    a = a.core
                }
            }
        }

        return { content: a.replace(/{uM}/g, `<@${user.id}>`) }
    },
}
