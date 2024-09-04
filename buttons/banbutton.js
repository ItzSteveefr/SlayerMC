const { ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    customID: 'ban',
    async execute(interaction) {
        new ButtonBuilder()
            .setCustomId('ban')
            .setLabel('Ban')
            .setEmoji('🔨')
            .setStyle(ButtonStyle.Danger);
    }
};
