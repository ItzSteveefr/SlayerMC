const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const linkSchema = require('../schemas/AntiLinkSchema');
module.exports = {
    dev: true,
    data: new SlashCommandBuilder()
    .setName(`anti-link`)
    .setDescription(`Setup and disable the anti-link system.`)
    .addSubcommand(command => 
        command
        .setName('setup')
        .setDescription(`Setup the anti-link system to delete all links!`)
        .addStringOption(option=> option.setName('permissions').setRequired(true).setDescription(`Choose the perms to BYPASS the anti-link system.`)
        .addChoices(
           { name: 'Manage Channels', value: 'ManageChannels' },
           { name: 'Manage Server', value: 'ManageGuild' },
           { name: 'Embed Links', value: 'EmbedLinks' },
           { name: 'Attach Files', value: 'AttachFiles' },
           { name: 'Manage Messages', value: 'ManageMessages' },
           { name: 'Administrator', value: 'Administrator'}
        )))
    .addSubcommand(command => 
        command
        .setName(`disable`)
        .setDescription(`Disable the Anti-link system.`))
    .addSubcommand(command =>
        command
        .setName(`check`)
        .setDescription(`Check the status of the Anti-link system.`))
    .addSubcommand(command =>
        command
        .setName(`edit`)
        .setDescription(`Edit your Anti-link permissions.`)
        .addStringOption(option=> option.setName('permissions').setRequired(true).setDescription(`Choose the perms to BYPASS the anti-link system.`)
        .addChoices(
            { name: 'Manage Channels', value: 'ManageChannels' },
            { name: 'Manage Server', value: 'ManageGuild' },
            { name: 'Embed Links', value: 'EmbedLinks' },
            { name: 'Attach Files', value: 'AttachFiles' },
            { name: 'Manage Messages', value: 'ManageMessages' },
            { name: 'Administrator', value: 'Administartor'}
        ))),
    async execute (interaction) {

        const { options } = interaction;

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return await interaction.reply({ content: `You must have the manage server permission to manage the Anti-link system.`, ephemeral: true});

        const sub = options.getSubcommand();

        switch (sub) {

                case 'setup':
                const permissions = options.getString('permissions');

                const Data = await linkSchema.findOne({ Guild: interaction.guild.id});

            if (Data) return await interaction.reply({ content: `You already have the link system setup, Do /anti-link disable to disable it`, ephemeral: true});

            if (!Data) {
                linkSchema.create({
                    Guild: interaction.guild.id,
                    Perms: permissions
                })
            }

            const embed = new EmbedBuilder()
            .setColor("DarkRed")
            .setTitle('🔗 Anti-link System')
            .setTimestamp()
            .setFooter({ text: '🔗 Anti-Link system set up'})
            .setDescription(`**> The Anti-link system has\n> been successfully set-up.**\n**• Anti-link bypass permission**\n> ${permissions}`)
            .setThumbnail('https://media.discordapp.net/attachments/1200713640710524961/1265052544690815108/DClogo.png?ex=66d2dd3e&is=66d18bbe&hm=38134a935da0b22bbc64db07785bcf1b0b7c8958c1437304ece0e3fcf6292666&=&format=webp&quality=lossless')
            await interaction.reply({ embeds: [embed] });
        }

        switch (sub) {

            case 'disable':
            await linkSchema.deleteMany();

            const embed2 = new EmbedBuilder()
            .setColor("DarkRed")
            .setTitle('🔗 Anti-link System')
            .setTimestamp()
            .setFooter({ text: '🔗 Anti-Link system removed'})
            .setDescription(`**> Anti-link system has been\n> removed**\n**• Anti-link system was removed**\n> SlayerMC will no longer delete link\n> sent by Members.`)
            .setThumbnail('https://media.discordapp.net/attachments/1200713640710524961/1265052544690815108/DClogo.png?ex=66d2dd3e&is=66d18bbe&hm=38134a935da0b22bbc64db07785bcf1b0b7c8958c1437304ece0e3fcf6292666&=&format=webp&quality=lossless')

            await interaction.reply({ embeds: [embed2] });
        }

        switch (sub) {
            
            case 'check':
            const Data = await linkSchema.findOne({ Guild: interaction.guild.id});

            if (!Data) return await interaction.reply({ content: `There is no Anti-link system set up here!`, ephemeral: true});

            const permissions = Data.Perms;

            if (!permissions) return await interaction.reply({ content: `There is **no Anti-link** set up here!`, ephemeral: true});
            else await interaction.reply({ content: `Your Anti-link system is currently set up. People with **${permissions}** permissions can bypass the system`, ephemeral: true});
        }

        switch (sub) {
            
            case 'edit':
            const Data = await linkSchema.findOne({ Guild: interaction.guild.id});
            const permissions = options.getString('permissions');

            if (!Data) return await interaction.reply({ content: `There is no Anti-link system set up here!`, ephemeral: true});
            else {
                await linkSchema.deleteMany();

                await linkSchema.create({
                    Guild: interaction.guild.id,
                    perms: permissions
                })

                const embed3 = new EmbedBuilder()
                .setColor("Green")
                .setDescription(`<:50121checkmark:1278745788935045220> Your Anti-link bypass permissions has set to ${permissions}.`)

                await interaction.reply({ embeds: [embed3 ]});
            }

        }

    }

};