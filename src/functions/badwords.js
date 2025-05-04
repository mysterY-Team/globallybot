import { listenerLog } from "./useful.js"

const alettersVars = {
    O: ["ó", "⭕", "🇴", "🅾️"],
    BLANK: ["", " ", "/", "-", "_", "—", "–", "*", "•", "~", "\\|", ":", ",", ".", "\\+", "=", "\\^"],
    SPACE: [" ", "_", "-", "—", "–"],
}

/**
 *
 * @param {string} mainString
 * @returns {string[]}
 */
function expandLetterCombinations(mainString) {
    const allCombs = []
    const alv = alettersVars

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

alettersVars.U = [...expandLetterCombinations("oo"), "🇺"]

const alternativeLetters = {
    a: ["4", "@", "ą", "🅰️", "🇦", "4️⃣"],
    b: ["8", "🇧", "🅱️", "8️⃣", "♾️"],
    c: ["ć", "🇨", "©️"],
    d: ["🇩"],
    e: ["3", "ę", "🇪", "3️⃣"],
    f: ["🇫"],
    g: ["6", "б", "🇬", "6️⃣"],
    h: ["ch", "🇭"],
    i: ["1", "ℹ️", "🇮", "1️⃣"],
    j: ["🇯"],
    k: ["🇰"],
    l: ["ł", "🇱"],
    m: ["🇲"],
    n: ["ń", "🇳"],
    o: ["0", "ó", "⭕", "🇴", "🅾️", "0️⃣"],
    ó: ["u", ...alettersVars.U],
    p: ["🇵"],
    q: ["🇶"],
    r: ["🇷", "®️"],
    s: ["🇸"],
    t: ["🇹"],
    u: ["ó", ...alettersVars.U],
    v: ["🇻", "✔️", "☑️", "✅"],
    w: ["🇼"],
    x: ["ks", "kss", "ksss", "❌", "✖️"],
    y: ["🇾"],
    z: ["ż", "ź", "ž"],
    " ": alettersVars.SPACE,
}

const bannedWords = [
    // czarnoskórzy
    "nigger",
    "niggers",
    "nigers",
    "nigga",
    "niga",
    "nyga",
    "nygusie",
    "nygers",
    "czarnuh",
    "czarnoskórych",
    "czarnymen",
    "czarnuhu",
    "niggerze",
    "nigerze",
    "aggin",
    "nygga",
    "reggin",

    // nasizm/fasyzm/komunizm
    "hitler",
    "hitla",
    "adolf",
    "żyd",
    "żyda",
    "żydzi",
    "żydów", //dla pierwszej alternatywny
    "żydow", //dla drugiej alternatywy
    "stalin",

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
    "kill yourself",
    "kil yourself",
    "kil yourself",

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
    const sep = `(${alettersVars.BLANK.join("|")})+`
    for (let i = 0; i < bannedWords.length; i++) {
        let word = []
        for (let j = 0; j < bannedWords[i].length; j++) {
            const letter = bannedWords[i][j]
            if (alternativeLetters[letter]) {
                word.push(`(${letter}|${alternativeLetters[letter].join("|")})`)
            } else {
                word.push(letter)
            }
        }
        word = word.join(sep)
        // console.log(word)
        word = word.replace(/\//g, "\\/").replace(/\*/g, "\\*").replace(/\./g, "\\.")
        const regex = new RegExp(`(?:([^a-z0-9])|^)${word}(?:([^a-z0-9])|$)`, "img")
        if (regex.test(text)) {
            return { checked: true, badWord: bannedWords[i] }
        }
    }
    return { checked: false }
}

// Calculate total possible word combinations
function countWordCombinations() {
    let total = 0
    for (const word of bannedWords) {
        let combinations = 1
        for (const letter of word) {
            if (alternativeLetters[letter]) {
                combinations *= (alternativeLetters[letter] ?? []).length + 1 // +1 for the original letter
            }
        }
        let separatorsLen = alettersVars.BLANK.length * (word.length - 1)
        total += combinations + separatorsLen
    }
    return total
}

listenerLog(0, "[BW system] System zakazanych słów włączony poprawnie.", true)
listenerLog(
    1,
    "Kobinacji liter: " +
        Object.entries(alternativeLetters)
            .map((x) => x.flat())
            .flat().length,
    true
)
listenerLog(1, "Słów w zmiennej: " + bannedWords.length, true)
listenerLog(1, "Możliwych kombinacji słów: " + countWordCombinations(), true)
