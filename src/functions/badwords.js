import { listenerLog } from "./useful.js"

/**
 *
 * @param {string} mainString
 * @returns {string[]}
 */
function expandLetterCombinations(mainString) {
    const allCombs = []
    const alv = {
        o: ["o", "🇴", "⭕", "0", "🅾️", "<a:o1:1289949453356109924>"],
    }

    function generateCombinations(prefix, remaining) {
        if (remaining.length === 0) {
            allCombs.push(prefix)
            return
        }

        const currentChar = remaining[0]
        const restOfString = remaining.slice(1)

        if (alv[currentChar]) {
            for (const replacement of alv[currentChar]) {
                generateCombinations(prefix + replacement, restOfString)
            }
        } else {
            generateCombinations(prefix + currentChar, restOfString)
        }
    }

    generateCombinations("", mainString)
    return allCombs
}

const alettersVars = {
    U: ["🇺", ...expandLetterCombinations("oo")],
}

const alternativeLetters = {
    a: ["4", "@", "ą", "🅰️", "🇦"],
    b: ["8", "🇧", "🅱️"],
    c: ["ć", "🇨"],
    d: ["🇩"],
    e: ["3", "ę", "🇪"],
    f: ["🇫"],
    g: ["6", "б", "🇬"],
    h: ["ch", "🇭"],
    i: ["1", "ℹ️"],
    j: ["🇯"],
    k: ["🇰"],
    l: ["ł", "🇱"],
    m: ["🇲"],
    n: ["ń", "🇳"],
    o: ["0", "ó", "⭕", "🇴", "🅾️", "<a:o1:1289949453356109924>"],
    ó: ["u", ...alettersVars.U],
    p: ["🇵"],
    // q: [],
    r: ["🇷"],
    // s: [],
    // t: [],
    u: ["ó", ...alettersVars.U],
    // v: [],
    // w: [],
    x: ["ks", "kss", "ksss", "❌", "✖️"],
    // y: [],
    z: ["ż", "ź", "ž"],
    "/": ["-", "_", ".", " ", "*", "**"],
}

const bannedWords = [
    // czarnoskórzy
    "nigger",
    "niggers",
    "nigers",
    "nigga",
    "niga",
    "nyga",
    "czarnuh",
    "czarnoskórych",
    "czarno/skórych",
    "czarnymen",
    "czarnuhu",
    "niggerze",
    "nigerze",
    "aggin",
    "nig/er",
    "nigg/er",
    "nygga",
    "reggin",

    // nasizm/fasyzm/komunizm
    "hitler",
    "hitla",
    "hit/ler",
    "hi/tler",
    "hi/tla",
    "hit/la",
    "adolf",
    "żyd",
    "żyda",
    "żydzi",
    "żydów", //dla pierwszej alternatywny
    "żydow", //dla drugiej alternatywy
    "sta/lin",
    "sta/lin",

    // kysowate
    "zdechnij",
    "zdehnij",
    "umrzyj",
    "zabij sie",
    "zgin",
    "zgiń",
    "kys",
    "gkys",
    "kill yourself",
    "kill your/self",
    "kil yourself",
    "kil your/self",

    // zwyzywane
    "kurwo",
    "kurewko",
    "kurewka",
    "kurwą",
    "smiec",
    "cwel",
    "pedal",
    "pedale",
    "pierdolony",
    "pierdolona",
    "popierdolona",
    "popierdolony",
    "pojebany",
    "idioto",
    "idiotka",
    "idiotką",
    "idiotko",
    "zjebany",
    "zjebie",
    "huju",
    "hujowy",
    "hujowy",
    "huj mu",
    "huj jej",
    "huj ci",
    "szmato",
    "szmata",
    "przyjeb",
    "przyjebany",
    "przyjebana",
    "rozjebana",
    "rozjebany",
    "zjebana",
    "zjebany",
    "zjeb",
    "debil",
    "debilka",
    "debilko",
    "dziwko",
    "dziwka",

    // inne
    "nudes",
    "nudesy",
    "nudeses",
    "nudesik",
    "nudesiki",
    "nudesiczki",
    "senud",
    "ysenud",
    "sesenud",
    "lgbt",
    "tbgl",
    "sex",
    "sexx",
    "sexxx",
    "sexxxx",
    "sexxxxx",
    "sexu",
    "sexxu",
    "sexxxu",
    "sexxxxu",
    "sexxxxxu",
]

export function checkAnyBadWords(text) {
    for (let i = 0; i < bannedWords.length; i++) {
        let word = ""
        for (let j = 0; j < bannedWords[i].length; j++) {
            const letter = bannedWords[i][j]
            if (alternativeLetters[letter]) {
                word += `(${letter}|${alternativeLetters[letter].join("|")})`
            } else {
                word += letter
            }
        }
        // console.log(word)
        word = word.replace(/\//g, "\\/").replace(/\*/g, "\\*").replace(/\./g, "\\.")
        const regex = new RegExp(`([^a-z0-9])${word}([^a-z0-9])|^(${word}(?: *))+|${word}$`, "im")
        if (regex.test(text)) {
            return { checked: true, badWord: bannedWords[i] }
        }
    }
    return { checked: false }
}

listenerLog(
    0,
    "[D] Zarejestrowano " +
        Object.entries(alternativeLetters)
            .map((x) => x.flat())
            .flat().length +
        " kombinacji liter"
)
listenerLog(0, "[D] Zarejestrowano " + bannedWords.length + " słów")
