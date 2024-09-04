const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    dev: true,
    data: new SlashCommandBuilder()
        .setName('report')
        .setDescription('Report a bug or issue with the bot')
        .addSubcommand(subcommand =>
            subcommand
                .setName('bug')
                .setDescription('Report a bug with the bot')
                .addStringOption(option =>
                    option.setName('module_name')
                        .setDescription('The name of the module where the bug occurred')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('description')
                        .setDescription('A brief description of the bug')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('steps_to_reproduce')
                        .setDescription('The steps to reproduce the bug')
                        .setRequired(true)
                )
                .addAttachmentOption(option =>
                    option.setName('image')
                        .setDescription('An image or screenshot of the bug (optional)')
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('server')
                .setDescription('Report an issue with the server')
                .addStringOption(option =>
                    option.setName('message')
                        .setDescription('A message describing the issue')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('invite_link')
                        .setDescription('An invite link to the server where the issue occurred')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('user')
                .setDescription('Report a user for misbehavior')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('The user to report')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('reason')
                        .setDescription('The reason for the report')
                        .setRequired(true)
                )
                .addAttachmentOption(option =>
                    option.setName('image')
                        .setDescription('An image or screenshot of the misbehavior (optional)')
                )
        ),
    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'bug') {
            const moduleName = interaction.options.getString('module_name');
            const description = interaction.options.getString('description');
            const stepsToReproduce = interaction.options.getString('steps_to_reproduce');
            const image = interaction.options.getAttachment('image');

            const reportChannel = interaction.client.channels.cache.get('1279831776264589429');
            if (reportChannel) {
                const reportEmbed = new EmbedBuilder()
                    .setTitle('Bug Report')
                    .addFields(
                        { name: 'Module Name', value: moduleName },
                        { name: 'Description', value: description },
                        { name: 'Steps to Reproduce', value: stepsToReproduce },
                    )
                    .setImage(image?.url);

                await reportChannel.send({ embeds: [reportEmbed] });
                await interaction.reply({ content: 'Thank you for your report! We will look into it as soon as possible', ephemeral: true });
            } else {
                await interaction.reply({ content: 'Sorry, there was an error sending your report. Please try again later', ephemeral: true });
            }
        } else if (interaction.options.getSubcommand() === 'server') {
            const message = interaction.options.getString('message');
            const inviteLink = interaction.options.getString('invite_link');

            const reportChannel = interaction.client.channels.cache.get('1279831776264589429');
            if (reportChannel) {
                const reportEmbed = new EmbedBuilder()
                    .setTitle('Server Issue Report')
                    .addFields(
                        { name: 'Message', value: message },
                        { name: 'Invite Link', value: inviteLink },
                    );

                await reportChannel.send({ embeds: [reportEmbed] });
                await interaction.reply({ content: 'Thank you for your report! We will look into it as soon as possible', ephemeral: true });
            } else {
                await interaction.reply({ content: 'Sorry, there was an error sending your report. Please try again later', ephemeral: true });
            }
        } else if (interaction.options.getSubcommand() === 'user') {
            const user = interaction.options.getUser('user');
            const reason = interaction.options.getString('reason');
            const image = interaction.options.getAttachment('image');

            const reportChannel = interaction.client.channels.cache.get('1279831776264589429');
            if (reportChannel) {
                const reportEmbed = new EmbedBuilder()
                    .setTitle('User Report')
                    .setThumbnail(user.displayAvatarURL())
                    .addFields(
                        { name: 'User', value: `<@${user.id}>`, inline: true },
                        { name: 'Reason', value: reason },
                    )
                    .setImage(image?.url);

                await reportChannel.send({ embeds: [reportEmbed] });
                await interaction.reply({ content: 'Thank you for your report! We will look into it as soon as possible', ephemeral: true });
            } else {
                await interaction.reply({ content: 'Sorry, there was an error sending your report. Please try again later', ephemeral: true });
            }
        }
    }
};
