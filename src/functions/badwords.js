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
    "niger",
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
    "gin",
    "giń",
    "debil",
    "debilka",
    "chuj mu",
    "chuj jej",
]

function checkAnyBadWords(text) {
    text = text.toLowerCase()
    for (let i = 0; i < bannedWords.length; i++) {
        if (text.includes(bannedWords[i])) {
            return { checked: true, badWord: bannedWords[i] }
        }
    }
    return { checked: false }
}

module.exports = { checkAnyBadWords }
