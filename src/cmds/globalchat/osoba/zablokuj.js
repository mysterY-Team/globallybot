const { CommandInteraction, Client, EmbedBuilder } = require("discord.js")
const { getDatabase, ref, set, get } = require("@firebase/database")
const { firebaseApp, ownersID, customEmoticons, GCmodsID } = require("../../../config")

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        if (!ownersID.includes(interaction.user.id) && !GCmodsID.includes(interaction.user.id))
            //zwraca informację widoczną tylko dla niego za pomocą interaction.reply(), że nie ma odpowiednich permisji.
            return interaction.reply({
                ephemeral: true,
                content: `${customEmoticons.denided} Nie możesz wykonać tej funkcji! Możliwe powody:
                    - Nie jesteś na liście developerów bota
                    - Nie jesteś na liście moderatorów GlobalChata`,
            })

        try {
            interaction.deferReply().then(() => {
                get(ref(getDatabase(firebaseApp), "globalchat/userblocks")).then((snapshot) => {
                    blockList = snapshot.val()

                    if (blockList.includes(interaction.options.get("osoba", true).value)) {
                        interaction.editReply({
                            content: `${customEmoticons.denided} Ta osoba jest zablokowana!`,
                            ephemeral: interaction.inGuild(),
                        })
                        return
                    }

                    var ind = -1
                    for (var i = 0; i < blockList.length; i++) {
                        if (blockList[i] == null) var ind = i
                        break
                    }
                    if (ind == -1) ind = blockList.length
                    blockList[ind] = interaction.options.get("osoba", true).value
                    const embedblock = new EmbedBuilder()
                        .setTitle("Zostałeś zablokowany!")
                        .setDescription(`Od teraz nie będziesz miał dostępu do GlobalChata do odwołania!`)
                        .setColor("Red")
                        .setFields(
                            {
                                name: "Blokowany przez",
                                value: `${(interaction.user.discriminator = "0" ? interaction.user.username : `${interaction.user.username}#${interaction.user.discriminator}`)}`,
                            },
                            {
                                name: "Powód",
                                value: !interaction.options.get("powód") ? customEmoticons.denided : `\`\`\`${interaction.options.get("powód").value}\`\`\``,
                            }
                        )

                    client.users.send(blockList[ind], {
                        embeds: [embedblock],
                    })

                    interaction.editReply({
                        content: `${customEmoticons.approved} Pomyślnie zablokowano użytkownika <@${blockList[ind]}> \`${blockList[ind]}\``,
                        ephemeral: interaction.inGuild(),
                    })
                    set(ref(getDatabase(firebaseApp), "globalchat/userblocks"), blockList)
                })
            })
        } catch (err) {
            interaction.reply({
                content: "Coś poszło nie tak... spróbuj ponownie!",
            })
            console.warn(err)
        }
    },
}
