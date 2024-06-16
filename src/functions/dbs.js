const $$ = {
    stob(string) {
        if (!string) return null
        switch (string) {
            case "1":
            case "true":
                return true
            case "0":
            case "false":
                return false
            default:
                return null
        }
    },
}

function gcdata_create() {
    return {
        isBlocked: false,
        blockReason: "",
        timestampToSendMessage: Date.now() + 3000,
        timestampToTab: Math.floor(Date.now() / 1000),
        blockTimestampToTab: Math.floor(Date.now() / 1000),
    }
}

function imacaData_create() {
    return {
        cardID: 0,
        name: "Użytkownik ImaCarrrd",
        description: "Brak podanego opisu.",
        nameGradient1: "#0B8553",
        nameGradient2: "#74B198",
        bannerURL: null,
    }
}

function gcdataGuildS(data) {
    data = data.split(",")
    return {
        channel: data[0],
        webhook: data[1] ?? "none",
        timestamp: Number(data[2]) || Date.now() - 1,
    }
}

module.exports = {
    gcdata: {
        create: gcdata_create,
        encode: (data) => {
            var obj = data.split("{=·}")
            var newData = gcdata_create()

            newData.isBlocked = $$.stob(obj[0]) ?? newData.isBlocked
            newData.blockReason = obj[1] ?? newData.blockReason
            newData.timestampToSendMessage = Number(obj[2]) ?? Date.now() - 2
            newData.timestampToTab = Number(obj[3]) ?? newData.timestampToTab
            newData.blockTimestampToTab = Number(obj[4]) ?? newData.blockTimestampToTab

            return newData
        },
        decode: (data) => {
            return Object.values(data).join("{=·}")
        },
    },
    gcdataGuild: {
        encode: (data) => {
            //console.log(data)
            data = data.split("}")
            data = data.filter((x) => x).map((item) => item.split("{"))
            var newData = {}
            data.forEach((item) => (newData[item[0]] = gcdataGuildS(item[1])))
            return newData
        },
        decode: (data) => {
            var newData = []
            for (const [key, value] of Object.entries(data)) {
                newData.push(`${key}{${Object.values(value).join(",")}}`)
            }
            return newData.join("")
        },
    },
    imacaData: {
        create: imacaData_create,
        encode: (data) => {
            var obj = data.split(/{=·}|\u0000/g)
            var newData = imacaData_create()
            newData.cardID = Number(obj[0]) ?? newData.cardID
            newData.name = obj[1] ?? newData.name
            newData.description = obj[2] ?? newData.description
            newData.nameGradient1 = obj[3] ?? newData.nameGradient1
            newData.nameGradient2 = obj[4] ?? newData.nameGradient2
            newData.bannerURL = !obj[5] ? null : obj[5]
            return newData
        },
        decode: (data) => {
            return Object.values(data).join("\u0000")
        },
    },
}
