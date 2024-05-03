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

const gcdata = {
    create: (accountCreated) => {
        return {
            isBlocked: false,
            blockReason: "",
            birth: accountCreated,
        }
    },
    encode: (data) => {
        if (typeof data === "object") {
            var newData = gcdata.create(data.birth)
            newData.isBlocked = data.block.is
            newData.blockReason = data.block.reason
            return newData
        }
        var obj = data.split("{=·}")
        var newData = gcdata.create(obj[2])
        newData.isBlocked = $$.stob(obj[0]) ?? newData.isBlocked
        newData.blockReason = obj[1] ?? newData.blockReason
        return newData
    },
    decode: (data) => {
        return Object.values(data).join("{=·}")
    },
}
