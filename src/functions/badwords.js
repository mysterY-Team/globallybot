import { listenerLog } from "./useful.js"

const alettersVars = {
    O: ["🇴", "0", "ó", "⭕", "🅾️", "0️⃣", "𝕆", "𝕠", "𝕺", "𝖔", "ᴼ", "ᵒ"],
    K: ["k", "🇰", "𝕂", "𝕜", "𝕶", "𝖐", "ᴷ", "ᵏ"],
    S: ["s", "5", "ś", "🇸", "5️⃣", "𝕊", "𝕤", "𝕾", "𝖘", "ˢ"],
    V: ["v", "🇻", "✔️", "☑️", "✅", "𝕍", "𝕧", "𝖁", "𝖛", "ⱽ", "ᵛ"],
    Z: ["z", "ż", "ź", "🇿", "2", "2️⃣", "ℤ", "𝕫", "𝖅", "𝖟", "ᶻ"],
    C: ["c", "ć", "🇨", "©️", "ℂ", "𝕔", "𝕮", "𝖈", "ꟲ", "ᶜ"],
    H: ["h", "🇭", "ℍ", "𝕙", "𝕳", "𝖍", "ᴴ", "ʰ"],
    BLANK: [
        "",
        " ",
        "/",
        "-",
        "_",
        "—",
        "–",
        "*",
        "•",
        "~",
        "|",
        ":",
        ",",
        ".",
        "+",
        "=",
        "^",
        "\\",
        "!",
        "?",
        ";",
        "<",
        ">",
        "(",
        ")",
        "{",
        "}",
        "[",
        "]",
        "'",
        '"',
        "`",
        "´",
        "‘",
        "’",
        "^",
    ],
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

        if (alv[currentChar.toUpperCase()]) {
            for (const replacement of alv[currentChar.toUpperCase()]) {
                generateCombinations(prefix + replacement, restOfString)
            }
        } else {
            generateCombinations(prefix + currentChar, restOfString)
        }
    }

    generateCombinations("", mainString)
    return allCombs
}

alettersVars.U = ["u", "ó", ...expandLetterCombinations("oo"), "🇺", "𝕌", "𝕦", "𝖀", "𝖚", "ᵁ", "ᵘ"]
alettersVars.X = ["x", ...expandLetterCombinations("ks"), ...expandLetterCombinations("kss"), ...expandLetterCombinations("ksss"), "❌", "✖️", "𝕏", "𝕩", "𝖃", "𝖝", "ˣ"]
alettersVars.H.push(...expandLetterCombinations("ch"))

const alternativeLetters = {
    a: ["4", "@", "ą", "🅰️", "🇦", "4️⃣", "𝔸", "𝕒", "𝕬", "𝖆", "ᴬ", "ᵃ"],
    b: ["8", "🇧", "🅱️", "8️⃣", "♾️", "𝔹", "𝕓", "𝕭", "𝖇", "ᴮ", "ᵇ"],
    c: alettersVars.C.slice(1),
    d: ["🇩", "𝔻", "𝕕", "𝕯", "𝖉", "ᴰ", "ᵈ"],
    e: ["3", "ę", "🇪", "3️⃣", "𝔼", "𝕖", "𝕰", "𝖊", "ᴱ", "ᵉ"],
    f: ["🇫", "𝔽", "𝕗", "𝕱", "𝖋", "ꟳ", "ᶠ"],
    g: ["6", "б", "🇬", "6️⃣", "𝔾", "𝕘", "𝕲", "𝖌", "ᴳ", "ᵍ"],
    h: alettersVars.H.slice(1),
    i: ["1", "ℹ️", "🇮", "1️⃣", "𝕀", "𝕚", "𝕴", "𝖎", "ᴵ", "ⁱ"],
    j: ["🇯", "𝕁", "𝕛", "𝕵", "𝖏", "ᴶ", "ʲ"],
    k: alettersVars.K.slice(1),
    l: ["ł", "🇱", "𝕃", "𝕝", "𝕷", "𝖑", "ᴸ", "ˡ"],
    m: ["🇲", "𝕄", "𝕞", "𝕸", "𝖒", "ᴹ", "ᵐ"],
    n: ["ń", "🇳", "ℕ", "𝕟", "𝕹", "𝖓", "ᴺ", "ⁿ"],
    o: alettersVars.O.slice(1),
    p: ["🇵", "ℙ", "𝕡", "𝕻", "𝖕", "ᴾ", "ᵖ"],
    q: ["🇶", ...expandLetterCombinations("ku"), "ℚ", "𝕢", "𝕼", "𝖖", "ꟴ", "𐞥"],
    r: ["🇷", "®️", "ℝ", "𝕣", "𝕽", "𝖗", "ᴿ", "ʳ"],
    s: [alettersVars.S.slice(1), alettersVars.Z],
    t: ["🇹", "𝕋", "𝕥", "𝕿", "𝖙", "ᵀ", "ᵗ"],
    u: alettersVars.U.slice(1),
    v: alettersVars.V.slice(1),
    w: ["🇼", alettersVars.V, "𝕎", "𝕨", "𝖂", "𝖜", "ᵂ", "ʷ"],
    x: alettersVars.X.slice(1),
    y: ["🇾", "𝕐", "𝕪", "𝖄", "𝖞", "ʸ"],
    z: alettersVars.Z.slice(1),
    " ": alettersVars.SPACE.slice(1),
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
    "czarnoskóryh",
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
    "zyd",
    "zyda",
    "zydzi",
    "zyduw", //dla pierwszej alternatywny
    "zydow", //dla drugiej alternatywy
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
    "downie",
    "dalnie",

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
    "lgbtq",
    "tbgl",
    "qtbgl",
    "lezba",
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
    const sep = `(${alettersVars.BLANK.map((x) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})+`
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
        word = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        const regex = new RegExp(`(?:([^a-z0-9])|^)${word}(?:([^a-z0-9])|$)`, "img")
        if (regex.test(text)) {
            return { checked: true, badWord: bannedWords[i] }
        }
    }
    return { checked: false }
}

// Calculate total possible word combinations
function countWordCombinations() {
    let total = 0n
    for (const word of bannedWords) {
        let combinations = 1n
        for (const letter of word) {
            if (alternativeLetters[letter]) {
                combinations *= BigInt(alternativeLetters[letter].length + 1) // +1 for the original letter
            }
        }
        let separatorsLen = BigInt(alettersVars.BLANK.length ** (word.length - 1))
        total += combinations * separatorsLen
    }
    return total.toString()
}

console.log(alettersVars.X)
listenerLog(0, "[BW system] System zakazanych słów włączony poprawnie.", true)
listenerLog(
    1,
    "Kobinacji liter: " +
        Object.entries(alternativeLetters)
            .map((x) => x.flat())
            .flat().length,
    true
)
listenerLog(1, "Słów w zmiennej: " + bannedWords.length + " + " + alettersVars.BLANK.length, true)
listenerLog(1, "Możliwych kombinacji słów: " + countWordCombinations(), true)
