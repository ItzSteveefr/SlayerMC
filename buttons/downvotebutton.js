const { ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    customID: 'downv',
    async execute(interaction) {
        const downvotebutton = new ButtonBuilder()
        .setCustomId('downv')
        .setEmoji('<:tdown:1162598331390889994>')
        .setLabel('Downvote')
        .setStyle(ButtonStyle.Primary)
    }

};