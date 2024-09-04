const { ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    customID: 'rej',
    async execute(interaction) {
        new ButtonBuilder()
        .setCustomId('rej')
        .setEmoji('<:7943pixelrejected:1278745786435506279>')
        .setLabel('Reject')
        .setStyle(ButtonStyle.Danger)
    }

};