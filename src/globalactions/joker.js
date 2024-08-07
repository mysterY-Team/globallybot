const { User, WebhookMessageCreateOptions, AttachmentBuilder, EmbedBuilder } = require("discord.js")
const cheerio = require("cheerio")
const { wait } = require("../functions/useful")
const { customEmoticons } = require("../config")
const { Octokit } = require("@octokit/rest")
const { request } = require("undici")

module.exports = {
    data: {
        name: "Memiarz",
        description: "Najlepszy przyjaciel z poczuciem humoru. Użyj komendy `help`/`pomoc`, abo poznać jego komendy!",
        avatar: "https://www.pngarts.com/files/11/Haha-Emoji-Transparent-Image.png",
        prompt_type: "cmd",
    },
    /**
     * @param {string} msg
     * @param {User} user
     * @param {{ text: string, author: { name: string, id: string }, isGA: boolean } | null} reply
     * @returns {Promise<WebhookMessageCreateOptions>}
     */
    execute: async function (msg, user, reply) {
        var a = msg.slice(msg.split("!")[0].length + 1).split(" ")
        const cmd = a[0]
        const args = [...a.filter((x, i) => i > 0)]

        /**
         * @type {WebhookMessageCreateOptions}
         */
        var main = { content: "" }

        await wait(750)

        const cmds = ["pomoc", "help", "dowcip", "suchar", "mem", "janusz"]

        switch (cmd) {
            case cmds[0]:
            case cmds[1]: {
                main.content = [
                    "# Witaj, {uM}\nUżyłeś komendy pomocy. Oto wszystkie komendy, które na chwilę obecną posiadam:",
                    "- `dowcip` - Dowcip z perelki.net",
                    "- `mem` - Mem z repo memów ze serwera Memhub",
                    "- `janusz` - Mem z nieoficjalnego NosaczAPI",
                    "\n||Pamiętaj, aby stosować poprawność w używaniu komend!||",
                ].join("\n")
                break
            }
            case cmds[2]:
            case cmds[3]: {
                var joke = await request("https://perelki.net/random")
                if (!(joke.statusCode >= 200 && joke.statusCode < 300)) {
                    a = `${customEmoticons.denided} Nie udało się pobrać dowcipu!`
                    break
                }
                const $ = cheerio.load(await joke.body.text())
                $(".content .container:not(.cntr) .about").remove()
                joke = $(".content .container:not(.cntr)")
                    .html()
                    .replace(/<br>|<br \/>/g, "\n")
                    .replace(/\*/g, "\\*")
                    .replace(/_/g, "\\_")
                    .replace(/~/g, "\\~")
                    .replace(/#/g, "\\#")
                    .replace(/@/g, "\\@")
                    .trim()
                joke = joke
                    .split("\n")
                    .filter((line) => line.trim() != "")
                    .join("\n")

                main.content = joke
                main.embeds = [new EmbedBuilder().setDescription("**Źródło:** [perelki.net](<https://perelki.net>)")]
                break
            }
            case cmds[4]: {
                //pobieranie wszystkich memów z repozytorium "patYczakus/Memhub-API-filesystem" na GitHubie (@octokit/rest)
                const octokit = new Octokit()
                const { data } = await octokit.repos.getContent({ owner: "patYczakus", repo: "Memhub-API-filesystem", path: "images" })
                var files = data.filter((it) => it.type == "file").map((it) => it.name)
                files = files[Math.floor(Math.random() * files.length)]
                var ext = files.split(".").at(-1)

                main.embeds = [
                    new EmbedBuilder().setDescription(
                        "**Źródło:** [Memhub](<https://discord.gg/memhub>), za pomocą repo [patYczakus/Memhub-API-filesystem](<https://github.com/patYczakus/Memhub-API-filesystem>)"
                    ),
                ]
                main.files = [
                    new AttachmentBuilder().setFile("https://raw.githubusercontent.com/patYczakus/Memhub-API-filesystem/main/images/" + files).setName(`mem_memhub.` + ext),
                ]

                break
            }
            case cmds[5]: {
                var x = await request("https://raw.githubusercontent.com/OpenMemes/nosaczapi-unofficial/master/data.json")
                x = await x.body.json()
                const file = x.url + String(Math.round(Math.random() * x.last - x.first) + x.first) + x.filetype

                main.avatarURL = "https://i.pinimg.com/736x/be/ad/57/bead57094937ca072fac9de82ab382fb--ugly-animals-strange-animals.jpg"
                main.username = "Janusz"
                main.files = [new AttachmentBuilder().setFile(file).setName(`mem_nosacz.` + x.filetype)]
                main.embeds = [
                    new EmbedBuilder().setDescription(
                        "**Źródło:** nieoficjalne repo z NosaczAPI - [OpenMemes/nosaczapi-unofficial](<https://github.com/OpenMemes/nosaczapi-unofficial>)"
                    ),
                ]

                break
            }
            default: {
                main.content = [
                    { core: "Próbujesz się zapytać umierającego, czy żyje. Ja nie mam tej komendy!", proposition: "Może chodzi Ci o `{closeCmd}`?" },
                    { core: "Wybacz, nie mam tej komendy na liście.", proposition: "Bliska jest komenda `{closeCmd}`, jak Ci o nią chodziło - nie dziękuj \\;)" },
                    { core: "(ㆆ_ㆆ)", proposition: "`Joker!{closeCmd}`\\*\\*\\*\\*" },
                    { core: "404 - Not found! (Nie znaleziono!)", proposition: "> Czy chodziło Ci o: *Joker!{closeCmd}*?" },
                ]
                main.content = main.content[Math.floor(Math.random() * main.content.length)]

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
                    main.content = `${main.content.core}\n${main.content.proposition.replace("{closeCmd}", closestCommand)}`
                } else {
                    main.content = main.content.core
                }
            }
        }

        if (main.content) main.content = main.content.replace(/{uM}/g, `<@${user.id}>`)
        return main
    },
}
