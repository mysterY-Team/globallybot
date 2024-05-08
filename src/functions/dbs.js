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
    imacaData: {
        create: imacaData_create,
        encode: (data) => {
            var obj = data.split("{=·}")
            var newData = imacaData_create()
            newData.cardID = (isNaN(Number(obj[0])) ? null : Number(obj[0])) ?? newData.cardID
            newData.name = obj[1] ?? newData.name
            newData.description = obj[2] ?? newData.description
            newData.nameGradient1 = obj[3] ?? newData.nameGradient1
            newData.nameGradient2 = obj[4] ?? newData.nameGradient2
            newData.bannerURL = !obj[5] ? null : obj[5]
            return newData
        },
        decode: (data) => {
            return Object.values(data).join("{=·}")
        },
    },
}
