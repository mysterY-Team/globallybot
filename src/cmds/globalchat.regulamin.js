const { CommandInteraction, Client } = require("discord.js")
const { customEmoticons } = require("../config")
module.exports = {
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        let text1 = `# Regulamin korzystania z GlobalChata
GlobalChat jest to nic innego, jak komunikacja między serwerami. Chcemy utrzymać porządek i harmonię, dlatego wprowadziliśmy zasady dot. korzystania z tej usługi.
Pisząc wiadomość na jednym z kanałów, gdzie występuje GlobalChat, jednocześnie akceptujesz ten regulamin.

## \`\u00A70\` Definicje
"GlobalChat" to usługa komunikacji między osobami ze serwera, jak i spoza nimi, gdzie wszystkimi procesami zajmują się <@1130423181900001381> oraz jego deweloperzy.
"Użytkownik" to konto zarządzane przez osoby.
"Bot" to konto wiążące komunikację OAuth i zarządzane przez program.

## \`\u00A71\` Zawartość tekstu
1. Ten GlobalChat jest stworzony dla każdego użytkownika, także nie obrażaj którąkolwiek ze stron.
2. Pingi \`everyone\` i \`here\` są usuwane z automatu.
3. Staraj się unikać przekleństw, ale jeżeli już musisz użyć, zapisz go w \\|\\|spoilerze\\|\\| - za nieocenzurowane mogą być uwagi, a nawet blokada do GlobalChat
4. Na wszelkie treści:
 - wrażliwe
 - polityczne
 - wyłudzające/scamerskie
 - zagrażające życiu
 - pornograficzne
 - inne zawierające informacje poufne lub bezpieczeństwa
będzie nakładana kara **aż do odwołania**.

## \`\u00A72\` Zawartość plików
1. Bot przyjmuje tylko zdjęcia i filmy w celu bezpieczeństwa. Inne pliki za pośrednictwem plików są usuwane, jeżeli w jakikolwiek sposób mogą zagrażać
2. Jeżeli film będzie zawierać kod, który modyfikuje jego parametry, czy powoduje skutki typu wymuszone zamknięcie Discorda, ta osoba jest blokowana **aż do odwołania**.
3. Wszystkie treści wspomniane w \`\u00A71 ptk. 4\` są także wliczane w pliki i tak samo karane.`

        let text2 = `## \`\u00A73\` Wysyłanie wiadomości
1. W Internecie nic nie ginie i każda wiadomość, która trafi do kanału GlobalChat, zostaje przechwytywana i trafiana do naszych logów.
2. Każda wysłana wiadomość osoby jest konwertowana na Webhook zawierająca ID użytkownika, kanału i serwera oraz jego nazwę użytkownika. Jesteśmy w stanie Cię namierzyć!
3. Jeżeli wysłana wiadomość dostała reakcję X (${customEmoticons.denided}), powodem może być:
 - Zablokowanie dostępu do GlobalChata;
 - Użycie niedozwolonego linku.`

        interaction.reply(text1).then(() => {
            interaction.followUp(text2)
        })
    },
}
