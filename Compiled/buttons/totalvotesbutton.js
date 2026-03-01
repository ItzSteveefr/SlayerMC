const { ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    customID: 'totalvotes',
    async execute(interaction) {
        const totalvotesbutton = new ButtonBuilder()
        .setCustomId('totalvotes')
        .setEmoji('💭')
        .setLabel('Votes')
        .setStyle(ButtonStyle.Secondary)
    }

};