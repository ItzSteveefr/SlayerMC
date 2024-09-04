const { ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    customID: 'appr',
    async execute(interaction) {
        new ButtonBuilder()
        .setCustomId('appr')
        .setLabel('Approve')
        .setEmoji('<:50121checkmark:1278745788935045220>')
        .setStyle(ButtonStyle.Success)
    }

};