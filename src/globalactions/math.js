const { User, WebhookMessageCreateOptions } = require("discord.js")
const { customEmoticons } = require("../config")
const { wait } = require("../functions/useful")

module.exports = {
    data: {
        name: "Matematyczny gość",
        description:
            "Pomocnik z matematyki na co dzień - to dzięki niemu ułatwisz liczenie *i zbędnego przeklikiwania w kalkulator przeglądarkowy*. Użyj komendy `help`/`pomoc`, abo poznać jego komendy!",
        avatar: "https://png.pngtree.com/png-vector/20190626/ourlarge/pngtree-calculator-icon-design-png-image_1500345.jpg",
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

        /**
         * @type {WebhookMessageCreateOptions}
         */
        var main = { content: "" }

        await wait(500)

        const cmds = ["pomoc", "help", "calc", "policz"]

        switch (cmd) {
            case cmds[0]:
            case cmds[1]: {
                main.content = [
                    "# Witaj, {uM}\nUżyłeś komendy pomocy. Oto wszystkie komendy, które na chwilę obecną posiadam:",
                    "- `calc <działanie>` - Oblicza proste wyrażenie matematyczne (dodawanie, odejmowanie, mnożenie, dzielenie i potęgowanie)",
                    "\n||Pamiętaj, aby stosować poprawność w używaniu komend!||",
                ].join("\n")
                break
            }
            case cmds[2]:
            case cmds[3]: {
                // może policzyć proste działania, m.in 2+3*5
                function calculate(expr = "NaN") {
                    var exprList = [""]
                    for (var i = 0; i < expr.length; i++) {
                        if (expr[i].match(/[0-9.]/)) {
                            exprList[exprList.length - 1] += expr[i]
                        } else if (expr[i].match(/,/)) {
                            exprList[exprList.length - 1] += "."
                        } else if (expr[i].match(/(?:\+|-|\/|\*|\^)/)) {
                            exprList.push(expr[i])
                            exprList.push("")
                        }
                    }
                    exprList = exprList.map((x) => (x ? x : "NaN"))

                    // lecimy od prawej do lewej, gdyż tak działa potęgowanie
                    for (var i = exprList.length - 1; i >= 0; i--) {
                        // zaczynamy od mnożenia i dzielenia
                        if (String(exprList[i]).match(/(?:\^)/)) {
                            var op = exprList[i]
                            var num1 = Number(exprList[i - 1])
                            var num2 = Number(exprList[i + 1])
                            exprList[i - 1] = Math.pow(num1, num2)
                            exprList.splice(i, 2)
                        }
                    }

                    //a tu od lewej do prawej
                    for (var i = 0; i < exprList.length; i++) {
                        // zaczynamy od mnożenia i dzielenia
                        if (String(exprList[i]).match(/(?:\*|\/)/)) {
                            var op = exprList[i]
                            var num1 = Number(exprList[i - 1])
                            var num2 = Number(exprList[i + 1])
                            if (op == "*") {
                                exprList[i - 1] = num1 * num2
                            } else {
                                exprList[i - 1] = num1 / num2
                            }
                            exprList.splice(i, 2)
                            i--
                        }
                    }
                    for (var i = 0; i < exprList.length; i++) {
                        // zaczynamy od dodawania i odejmowania
                        if (String(exprList[i]).match(/(?:\+|\-)/)) {
                            var op = exprList[i]
                            var num1 = Number(exprList[i - 1])
                            var num2 = Number(exprList[i + 1])
                            if (op == "+") {
                                exprList[i - 1] = num1 + num2
                            } else {
                                exprList[i - 1] = num1 - num2
                            }
                            exprList.splice(i, 2)
                            i--
                        }
                    }

                    return exprList[0]
                }

                var expr = args.join("")
                if (expr.length == 0) {
                    main.content = `${customEmoticons.denided} Argument jest wymagany!`
                    break
                }
                var ans = calculate(expr)
                if (isNaN(ans)) {
                    main.content = `${customEmoticons.denided} Czy ty na pewno podałeś dobre działanie?`
                }

                main.content = `Wynikiem wyrażenia jest **${ans}**.`
                break
            }
            default: {
                main.content = [{ core: "Pomyliłem się w obliczeniach i wyszedł mi zły wynik!", proposition: "Spróbuj podstawić `{closeCmd}`" }]
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

        main.content = main.content.replace(/{uM}/g, `<@${user.id}>`)

        return main
    },
}
