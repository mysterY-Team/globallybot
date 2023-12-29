const { CommandInteraction, Client } = require("discord.js")
const { customEmoticons } = require("../../config")
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

## \`\u00A70\` Zanim to:
- Użytkownik **sam** powinien pilnować swojego odblokowania, gdyby był odblokowany.
- **Nie** jesteśmy jeszcze w stanie sami usunąć wiadomości.
- Użytkownik, aby rozpocząć przygodę z GC, potrzebuje swojego profilu

## \`\u00A71\` Zawartość tekstu
1. Ten GlobalChat jest stworzony dla każdego użytkownika, także nie obrażaj i nie wyzywaj którąkolwiek ze stron. Oczywiście, jeżeli nie ma nic przeciwko, to wyzywaj umiarkowanie.
2. Pingi są blokowane z automatu.
3. Staraj się unikać przekleństw, ale jeżeli już musisz użyć, zapisz go w \\|\\|spoilerze\\|\\| - za nieocenzurowane mogą być uwagi, a nawet blokada
4. Na wszelkie treści:
 - wrażliwe
 - polityczne
 - wyłudzające/scamerskie
 - zagrażające życiu
 - pornograficzne
 - inne zawierające informacje poufne lub bezpieczeństwa
będzie nakładana kara **aż do odwołania**.`
        let text2 = `## \`\u00A72\` Zawartość plików
1. Bot przyjmuje tylko zdjęcia, filmy i dźwięki w celu bezpieczeństwa. Za inne pliki wysłane przez linki, jeżeli w jakikolwiek sposób mogą zagrażać użytkownikowi, jest nakładana blokada użytkownikowi **aż do odwołania**.
2. Jeżeli film będzie zawierać kod, który modyfikuje jego parametry, czy powoduje skutki typu wymuszone zamknięcie Discorda, ta osoba jest blokowana **aż do odwołania**.
3. Wszystkie treści wspomniane w \`\u00A71 ptk. 4\` są także wliczane w pliki i tak samo karane.
 - Memy polityczne, rasistowskie, itp. są dozwolone, ale nie może obrażać w większym stopniu danej grupy/osoby.

## \`\u00A73\` Wysyłanie wiadomości
1. Każda wysłana wiadomość osoby jest konwertowana na Webhook zawierająca ID użytkownika, kanału i serwera oraz jego nazwę użytkownika. Jesteśmy w stanie Cię namierzyć!
2. Jeżeli wysłana wiadomość dostała reakcję X (${customEmoticons.denided}), powodem może być:
 - Zablokowanie dostępu do GlobalChata;
 - Użycie niedozwolonego linku.
 - Brak wymagań wiekowych`

        interaction.reply(text1).then(() => {
            interaction.followUp(text2)
        })
    },
}
