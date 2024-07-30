const { User, WebhookMessageCreateOptions, Client } = require("discord.js")
const { createCarrrd } = require("../functions/imaca")
const { db } = require("../config")
const { imacaData } = require("../functions/dbs")
const { wait } = require("../functions/useful")

module.exports = {
    data: {
        name: "ImaCarrrd",
        description: "Twoje wyrażanie siebie na nowym poziomie - karty użytkownika z dużą opcją konfigurowywania. Zacznij od `pomoc`/`help` po więcej komend!",
        avatar: "https://i.postimg.cc/YSz1RkfH/Designer-1.jpg",
        prompt_type: "cmd",
    },
    /**
     * @param {string} msg
     * @param {User} user
     * @param {{ text: string, author: { name: string, id: string }, isGA: boolean } | null} reply
     * @param {Client<true>} client
     * @returns {Promise<WebhookMessageCreateOptions>}
     */
    execute: async function (msg, user, reply, client) {
        var a = msg.slice(msg.split("!")[0].length + 1).split(" ")
        const cmd = a[0]
        const args = [...a.filter((x, i) => i > 0)]

        var main = {}

        await wait(1000)

        const cmds = ["pomoc", "help", "show", "pokaż", "pokaz", "karta"]

        switch (cmd) {
            case cmds[0]:
            case cmds[1]:
                main.content = [
                    "# Witaj, {uM}\nUżyłeś komendy pomocy. Oto wszystkie komendy, które na chwilę obecną posiadam:",
                    "- `karta <id | ping | pusty>` - Pokazuje kartę użytkownika",
                    "\n||Pamiętaj, aby stosować poprawność w używaniu komend!||",
                    "-# ImaCarrrd jest oddzielną usługą bota Globally i nie ma nic wspólnego z GlobalChatem.",
                ].join("\n")
                break
            case cmds[2]:
            case cmds[3]:
            case cmds[4]:
            case cmds[5]: {
                let uid = args[0]?.replace(/<@([0-9]{17,19})>/g, "$1") || user.id
                let uc = uid == user.id ? user : await client.users.fetch(uid)
                main.files = [await createCarrrd(imacaData.encode(db.get(`userData/${uid}/imaca`).val), uc)]
                break
            }
            default: {
                main.content = [
                    {
                        core: "Komendy są jak motywy - niekoniecznie musi się taka znajdować... niestety",
                        proposition: "Równie pięknym motywem- znaczy komendą jest `{closeCmd}`, spróbuj tego użyć (~~za dużo roboty na dziś~~)",
                    },
                    {
                        core: "Komendy są jak motywy - niekoniecznie musi się taka znajdować... niestety",
                        proposition: "Równie piękną komendą jest `{closeCmd}`, spróbuj tego użyć",
                    },
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
