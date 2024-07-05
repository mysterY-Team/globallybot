const { AttachmentBuilder } = require("discord.js")
const { createCanvas, Image, SKRSContext2D, Path2D } = require("@napi-rs/canvas")
const { drawText } = require("canvas-txt")
const { readFile } = require("fs/promises")
const { request } = require("undici")
const { generateGradientText } = require("./gradient")
const { db } = require("../config")

const classes = [
    {
        name: "Klasyczny styl Globally",
        TextDesc: {
            MaxHeight: 477,
            FontName: "Nova Square,Noto Emoji",
            TextSize: 24,
            LineWidth: undefined,
        },
    },
    {
        name: "Styl Starcia Internetu (twórcy patYczakus)",
        TextDesc: {
            MaxHeight: 595,
            FontName: "Audiowide,Noto Emoji",
            TextSize: 21,
            LineWidth: 26,
        },
    },
    {
        name: "Hackerman (twórcy patYczakus)",
        TextDesc: {
            MaxHeight: 590,
            FontName: "Space Mono,DoCoMo Emoji,Firefox Emoji",
            TextSize: 20,
            LineWidth: 24,
        },
    },
    {
        name: "Geometryczny ImaCarrrd (twórcy vehti)",
        TextDesc: {
            MaxHeight: 550,
            FontName: "Source Code Pro,Noto Emoji",
            TextSize: 20,
            LineWidth: 25,
        },
    },
]

