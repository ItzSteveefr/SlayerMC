const { SlashCommandBuilder } = require('@discordjs/builders');
const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const staffSchema = require('../schemas/EventRegisterSchema');

module.exports = {
    cooldown: 3,
    category: "Community",
    data: new SlashCommandBuilder()
    .setName("event")
    .setDefaultMemberPermissions(PermissionFlagsBits.RequestToSpeak)
    .setDescription(`register for event here!`)
    .addSubcommand(command =>
		command
			.setName('registeration')
			.setDescription('register for event here!'))

    .addSubcommand(command =>
        command
        .setName(`disable`)
        .setDescription('Disable the register event system'))

    .addSubcommand(command =>
        command
        .setName(`check`)
        .setDescription('Checks the status of the register event system'))

    .addSubcommand(command =>
        command
        .setName(`setup`)
        .setDescription('Setup the register event system')),
    async execute(interaction) {

        const { options } = interaction;

        const sub = options.getSubcommand();

        switch (sub) {

            case 'setup':

                const membermissing = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle("There was an error using `/event setup` <:Sad_Kitty:1061073430201516062>")
                .setDescription(`You do not have permissions to use this command! <a:Cry:1061072540249903194>`)
        
                if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({
                    embeds: [membermissing],
                    ephemeral: true
                })

                const Data = await staffSchema.findOne({ Guild: interaction.guild.id});

                if (Data) return await interaction.reply({ content: 'You already have the event registration system setup, so /event disable to remove it', ephemeral: true});

                if (!Data) {
                    staffSchema.create({
                        Guild: interaction.guild.id
                    })
                }

                const embed = new EmbedBuilder()
                .setColor("Green")
                .setDescription(`:white_check_mark:  The event registering system has been enabled`)

                await interaction.reply({ embeds: [embed]});
        }

        switch (sub) {

            case 'registeration':

        const Data = await staffSchema.findOne({ Guild: interaction.guild.id});

        if (!Data) return await  interaction.reply({ content: `The event registerations are currently closed!`, ephemeral: true});
        else{
        
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
        interaction.showModal(modal)
        }
        }

        switch (sub) {

            case 'check':

        const membermissing = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle("There was an error using `/event check` <:Sad_Kitty:1061073430201516062>")
        .setDescription(`You do not have permissions to use this command! <a:Cry:1061072540249903194>`)

        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({
            embeds: [membermissing],
            ephemeral: true
        })

        const Data = await staffSchema.findOne({ Guild: interaction.guild.id});

        if (Data) return await  interaction.reply({ content: 'The event registeration system is currently **setup**! `/event disable` to disable the event registeration system!', ephemeral: true});
        else{
            return await interaction.reply({ content: "The event registeration system is currently **disabled**! `/event setup` to enable the event registeration system!", ephemeral: true})
            }
        }

        switch (sub) {

            case 'disable':
            
            const membermissing = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle("There was an error using `/event disable` <:Sad_Kitty:1061073430201516062>")
            .setDescription(`You do not have permissions to use this command! <a:Cry:1061072540249903194>`)
    
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({
                embeds: [membermissing],
                ephemeral: true
            })

            const Data = await staffSchema.findOne({ Guild: interaction.guild.id});

            if (!Data) return await  interaction.reply({ content: `The event registeration system is not setup`, ephemeral: true});
            else{

            await staffSchema.deleteMany();

                const embed2 = new EmbedBuilder()
                .setColor("Green")
                .setDescription(`:white_check_mark:  The event registeration system has been disabled`)

                await interaction.reply({ embeds: [embed2]});
            }
        }
    }
}