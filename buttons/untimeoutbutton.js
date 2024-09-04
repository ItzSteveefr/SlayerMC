const { ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    customID: 'untimeout',
    async execute(interaction) {
        new ButtonBuilder()
            .setCustomId('untimeout')
            .setLabel('Untimeout')
            .setEmoji('✅')
            .setStyle(ButtonStyle.Success);
    }
};
