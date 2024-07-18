const { User, WebhookMessageCreateOptions, Client } = require("discord.js")
const { createCarrrd } = require("../functions/imaca")
const { db } = require("../config")
const { imacaData } = require("../functions/dbs")
const { wait } = require("../functions/useful")

module.exports = {
    data: {
        name: "ImaCarrrd",
        description: "Twoje wyrażanie siebie na nowym poziomie - karty użytkownika z dużą opcją konfigurowywania. Zacznij od `pomoc`/`help` po więcej komend!",
        avatar: "https://home.microsoftpersonalcontent.com/contentstorage/coJsE0OdIkqu2uEOCncHOQAAAAAAAAAAoS-v4oKNDkE/_layouts/15/download.aspx?UniqueId=5b43e6cd-c289-4406-89be-e77e68d6c3cf&Translate=false&tempauth=v1e.eyJzaXRlaWQiOiJkOGQxZjU3Ni01ZTYxLTQ2NTItOGZhYi1kZWEwY2Q4NzEwNDYiLCJhcHBfZGlzcGxheW5hbWUiOiJEZXNpZ25lciIsImFwcGlkIjoiNWUyNzk1ZTMtY2U4Yy00Y2ZiLWIzMDItMzVmZTVjZDAxNTk3IiwiYXVkIjoiMDAwMDAwMDMtMDAwMC0wZmYxLWNlMDAtMDAwMDAwMDAwMDAwL2hvbWUubWljcm9zb2Z0cGVyc29uYWxjb250ZW50LmNvbUA5MTg4MDQwZC02YzY3LTRjNWItYjExMi0zNmEzMDRiNjZkYWQiLCJleHAiOiIxNzIxMzQ0OTg4In0.QU2UGecXKXx0UsCd-aBll_z_94dULNPS_frCPOd6vWYS4msGmtN8SjazwZ4DniagIu29wVVcj_q0ssGKFBqD-p3nzjrX6J9jb1wP5Yc12YioBz-8-5LKxbZpbIs59CGdGsbSpre8abNm0m6VW2vNf86JSEdzHmhO9YTrNch34a4KtisF5GsrLIftcZAsk9DibSJbT0HQAtuW0X82Z7-b0J94uRo6-e2dwtOomuu_mhNQ-kF1nNoYFKJXl5zktWs7fvxMguVRb0R4ylLEdYKhc2y3BLz0wTht-U1V1LxmT5EEI5wh3jE8vbqrOYOTW5yBTiuSdWo91G2_OyVza_1L370hQz8GXlU4NyyuP4Sz4se7CUW_WSCNYivsLQ-6Ryk4XlvKobeYICxAGgk3RbA35myxFcXr_RAKzemaUxodFtg.Lxy409a1Cq7ZVo-E5rGyanBpcQW8xs92s3oCj_lJfdw&ApiVersion=2.1",
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
