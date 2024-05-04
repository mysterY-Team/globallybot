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

function gcdata_create(accountCreated) {
    return {
        isBlocked: false,
        blockReason: "",
        birth: accountCreated,
    }
}

const imacaData = {
    create: () => {
        return {
            cardID: 0,
            name: "Użytkownik ImaCarrrd",
            description: "Brak podanego opisu.",
            nameGradient1: "#0B8553",
            nameGradient2: "#74B198",
            bannerURL: null,
        }
    },
    encode: (data) => {
        var obj = data.split("{=·}")
        var newData = imacaData.create()
        return {
            isBlocked: $$.stob(obj[0]),
            blockReason: obj[1],
            birth: obj[2],
        }
    },
    decode: (data) => {
        return Object.values(data).join("{=·}")
    },
}

module.exports = {
    gcdata: {
        create: gcdata_create,
        encode: (data) => {
            if (typeof data === "object") {
                var newData = gcdata_create(data.birth)
                newData.isBlocked = data.block.is
                newData.blockReason = data.block.reason
                return newData
            }
            var obj = data.split("{=·}")
            var newData = gcdata_create(obj[2])
            newData.isBlocked = $$.stob(obj[0]) ?? newData.isBlocked
            newData.blockReason = obj[1] ?? newData.blockReason
            return newData
        },
        decode: (data) => {
            return Object.values(data).join("{=·}")
        },
    },
}
