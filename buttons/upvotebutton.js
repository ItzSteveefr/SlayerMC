const { ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    customID: 'upv',
    async execute(interaction) {
        const upvotebutton = new ButtonBuilder()
        .setCustomId('upv')
        .setEmoji('<:tup:1162598259626352652>')
        .setLabel('Upvote')
        .setStyle(ButtonStyle.Primary)
    }

};