const { User, WebhookMessageCreateOptions, MessageReference } = require("discord.js")

module.exports = {
    data: {
        name: "Pomocnik GlobalChata",
        description: "Specjalne narzędzie do pobierania informacji o użytkowniku czy serwerze. Ułatwia też zarządzanie osobami dla moderatorów!",
        avatar: "https://cdn.discordapp.com/avatars/760753297698717738/7326b5ef0f94c8f887d6835a848a197e.png?size=512",
        prompt_type: "cmd",
    },
    /**
     * @param {string} msg
     * @param {User} user
     * @param {MessageReference | null} reference
     * @returns {Promise<WebhookMessageCreateOptions>}
     */
    execute: async function (msg, user, reference) {
        var a = msg.slice(msg.split("!")[0].length + 1).split(" ")
        const cmd = a[0]
        const args = [...a.filter((x, i) => i > 0)]

        const cmds = ["pomoc", "help", "serverinfo", "guildinfo", "userinfo", "sinfo", "uinfo", "ublock"]

        switch (cmd) {
            case cmds[0]:
            case cmds[1]: {
                a = "## {uM}, oto Twoja pomoc!\nTutaj wszystkie komendy\n- `serverinfo` - Dowcip z perelki.net\n\n||Pamiętaj, aby stosować poprawność w używaniu komend!||"
                break
            }
            case cmds[2]:
            case cmds[3]:
            case cmds[5]: {
            }
            default: {
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
                    a = `Tutaj raczej zrobiłeś literówkę, bowiem (jeżeli się nie mylę) powinna być komenda \`${closestCommand}\`.`
                } else {
                    a = "Wybacz, ale teraz nie mam tej komendy jako dostępnej!"
                }
            }
        }

        return { content: a.replace(/{uM}/g, `<@${user.id}>`) }
    },
}
