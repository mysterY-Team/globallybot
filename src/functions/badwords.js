const alternativeLetters = {
    a: ["4", "@", "ą", "🅰️", "🇦"],
    b: ["🇧", "🅱️"],
    c: ["ć", "🇨"],
    d: ["🇩"],
    e: ["3", "ę", "🇪"],
    // f: [],
    g: ["6", "б"],
    h: ["ch"],
    i: ["1"],
    // j: [],
    // k: [],
    l: ["ł"],
    // m: [],
    n: ["ń"],
    o: ["0", "ó"],
    ó: ["u", "00", "oo", "0o", "o0"],
    // p: [],
    // q: [],
    // r: [],
    // s: [],
    // t: [],
    u: ["ó", "00", "oo", "0o", "o0"],
    // v: [],
    // w: [],
    x: ["ks"],
    // y: [],
    z: ["ż", "ź", "ž"],
    "/": ["-", "_", ".", " "],
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
    "hit/ler",
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
    "senud",
    "lgbt",
    "tbgl",
    "sex",
    "sexx",
    "sexxx",
    "sexu",
    "sexxu",
    "sexxxu",
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
        word = word.replace(/\//, "\\/").replace(/\*/, "\\*").replace(/\./, "\\.")
        const regex = new RegExp(`([^a-z0-9])${word}([^a-z0-9])|^(${word}(?: *))+`, "i")
        if (regex.test(text)) {
            return { checked: true, badWord: bannedWords[i] }
        }
    }
    return { checked: false }
}
