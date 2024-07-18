const { User, WebhookMessageCreateOptions, AttachmentBuilder } = require("discord.js")
const { customEmoticons } = require("../config")
const { wait, checkFontColor } = require("../functions/useful")
const { createCanvas } = require("@napi-rs/canvas")

module.exports = {
    data: {
        name: "Matematyczny gość",
        description:
            "Pomocnik z matematyki na co dzień - to dzięki niemu ułatwisz liczenie, przedstawianie wykresów *i zbędnego przeklikiwania w przeglądarkę*. Użyj komendy `help`/`pomoc`, abo poznać jego komendy!",
        avatar: "https://png.pngtree.com/png-vector/20190626/ourlarge/pngtree-calculator-icon-design-png-image_1500345.jpg",
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

        function calculate(expr = "NaN", nawiasy = true) {
            if (nawiasy) {
                expr = expr.replace(/([0-9])\(/g, "$1*(")
                expr = expr.replace(/\)([0-9])/g, ")*$1")
                var oldExpr = ""
                do {
                    oldExpr = (() => expr)()
                    expr = expr.replace(/\(([0-9+\-*\/^,.e ]+)\)/g, (match, p1) => {
                        return calculate(p1, false)
                    })
                } while (oldExpr !== expr)
            }
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
            var ids = []
            // console.log(exprList)
            for (var i = 0; i < exprList.length; i++) {
                if (ids.includes(i)) continue
                // console.log(i, exprList[i])
                if (i == 0 && exprList[0] === "" && exprList[1] === "-" && exprList[2].match(/[0-9]/)) {
                    exprList[0] = `-${exprList[2]}`
                    ids.push(1, 2)
                } else if (i == 0 && exprList[0] === "" && exprList[1] === "-" && exprList[2] === "" && exprList[3] === "-" && exprList[4].match(/[0-9]/)) {
                    exprList[0] = `${exprList[4]}`
                    ids.push(1, 2, 3, 4)
                } else if (exprList[i].match(/(?:\+|-|\/|\*|\^)/) && exprList[i + 1] === "" && exprList[i + 2] === "-" && exprList[i + 3].match(/[0-9]/)) {
                    exprList[i + 1] = `-${exprList[i + 3]}`
                    ids.push(i + 2, i + 3)
                }
            }
            exprList = exprList
                .map((x, i) => {
                    return { x, i }
                })
                .filter((x) => !ids.includes(x.i))
                .map((x) => (x.x ? x.x : "NaN"))

            // console.log(exprList)

            // Obliczenia z uwzględnieniem nawiasów
            for (var i = exprList.length - 1; i >= 0; i--) {
                if (String(exprList[i]).match(/(?:\^)/)) {
                    var op = exprList[i]
                    var num1 = Number(exprList[i - 1])
                    var num2 = Number(exprList[i + 1])
                    exprList[i - 1] = Math.pow(num1, num2)
                    exprList.splice(i, 2)
                }
            }

            for (var i = 0; i < exprList.length; i++) {
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
                if (String(exprList[i]).match(/(?:\+|\-)/) && !String(exprList[i]).match(/[0-9]/)) {
                    var op = exprList[i]
                    var num1 = Number(exprList[i - 1])
                    var num2 = Number(exprList[i + 1])
                    // console.log(num1, num2, op)
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

        /**
         * @type {WebhookMessageCreateOptions}
         */
        var main = { content: "" }

        await wait(500)

        const cmds = ["pomoc", "help", "calc", "policz", "rysuj", "wykres", "wykresy"]

        switch (cmd) {
            case cmds[0]:
            case cmds[1]: {
                main.content = [
                    "# Witaj, {uM}\nUżyłeś komendy pomocy. Oto wszystkie komendy, które na chwilę obecną posiadam:",
                    "- `calc <działanie>` - Oblicza proste, jak i nieco skomplikowane wyrażenie matematyczne (dodawanie, odejmowanie, mnożenie, dzielenie i potęgowanie)",
                    "- `rysuj <wzór1> | <wzór2> | ... | <wzórN>` - Tworzy wykresy danych wzorów. Wzory oddzielaj pionową kreską",
                    "\n||Pamiętaj, aby stosować poprawność w używaniu komend!||",
                ].join("\n")
                break
            }
            case cmds[2]:
            case cmds[3]: {
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
            case cmds[4]:
            case cmds[5]:
            case cmds[6]: {
                const wzory = args
                    .join("")
                    .split(/\||;/g)
                    .map((x) => x.replace(/([0-9)])x/, "$1*x").replace(/x([(0-9])/, "x*$1"))
                const kolory = ["#336699", "#f8df5f", "#0093f5", "#663399", "#f6a2b3", "#0ec22c", "#df6a3c", "#03a9c8", "#059120"]

                if (wzory.length > 0 && wzory.length <= kolory.length) {
                    const canvas = createCanvas(1000, 650)
                    const wConfig = {
                        width: 1000,
                        height: 600,
                    }
                    const ctx = canvas.getContext("2d")

                    ctx.fillStyle = "#FFFFFF"
                    ctx.fillRect(0, 0, 1000, 600)

                    //oś X
                    ctx.strokeStyle = "#000000"
                    ctx.lineWidth = 2
                    ctx.beginPath()
                    ctx.moveTo(0, 300)
                    ctx.lineTo(1000, 300)
                    ctx.stroke()

                    //oś Y
                    ctx.strokeStyle = "#000000"
                    ctx.lineWidth = 2
                    ctx.beginPath()
                    ctx.moveTo(500, 0)
                    ctx.lineTo(500, 600)
                    ctx.stroke()
                    ctx.closePath()

                    const config = {
                        xmin: -50,
                        xmax: 50,
                        ymin: -50,
                        ymax: 50,
                    }

                    for (let _y = (() => config.ymin)(); _y <= config.ymax; _y++) {
                        ctx.strokeStyle = "#000000"
                        ctx.lineWidth = 2
                        ctx.beginPath()
                        ctx.moveTo(495, (wConfig.height / (config.ymax - config.ymin)) * _y + wConfig.height / 2)
                        ctx.lineTo(505, (wConfig.height / (config.ymax - config.ymin)) * _y + wConfig.height / 2)
                        ctx.stroke()
                        ctx.closePath()
                    }
                    for (let _x = (() => config.xmin)(); _x <= config.xmax; _x++) {
                        ctx.strokeStyle = "#000000"
                        ctx.lineWidth = 2
                        ctx.beginPath()
                        ctx.moveTo((wConfig.width / (config.xmax - config.xmin)) * _x + wConfig.width / 2, 295)
                        ctx.lineTo((wConfig.width / (config.xmax - config.xmin)) * _x + wConfig.width / 2, 305)
                        ctx.stroke()
                        ctx.closePath()
                    }
                    // console.log(config)

                    var prevMY = null
                    for (let i = 0; i < wzory.length; i++) {
                        const wzór = wzory[i]
                        const kolor = kolory[i]

                        ctx.strokeStyle = kolor
                        ctx.lineWidth = 2
                        ctx.beginPath()
                        var lineTo = false
                        for (var mx = config.xmin; mx <= config.xmax; mx += 0.025) {
                            // console.log(mx * -1)
                            var my = Number(calculate(wzór.replace(/x/g, mx)))

                            if (isNaN(my) || !isFinite(my)) {
                                if (lineTo) {
                                    ctx.stroke()
                                    ctx.closePath()

                                    ctx.strokeStyle = kolor
                                    ctx.lineWidth = 2
                                    ctx.beginPath()
                                }
                                lineTo = false
                                continue
                            }

                            prevMY = my

                            var px = (wConfig.width / (config.xmax - config.xmin)) * mx + wConfig.width / 2
                            var py = (wConfig.height / (config.ymax - config.ymin)) * -my + wConfig.height / 2

                            if (lineTo) ctx.lineTo(px, py)
                            else ctx.moveTo(px, py)
                            lineTo = true
                        }
                        ctx.stroke()
                        ctx.closePath()
                    }

                    ctx.strokeStyle = "#000000"
                    ctx.lineWidth = 2
                    ctx.beginPath()
                    ctx.moveTo(500, 0)
                    ctx.lineTo(500, 600)
                    ctx.stroke()
                    ctx.closePath()

                    ctx.fillStyle = "gray"
                    ctx.fillRect(0, 600, 1000, 50)
                    // informacje, jaki kolor do którego wzoru
                    var tcw = 10
                    for (let i = 0; i < wzory.length; i++) {
                        ctx.font = "bold 15px sans-serif"
                        const w = ctx.measureText(`y = ${wzory[i]}`).width
                        ctx.fillStyle = kolory[i]
                        ctx.fillRect(tcw, 610, w + 10, 30)
                        ctx.fillStyle = checkFontColor(kolory[i])
                        ctx.fillText(`y = ${wzory[i]}`, tcw + 5, 630)
                        tcw += w + 20
                    }

                    const buffer = canvas.toBuffer("image/png")
                    main.files = [new AttachmentBuilder().setFile(buffer).setName("wykres.png")]
                } else {
                    main.content = `${customEmoticons.denided} Maksymalna ilość wykresów to ${kolory.length}! Pamiętaj, aby je oddzielać je średnikami lub pionową kreską ("|")`
                }
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

        if (main.content) main.content = main.content.replace(/{uM}/g, `<@${user.id}>`)
        return main
    },
}