async function createCarrrd(data, user) {
    const canvas = createCanvas(700, 1000)
    const context = canvas.getContext("2d")

    /**
     *
     * @param {SKRSContext2D} $canvasContext
     * @param {number} x
     * @param {number} y
     * @param {number} wh
     */
    async function setImageInCircle($canvasContext, x, y, wh, img) {
        $canvasContext.beginPath()
        $canvasContext.arc(x + wh / 2, y + wh / 2, wh / 2, 0, Math.PI * 2, true)
        $canvasContext.closePath()
        $canvasContext.save()
        $canvasContext.clip()
        const { body } = await request(img)
        const imgs = new Image()
        imgs.src = Buffer.from(await body.arrayBuffer())
        $canvasContext.drawImage(imgs, x, y, wh, wh)
        $canvasContext.restore()
    }

    /**
     *
     * @param {SKRSContext2D} $canvasContext
     * @param {number} x
     * @param {number} y
     * @param {string} text
     * @param {`#${string}`[]} colors
     * @param {string} font
     * @param {string} [alignX="left"]
     */
    function createGradientText($canvasContext, x, y, text, colors, font) {
        var info = generateGradientText(colors, text)
        var width = 0

        for (let i = 0; i < info.length; i++) {
            $canvasContext.font = font
            $canvasContext.fillStyle = info[i].color
            const letterW = $canvasContext.measureText(info[i].text).width
            $canvasContext.fillText(info[i].text, x + width, y)
            width += letterW
        }
    }

    switch (data.cardID) {
        case 0: {
            if (data.bannerURL !== null) {
                const minHeight = 300

                const { body } = await request(data.bannerURL)
                const banner = new Image()
                banner.src = Buffer.from(await body.arrayBuffer())
                var width = canvas.width
                var height = (canvas.width / banner.width) * banner.height
                if (height < minHeight) {
                    width = (minHeight / height) * width
                    height = minHeight
                }
                context.drawImage(banner, Math.min((canvas.width - width) / 2, 0), Math.min((minHeight - height) / 2, 0), width, height)
            }

            const background = await readFile("./src/others/imgs/imacarrrd0.png")
            const backgroundImage = new Image()
            backgroundImage.src = background
            context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height)

            await setImageInCircle(context, 23, 123, 210, user.displayAvatarURL({ format: "png", size: 512 }))

            createGradientText(context, 23, 396, data.name, [data.nameGradient1, data.nameGradient2, "#FFFFFF"], "68px Jersey 10")
            createGradientText(context, 23, 443, user.username, [data.nameGradient1, data.nameGradient2, "#FFFFFF"], "34px Jersey 10")

            drawText(context, data.description, {
                x: 23,
                y: 500,
                width: 654,
                height: classes[0].TextDesc.MaxHeight,
                fontSize: classes[0].TextDesc.TextSize,
                align: "left",
                vAlign: "top",
                font: classes[0].TextDesc.FontName,
            })
            break
        }
        case 1: {
            if (data.bannerURL === null) {
                const add = await readFile("./src/others/imgs/imaca_addtional1_1.png")
                const addimg = new Image()
                addimg.src = add
                context.drawImage(addimg, 104, 0, 596, (596 / canvas.width) * 300)
            } else {
                const minWidth = 596
                const minHeight = (minWidth / canvas.width) * 300

                const { body } = await request(data.bannerURL)
                const banner = new Image()
                banner.src = Buffer.from(await body.arrayBuffer())
                var width = minWidth
                var height = (minWidth / banner.width) * banner.height
                if (height < minHeight) {
                    width = (minHeight / height) * width
                    height = minHeight
                }
                context.drawImage(banner, Math.min((596 - width) / 2 + 104, 104), Math.min((minHeight - height) / 2, 0), width, height)
            }

            const background = await readFile("./src/others/imgs/imacarrrd1.png")
            const backgroundImage = new Image()
            backgroundImage.src = background
            context.drawImage(backgroundImage, 0, 0, 700, 1000)

            await setImageInCircle(context, 8, 73, 160, user.displayAvatarURL({ format: "png", size: 512 }))

            createGradientText(context, 23, 355, data.name, [data.nameGradient1, data.nameGradient2, "#000000"], "44px Audiowide")
            createGradientText(context, 140, 295, user.username, [data.nameGradient1, data.nameGradient2, "#000000"], "21px Audiowide")

            drawText(context, data.description, {
                x: 23,
                y: 375,
                width: 654,
                height: classes[1].TextDesc.MaxHeight,
                fontSize: classes[1].TextDesc.TextSize,
                align: "left",
                vAlign: "top",
                font: classes[1].TextDesc.FontName,
                lineHeight: classes[1].TextDesc.LineWidth,
            })

            break
        }
        case 2: {
            if (data.bannerURL !== null) {
                const minHeight = 300

                const { body } = await request(data.bannerURL)
                const banner = new Image()
                banner.src = Buffer.from(await body.arrayBuffer())
                var width = canvas.width
                var height = (canvas.width / banner.width) * banner.height
                if (height < minHeight) {
                    width = (minHeight / height) * width
                    height = minHeight
                }
                context.drawImage(banner, Math.min((canvas.width - width) / 2, 0), Math.min((minHeight - height) / 2, 0), width, height)

                context.fillStyle = "rgba(65, 65, 65, 0.5)"
                context.fillRect(0, 0, 700, 300)
            } else {
                context.fillStyle = "rgb(65, 65, 65)"
                context.fillRect(0, 0, 700, 300)
            }

            {
                const { body } = await request(user.displayAvatarURL({ format: "png", size: 512 }))
                const imgs = new Image()
                imgs.src = Buffer.from(await body.arrayBuffer())
                context.drawImage(imgs, 50, 130, 130, 130)
            }

            createGradientText(context, 50, 100, data.name, [data.nameGradient1, data.nameGradient2, "#FFFFFF"], "45px Galiver Sans")
            createGradientText(context, 190, 152, user.username, [data.nameGradient1, data.nameGradient2, "#FFFFFF"], "22px Galiver Sans")

            context.font = "20px Galiver Sans"
            context.fillStyle = "#FFF"
            context.fillText(
                `In Discord: ${user.createdAt.getDate() < 10 ? "0" : ""}${user.createdAt.getDate()}-${user.createdAt.getMonth() < 9 ? "0" : ""}${
                    user.createdAt.getMonth() + 1
                }-${user.createdAt.getFullYear()} ${user.createdAt.getHours() < 10 ? "0" : ""}${user.createdAt.getHours()}:${
                    user.createdAt.getMinutes() < 10 ? "0" : ""
                }${user.createdAt.getMinutes()}:${user.createdAt.getSeconds() < 10 ? "0" : ""}${user.createdAt.getSeconds()}`,
                190,
                200
            )
            context.fillText(`ID: ${user.id}`, 190, 225)
            context.fillText(`Modules: ${Object.keys(db.get(`userData/${user.id}`).val).length}`, 190, 250)

            context.fillStyle = "rgb(65, 65, 65)"
            context.fillRect(0, 300, 700, 700)

            // ekranik jak z MAC OS
            context.fillStyle = "black"
            context.beginPath()
            context.roundRect(20, 320, 660, 660, 25)
            context.fill()
            context.closePath()

            context.beginPath()
            context.fillStyle = "#BBB"
            context.roundRect(21, 321, 658, 50, [25, 25, 0, 0])
            context.fill()
            context.closePath()

            // x=21 y=371 w=658 h=610
            // m=10 > x=31 y=381 w=638 h=590

            //okrągłe przyciski na wzór MAC OS
            var colors = ["#FC5F51", "#FDBE02", "#0ECD33"]
            for (let i = 0; i < colors.length; i++) {
                context.beginPath()
                context.fillStyle = colors[i]
                context.arc(47 + 30 * i, 347, 11, 0, Math.PI * 2, false)
                context.fill()
            }
            context.closePath()

            context.font = "20px Space Mono"
            context.fillStyle = "black"
            context.fillText("About me", 320, 355)

            context.fillStyle = "#0F0"
            drawText(context, data.description, {
                x: 31,
                y: 381,
                width: 638,
                height: classes[2].TextDesc.MaxHeight,
                fontSize: classes[2].TextDesc.TextSize,
                align: "left",
                vAlign: "top",
                font: classes[2].TextDesc.FontName,
                lineHeight: classes[2].TextDesc.LineWidth,
            })

            const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
            const idata = imageData.data
            const contrast = 1.37 // Przykładowy współczynnik kontrastu
            for (let i = 0; i < idata.length; i += 4) {
                const randomValue = Math.round(Math.random() * 50)
                // const randomValue = 0

                const r = idata[i]
                const g = idata[i + 1]
                const b = idata[i + 2]
                // Przekształcenie wartości kolorów pikseli (np. zwiększenie kontrastu)
                idata[i] = Math.min(255, Math.max(0, (r - 128 - randomValue) * contrast + 128))
                idata[i + 1] = Math.min(255, Math.max(0, (g - 128 - randomValue) * contrast + 128))
                idata[i + 2] = Math.min(255, Math.max(0, (b - 128 - randomValue) * contrast + 128))
            }
            context.putImageData(imageData, 0, 0)

            const crt = await readFile("./src/others/crt.png")
            const crtBG = new Image()
            crtBG.src = crt
            for (i = 0; i < 2; i++) context.drawImage(crtBG, 0, 0, 700, 2300)

            break
        }
        case 3: {
            context.fillStyle = "white"
            context.fillRect(0, 0, 700, 1000)
            context.fillStyle = "black"
            context.beginPath()
            context.roundRect(20, 320, 660, 660, 25)
            context.fill()
            context.closePath()

            context.fillStyle = "white"
            context.fillRect(250, 330, 200, 70, 25)
            context.fillStyle = "black"
            context.beginPath()
            context.roundRect(90, 15, 500, 50, 300)
            context.fill()
            context.closePath()

            context.fillStyle = "black"
            context.font = "bold 27px Source Code Pro"
            context.textAlign = "center"
            context.fillText("About me", canvas.width / 2, 376)

            context.fillStyle = "white"
            drawText(context, data.description, {
                x: 30,
                y: 410,
                width: 640,
                height: classes[3].TextDesc.MaxHeight,
                fontSize: classes[3].TextDesc.TextSize,
                fontWeight: "bold",
                align: "center",
                vAlign: "top",
                font: classes[3].TextDesc.FontName,
                lineHeight: classes[3].TextDesc.LineWidth,
            })

            function getRandomInt(min, max) {
                return Math.floor(Math.random() * (max - min)) + min
            }

            function getRandomAngle() {
                return Math.random() * 2 * Math.PI
            }

            function isPositionValid(x, y, size) {
                const staticShapes = [
                    { x: 10, y: 10, width: 60, height: 60 },
                    { x: 635, y: 10, width: 60, height: 60 },
                    { x: 635, y: 270 - 25, width: 50, height: 50 },
                    { x: 10, y: 270 - 25, width: 50, height: 50 },
                    { x: 20, y: 310, width: 660, height: 660 },
                    { x: 250, y: 330, width: 200, height: 80 },
                ]

                for (const shape of staticShapes) {
                    if (x < shape.x + shape.width && x + size > shape.x && y < shape.y + shape.height && y + size > shape.y) {
                        return false
                    }
                }
                return true
            }

            function drawRandomShape() {
                let x, y, size, angle

                do {
                    x = getRandomInt(20, 700 - 80)
                    y = getRandomInt(20, 310 - 80)
                    size = getRandomInt(50, 80)
                } while (!isPositionValid(x, y, 80))

                angle = getRandomAngle()
                context.save()
                context.translate(x + size / 2, y + size / 2)
                context.rotate(angle)
                context.translate(-(x + size / 2), -(y + size / 2))

                context.beginPath()
                context.moveTo(x, y)
                context.lineTo(x + size, y)
                context.lineTo(x, y + size)
                context.closePath()
                context.stroke()
                context.restore()

                do {
                    x = getRandomInt(20, 700 - 80)
                    y = getRandomInt(20, 310 - 80)
                } while (!isPositionValid(x, y, 80))

                angle = getRandomAngle()
                context.save()
                context.translate(x + size / 2, y + size / 2)
                context.rotate(angle)
                context.translate(-(x + size / 2), -(y + size / 2))

                context.beginPath()
                context.moveTo(x, y)
                context.lineTo(x + size, y)
                context.lineTo(x, y + size)
                context.closePath()
                context.stroke()
                context.restore()

                const rectangle = new Path2D()
                rectangle.rect(10, 10, 50, 50)
                rectangle.rect(20, 20, 50, 50)
                rectangle.rect(635, 10, 50, 50)
                rectangle.rect(625, 20, 50, 50)

                const circle = new Path2D()
                circle.arc(660, 280, 25, 0, 2 * Math.PI)
                const circle1 = new Path2D()
                circle1.arc(650, 270, 25, 0, 2 * Math.PI)
                const circle2 = new Path2D()
                circle2.arc(40, 280, 25, 0, 2 * Math.PI)
                const circle3 = new Path2D()
                circle3.arc(50, 270, 25, 0, 2 * Math.PI)

                context.stroke(rectangle)
                context.stroke(circle)
                context.stroke(circle1)
                context.stroke(circle2)
                context.stroke(circle3)

                do {
                    x = getRandomInt(20, 700 - 65)
                    y = getRandomInt(20, 310 - 65)
                } while (!isPositionValid(x, y, 65))

                angle = getRandomAngle()
                context.save()
                context.translate(x + 37.5, y + 32.475)
                context.rotate(angle)
                context.translate(-(x + 37.5), -(y + 32.475))

                context.beginPath()
                context.moveTo(x, y)
                context.lineTo(x + 75, y)
                context.lineTo(x + 37.5, y + 64.95)
                context.closePath()
                context.stroke()

                context.beginPath()
                context.moveTo(x + 37.5, y + 10)
                context.lineTo(x + 25, y + 30)
                context.lineTo(x + 50, y + 30)
                context.closePath()
                context.stroke()

                context.restore()
            }

            for (let i = 0; i < 5; i++) {
                drawRandomShape()
            }

            await setImageInCircle(context, 30, 120, 150, user.displayAvatarURL({ format: "png", size: 512 }))

            //pobrać szerokość tekstu a potem wyśrodkować
            context.font = "bold 25px Kode Mono"
            var width = context.measureText(data.name).width
            createGradientText(context, 340 - width / 2, 27, data.name, [data.nameGradient1, data.nameGradient2, "#FFFFFF"], "bold 25px Kode Mono")
            context.font = createGradientText(context, 200, 175, user.username, [data.nameGradient1, data.nameGradient2, "#000000"], "bold 30px Kode Mono")
        }
    }

    const attachment = new AttachmentBuilder(canvas.toBuffer("image/png"), { name: `imacarrd_${user.id}.png` })

    return attachment
}

module.exports = {
    createCarrrd,
    classes,
}
