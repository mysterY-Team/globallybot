export default {
    /**
     * @param {Client} client
     * @param {ButtonInteraction} interaction
     * @param {string[]} args
     */
    async execute(client, interaction, ...args) {
        interaction.reply({
            content: `Możesz się odwołać do swojej blokady. Postępuj zgodnie z tymi krokami
1. Dołącz na serwer [support](https://discord.gg/7S3P2DUwAm) i wypełnij wprowadzenie
1. Wejdź w kanał <id:customize> (opcja na samej górze - tutaj nie zadziała) oraz w opcji *Dobierz swoje ulubione projekty* znajdź "Globally"
1. Powinieneś widzieć kanał <#1258535179232874516>. Utwórz post z tagiem "Prośba odblokowania* zawierający
  - Zrzut ekranu blokady, odnośnik wiadomości z kanału <#1265268467167133747> lub treść blokady, czas i jego autora
  - Dowód na niewinność`,
            ephemeral: true,
        })
    },
}
