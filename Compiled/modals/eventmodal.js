const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } = require('discord.js');


module.exports = {
    customID: 'modal',
    async execute(interaction, client, args) {
        const modal = new ModalBuilder()
        .setTitle("EVENT REGISTERATION")
        .setCustomId('modal')

        const name = new TextInputBuilder()
        .setCustomId('name')
        .setRequired(true)
        .setLabel("What's your in-game name?")
        .setMaxLength(37)
        .setMinLength(2)
        .setPlaceholder('(E.g ItzStevee)')
        .setStyle(TextInputStyle.Short);

        const about = new TextInputBuilder()
        .setCustomId('about')
        .setRequired(true)
        .setLabel("Which event are you signing up for?")
        .setMinLength(3)
        .setMaxLength(1024)
        .setPlaceholder('Will be mentioned on the announcement of the event')
        .setStyle(TextInputStyle.Paragraph);

        const about2 = new TextInputBuilder()
        .setCustomId('about2')
        .setRequired(true)
        .setLabel("Have you read the event rules carefully?")
        .setMaxLength(30)
        .setMinLength(2)
        .setStyle(TextInputStyle.Short);

        const about3 = new TextInputBuilder()
        .setCustomId('about3')
        .setRequired(true)
        .setLabel("List teammates info (ignore if solo).")
        .setMaxLength(1024)
        .setMinLength(2)
        .setPlaceholder('Eg: ItzStevee (ign), Bladez  (ign), etc...')

        .setStyle(TextInputStyle.Paragraph);

        const about5 = new TextInputBuilder()
        .setCustomId('about5')
        .setRequired(true)
        .setLabel("Are you sure you'll be online for the event?")
        .setMaxLength(30)
        .setMinLength(2)
        .setPlaceholder('Eg: yes, no')
        .setStyle(TextInputStyle.Short);

        const firstActionRow = new ActionRowBuilder().addComponents(name)
        const secondActionRow = new ActionRowBuilder().addComponents(about)
        const thirdActionRow = new ActionRowBuilder().addComponents(about2)
        const forthActionRow = new ActionRowBuilder().addComponents(about3)
        const fifthActionRow = new ActionRowBuilder().addComponents(about5)

        modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, forthActionRow, fifthActionRow)
    }
};