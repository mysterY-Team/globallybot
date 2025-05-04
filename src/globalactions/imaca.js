import djs from "discord.js"
const { User, WebhookMessageCreateOptions, Client } = djs
import { createCarrrd } from "../functions/imaca.js"
import conf from "../config.js"
const { db } = conf
import { imacaData } from "../functions/dbSystem.js"
import { wait } from "../functions/useful.js"

export default {
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
     * @param {import("discord.js").Client<true>} client
     * @returns {Promise<WebhookMessageCreateOptions>}
     */
    execute: async function (msg, user, reply, client) {
        var a = msg.slice(msg.split("!")[0].length + 1).split(" ")
        const cmd = a[0]
        const args = [...a.filter((x, i) => i > 0)]

        var main = {}

        await wait(1000)

        const cmds = [
            ["pomoc", "help"],
            ["show", "pokaż", "pokaz", "karta"],
            ["setup", "konfiguracja", "config", "ustawianie", "setting", "edycja", "edit"],
        ].flat()

        switch (cmd) {
            case cmds[0]:
            case cmds[1]:
                main.content = [
                    "# Witaj, {uM}\nUżyłeś komendy pomocy. Oto wszystkie komendy, które na chwilę obecną posiadam:",
                    "- `karta <id | ping | pusty>` - Pokazuje kartę użytkownika",
                    "- `setup` - Poradnik ustawiania swojej karty",
                    "\n||Pamiętaj, aby stosować poprawność w używaniu komend!||",
                    "-# ImaCarrrd jest oddzielną usługą bota Globally i nie ma nic wspólnego z GlobalChatem.",
                ].join("\n")
                break
            case cmds[2]:
            case cmds[3]:
            case cmds[4]:
            case cmds[5]: {
                let uid = args[0]?.replace(/<@([0-9]{17,19})>/g, "$1") || reply?.author.id || user.id
                let uc = uid == user.id || uid == "GlobalAction" || !uid.match(/[0-9]{11,13}/) ? user : await client.users.fetch(uid)
                main.files = [await createCarrrd(imacaData.encode((await db.aget(`userData/${uid}/imaca`)).val), [uc, null])]
                break
            }
            case cmds[6]:
            case cmds[7]:
            case cmds[8]:
            case cmds[9]:
            case cmds[10]:
            case cmds[11]:
            case cmds[12]:
                main.content = [
                    "Niestety, nie mam, i nie będę miał możliwości konfigurowania karty bezpośrednio na GlobalChacie. Mogę jedynie Cię nakierować jak to zrobić!\n",
                    "## `1.` Upewnij się, że masz możliwość użycia komendy `imacarrrd`",
                    'Komenda ta jest dostępna zarówno po stronie serwera, jak i użytkownika (serio, możesz nawet teraz samemu "dodać" tą aplikację [tutaj](<https://discord.com/oauth2/authorize?client_id=1173359300299718697&integration_type=1&scope=applications.commands>)). W przypadku używania po stronie użytkownika nie stanowi żadnego problemu, bo w każdej chwili na każdym kanale\\* możesz je użyć, gorzej z aplikacją serwerową - tutaj musisz znaleźć do tego przystosowany kanał.',
                    '-# \\* Faktycznie te komendy można użyć na każdym kanale, z pewnymi róznicami. Dowiedz się więcej o [permisji "Używaj zewnętrznych aplikacji"](<https://support.discord.com/hc/pl/articles/23957313048343-Moderowanie-aplikacji-na-Discordzie#h_01HZQQQEADYVN2CM4AX4EZGKHM>) oraz [AutoModzie](<https://support.discord.com/hc/pl/articles/23957313048343-Moderowanie-aplikacji-na-Discordzie#h_01HZQQQEADJMTNRNKYEYACMMG7>).',
                    "## `2.` Skonfiguruj podstawowe parametry karty",
                    "Po uruchomieniu komendy `imacarrrd konfiguruj` powinieneś zobaczyć formularz. Tam możesz wypełnić informacje karty, jak URL banneru, długi w opór opis, itd. Zalecane jest przeczytanie z dokumentacji [co warto wiedzieć podczas konfigurowywania](<https://docs.google.com/document/d/1NHmhOcDhR8SJx9y2_1bj33Ey3BubR2i47G6p8IIIYi8/edit#heading=h.cn5mj5wfm7ca>).",
                    "## `3.` Zmień motyw/styl swojej karty",
                    "Możesz stwierdzić, że domyślny motyw jest do bani. Wiemy o tym doskonale, dlatego powstała możliwość zmiany motywu. Wpisz `/imacarrrd zmieństyl`, a w argumencie `styl` będziesz miał wszystkie motywy. Możesz też zacząć pisać słowa kluczowe, aby wyszukać motyw. Nie ma Twojego ulubionego? Możesz nam zaproponować na serwerze support. (Za własną twórczość nagradzamy premium!) Warto zapamiętać, że system, aby uniknąć problemów z renderowaniem, zaminenia nowe linie na spacje.",
                ].join("\n")
                break
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
