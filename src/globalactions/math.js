import djs from "discord.js"
const { User, WebhookMessageCreateOptions, AttachmentBuilder } = djs
import conf from "../config.js"
const { customEmoticons } = conf
import { wait, checkFontColor } from "../functions/useful.js"
import canvasPKG from "@napi-rs/canvas"
const { createCanvas } = canvasPKG

export default {
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
                    "- `calc <działanie1> | <działanie2> | ... | <działanieN>` - Oblicza proste, jak i nieco skomplikowane wyrażenie matematyczne (dodawanie, odejmowanie, mnożenie, dzielenie i potęgowanie). Działania oddzielaj pionową kreską",
                    "- `rysuj <wzór1> | <wzór2> | ... | <wzórN>` - Tworzy wykresy danych wzorów. Wzory oddzielaj pionową kreską",
                    "\n||Pamiętaj, aby stosować poprawność w używaniu komend!||",
                ].join("\n")
                break
            }
            case cmds[2]:
            case cmds[3]: {
                if (args.join("").length == 0) {
                    main.content = `${customEmoticons.denided} Argument jest wymagany!`
                    break
                }

                const exprs = args.join("").split(/\||;/g)
                var answ = []

                for (let i = 0; i < exprs.length; i++) {
                    var ans = calculate(exprs[i])
                    if (isNaN(ans)) {
                        main.content = `${customEmoticons.denided} Czy Ty na pewno podałeś dobre działanie?`
                        break
                    }
                    answ.push(ans)
                }

                if (!main.content) {
                    if (answ.length == 1) main.content = `Wynikiem wyrażenia jest **${answ[0]}**.`
                    else main.content = `Oto wszystkie działania:\n${answ.map((x, i) => `- \`${exprs[i]} = ${x}\``).join("\n")}`
                }
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
                    const canvas = createCanvas(2000, 1300)
                    const wConfig = {
                        width: 2000,
                        height: 1250,
                    }
                    const ctx = canvas.getContext("2d")

                    ctx.fillStyle = "#FFFFFF"
                    ctx.fillRect(0, 0, wConfig.width, wConfig.height)

                    //oś X
                    ctx.strokeStyle = "#000000"
                    ctx.lineWidth = 2
                    ctx.beginPath()
                    ctx.moveTo(0, wConfig.height / 2)
                    ctx.lineTo(wConfig.width, wConfig.height / 2)
                    ctx.stroke()

                    //oś Y
                    ctx.strokeStyle = "#000000"
                    ctx.lineWidth = 2
                    ctx.beginPath()
                    ctx.moveTo(wConfig.width / 2, 0)
                    ctx.lineTo(wConfig.width / 2, wConfig.height)
                    ctx.stroke()
                    ctx.closePath()

                    const config = {
                        xmin: -50,
                        xmax: 50,
                        ymin: -100,
                        ymax: 100,
                    }

                    for (let _y = (() => config.ymin)(); _y <= config.ymax; _y++) {
                        ctx.strokeStyle = "#000000"
                        ctx.lineWidth = 2
                        ctx.beginPath()
                        ctx.moveTo(wConfig.width / 2 - 5, (wConfig.height / (config.ymax - config.ymin)) * _y + wConfig.height / 2)
                        ctx.lineTo(wConfig.width / 2 + 5, (wConfig.height / (config.ymax - config.ymin)) * _y + wConfig.height / 2)
                        ctx.stroke()
                        ctx.closePath()
                    }
                    for (let _x = (() => config.xmin)(); _x <= config.xmax; _x++) {
                        ctx.strokeStyle = "#000000"
                        ctx.lineWidth = 2
                        ctx.beginPath()
                        ctx.moveTo((wConfig.width / (config.xmax - config.xmin)) * _x + wConfig.width / 2, wConfig.height / 2 - 5)
                        ctx.lineTo((wConfig.width / (config.xmax - config.xmin)) * _x + wConfig.width / 2, wConfig.height / 2 + 5)
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

                    ctx.fillStyle = "gray"
                    ctx.fillRect(0, wConfig.height, wConfig.width, 50)
                    // informacje, jaki kolor do którego wzoru
                    var tcw = 10
                    for (let i = 0; i < wzory.length; i++) {
                        ctx.font = "bold 15px sans-serif"
                        const w = ctx.measureText(`y = ${wzory[i]}`).width
                        ctx.fillStyle = kolory[i]
                        ctx.fillRect(tcw, wConfig.height + 10, w + 10, 30)
                        ctx.fillStyle = checkFontColor(kolory[i])
                        ctx.fillText(`y = ${wzory[i]}`, tcw + 5, wConfig.height + 30)
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
