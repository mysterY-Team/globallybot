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

function gcdataGuildS(data) {
    data = data.split(/,|\u0000/)
    return {
        channel: data[0],
        webhook: data[1] ?? "none",
        createdTimestamp: Number(data[2]) || Math.floor(Date.now() / 1000),
        flag_showGCButtons: $$.stob(data[3]) ?? false,
        flag_useGA: $$.stob(data[4]) ?? true,
        flag_wbUserName: data[5] ?? "%username% (%userrole%;%userid%;%guildid%)",
    }
}

export const gcdata = {
    encode: (data) => {
        var obj = (data ?? "").split(/{=·}|\u0000/g)
        const karma = BigInt(obj[5] ?? 0n)
        return {
            isBlocked: $$.stob(obj[0]) ?? false,
            blockReason: obj[1] ?? "",
            timestampToSendMessage: Number(obj[2] ?? Date.now() - 2),
            timestampToTab: Number(obj[3] ?? Math.floor(Date.now() / 1000) - 1),
            blockTimestampToTab: Number(obj[4] ?? Math.floor(Date.now() / 1000) - 1),
            karma,
            messageID_bbc: obj[6] ?? "",
            /**
             * @type {0 | 1 | 2 | 3 | 4}
             */
            modPerms: Number(obj[7] ?? 0),
            blockTimestamp: Number(obj[8] ?? NaN),
            _sat: Number(obj[9] ?? (karma >= 1000n) * Date.now()),
            gcUses: Number(obj[10] ?? 0),
        }
    },
    decode: (data) => {
        return Object.values(data)
            .map((x) => {
                var n = ""
                switch (typeof x) {
                    case "bigint":
                        n = x.toString()
                        break
                    case "symbol":
                        n = x.toString()
                        break
                    default:
                        n = x
                        break
                }

                return n
            })
            .join("\u0000")
    },
}
export const gcdataGuild = {
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
            newData.push(`${key}{${Object.values(value).join("\u0000")}}`)
        }
        return newData.join("")
    },
}
export const imacaData = {
    encode: (data) => {
        var obj = (data ?? "").split(/{=·}|\u0000/g)
        return {
            cardID: Number(obj[0] ?? 0),
            name: obj[1] ?? "Użytkownik ImaCarrrd",
            description: obj[2] ?? "Brak podanego opisu.",
            nameGradient1: obj[3] ?? "#0B8553",
            nameGradient2: obj[4] ?? "#74B198",
            bannerURL: !obj[5] ? null : obj[5],
        }
    },
    decode: (data) => {
        return Object.values(data).join("\u0000")
    },
}
