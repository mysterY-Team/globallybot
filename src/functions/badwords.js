const bannedWords = [
    "nigger",
    "hitler",
    "zdechnij",
    "zdehnij",
    "umrzyj",
    "zabij sie",
    "zabij się",
    "czarnuch",
    "kurwo",
    "smieć",
    "smiec",
    "cwel",
    "pedał",
    "pedal",
    "pierdolony",
    "pojebany",
    "czarnuh",
    "nigga",
    "idioto",
    "niga",
    "nyga",
    "kurewko",
    "kurewka",
    "zjebany",
    "zjebie",
    "chuju",
    "szmato",
    "przyjeb",
    "przyjebany",
    "rozjebany",
    "rozjebana",
    "idiotka",
    "zjebana",
    "pierdolona",
    "szmata",
    "chujowa",
    "przyjebana",
    "rozjebana",
    "kurwą",
    "idiotką",
    "chujowa",
    "chujowy",
    "gin",
    "giń",
    "debil",
    "debilka",
    "chuj mu",
    "chuj jej",
    "chuj ci",
    "zgin",
    "zgiń",
    "kys",
    "gkys",
    "pedale",
    "chuju",
    "dziwko",
    "dziwką",
    "idiotko",
    "popierdolona",
    "popierdolony",
    "pierdolona",
    "debilko",
    "dziwka",
    "szmato",
    "czarnuchu",
    "czarnuhu",
    "niggerze",
    "nigerze",
    "cwelu",
    "cweloza",
    "zjeb",
    "zjebana",
    "przyjebana",
    "kill yourself",
    "kill your self",
    "kil yourself",
    "kil your self",
]

function checkAnyBadWords(text) {
    for (let i = 0; i < bannedWords.length; i++) {
        const regex = new RegExp(`([^a-z0-9])${bannedWords[i]}([^a-z0-9])`, "gi")
        if (regex.test(text)) {
            return { checked: true, badWord: bannedWords[i] }
        }
    }
    return { checked: false }
}

module.exports = { checkAnyBadWords }
