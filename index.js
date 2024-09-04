require('./utils/ProcessHandlers.js')();
require('./utils/InteractionOverrides.js')();
const { Events, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField, ActivityType } = require('discord.js');
const welcomeschema = require('./schemas/welcomesystemSchema.js');
const roleschema = require('./schemas/AutoRoleSchema.js');
const suggestion = require('./schemas/suggestionsystemschema.js');
const formatResults = require('./utils/formatresults.js');

const { green, yellow, magenta, cyan, red, blue, gray, magentaBright, white } = require('colorette');
const os = require('os');

const PREFIX = '!';

const { Client, GatewayIntentBits, Partials, PermissionsBitField: { Flags: Permissions } } = require('discord.js');

//const dbConnected = await this._connectDb();

const client = new Client({ intents: 
    [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, 
     GatewayIntentBits.GuildMembers, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildPresences, 
     GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildInvites,
     GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.GuildModeration],
        
     partials: [Partials.Channel, Partials.Reaction, Partials.Message, Partials] 
});

client.config = require('./config.json');
client.logs = require('./utils/Logs.js');
client.cooldowns = new Map();		

require('./utils/ComponentLoader.js')(client);
require('./utils/EventLoader.js')(client);
require('./utils/RegisterCommands.js')(client);
require('./utils/Database.js')(client); 

client.logs.info(`Logging in...`);
client.login(client.config.TOKEN);
client.on('ready', async function () {
    try {

        client.logs.info(`Logging in...`);
        // Define the statuses here
        const statuses = [
            {
                content: 'Minecraft On SlayerMC',
                type: 'PLAYING',
                status: 'online',
            },
            {
                content: 'Developed By ItzStevee',
                type: 'LISTENING',
                status: 'idle',
            }
        ];
    
        let currentIndex = 0;
    
        const updateStatus = async () => {
            const status = statuses[currentIndex];
            await client.user.setPresence({
                activities: [
                    {
                        name: status.content,
                        type: ActivityType[status.type],
                    },
                ],
                status: status.status,
            });
    
            currentIndex = (currentIndex + 1) % statuses.length; // Cycle through the list
        };

        // Set the initial status
        await updateStatus();
        client.logs.success('Activity Loaded Successfully!');
    
        // Update status at regular intervals (e.g., every 10 seconds)
        setInterval(updateStatus, 10000);
    } catch (error) {
        client.logs.error('Error loading activity:', error);
    }
	client.logs.custom(`Logged in as ${client.user.tag}!`, 0x7946ff);

	const llc = red;
    const blc = red;
           const success = green('+');
           const fail = red('-');
           //const db = dbConnected ? `[${success}] Mongo Connected` : `[${fail}] Mongo Not Connected`;
    const line01 = llc(String.raw`                                                                     `);       
    const line02 = llc(String.raw`░██████╗██╗░░░░░░█████╗░██╗░░░██╗███████╗██████╗░███╗░░░███╗░█████╗░ `);
    const line03 = llc(String.raw`██╔════╝██║░░░░░██╔══██╗╚██╗░██╔╝██╔════╝██╔══██╗████╗░████║██╔══██╗ `);
    const line04 = llc(String.raw`╚█████╗░██║░░░░░███████║░╚████╔╝░█████╗░░██████╔╝██╔████╔██║██║░░╚═╝ `);
    const line05 = llc(String.raw`░╚═══██╗██║░░░░░██╔══██║░░╚██╔╝░░██╔══╝░░██╔══██╗██║╚██╔╝██║██║░░██╗ `);
    const line06 = llc(String.raw`██████╔╝███████╗██║░░██║░░░██║░░░███████╗██║░░██║██║░╚═╝░██║╚█████╔╝ `);
    const line07 = llc(String.raw`╚═════╝░╚══════╝╚═╝░░╚═╝░░░╚═╝░░░╚══════╝╚═╝░░╚═╝╚═╝░░░░░╚═╝░╚════╝░ `);
    const line08 = llc(String.raw`                                                                     `);
            // Offset Pad
            const pad = ' '.repeat(7);
 
            console.log(
                String.raw`
    ${line01}
    ${line02}
    ${line03} ${pad}${blc('1.0.0')}
    ${line04} ${pad}[${success}] Gateway
    ${line05} ${pad}
    ${line06}${`${pad}${blc('<')}${llc('/')}${blc('>')} ${white('DEVELOPER MODE')}`}
    ${line07}
    ${line08}
            `.trim()
            );
            const commandCount = client.commands.size;
            const totalMembers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
            const totalGuilds = client.guilds.cache.size;
            const botVersion = 'SlayerMC Beta 1.0.0';
            const botOwner = 'ItzStevee';
     
            console.log(blue('=================================='));
            console.log(magenta(`Command Count: ${commandCount}`));
            console.log(cyan(`Total Members: ${totalMembers}`));
            console.log(green(`Total Guilds: ${totalGuilds}`));
            console.log(red(`Bot's Launch Time: ${new Date().toLocaleString()}`));
            console.log(blue(`Bot's Version: ${botVersion}`));
            console.log(red(`Bot's Founders: ${botOwner}`));
            console.log(magenta(`Bot's Developers: ItzStevee`));
            console.log(blue('=================================='));

	// It's a weird place but I am assuming by the time it logs in you are finished adding events
	// Adding events after it runs this function will not get checked
	require('./utils/CheckIntents.js')(client);
	require('./utils/FileWatch.js')(client); // listener for hot loading
});

function CheckGuildAccess(requiredGuilds, guildID) {
	if (Array.isArray(requiredGuilds) && !requiredGuilds.includes(guildID)) {
		throw ['You don\'t have permission to use this command!', 'Guild not whitelisted'];
	}
}

function CheckUserAccess(requiredRoles, userIDs, member, user) {
	if (member && requiredRoles) {
		const hasRole = requiredRoles.some(roleID => member._roles.includes(roleID));
		if (!hasRole && !member.permissions.has('Administrator')) {
			throw ['You don\'t have permission to use this command!', 'Missing roles'];
		}
	}

	if (Array.isArray(userIDs) && !userIDs.includes(user.id)) {
		throw ['You don\'t have permission to use this command!', 'User not whitelisted'];
	}
}

function CheckPermissions(permissionsArray, member) {
	if (!Array.isArray(permissionsArray) || !member) return;

	const prefix = member.user.id === client.id ? 'I am' : 'You are';

	const missingPermissions = [];
	if (permissionsArray.length === 0) return;
	for (const permission of permissionsArray) {
		if (member.permissions.has(Permissions[permission])) continue;
		missingPermissions.push(permission);
	}

	if (missingPermissions.length > 0) {
		throw [`${prefix} missing the following permissions: \`${missingPermissions.join('`, `')}\``, 'Missing permissions'];
	}
}

function CheckCooldown(userID, command, cooldown) {
	const timeRemaining = client.cooldowns.get(`${userID}-${command}`) ?? 0;
	const remaining = (timeRemaining - Date.now()) / 1000;
	if (remaining > 0) {
		throw [`Please wait ${remaining.toFixed(1)} more seconds before reusing the \`${command}\` command!`, 'On cooldown'];
	}
	client.cooldowns.set(`${userID}-${command}`, Date.now() + cooldown * 1000);
}

async function InteractionHandler(interaction, type) {

	const args = interaction.customId?.split("_") ?? [];
	const name = args.shift();

	const component = client[type].get(name ?? interaction.commandName);
	if (!component) {
		await interaction.reply({
			content: `There was an error while executing this command!\n\`\`\`Command not found\`\`\``,
			ephemeral: true
		}).catch(() => { });
		client.logs.error(`${type} not found: ${interaction.customId}`);
		return;
	}

	try {
		CheckGuildAccess(component.guilds, interaction.guildId);
		CheckUserAccess(component.roles, component.users, interaction.member, interaction.user);
		CheckCooldown(interaction.user.id, component.customID ?? interaction.commandName, component.cooldown);

		const botMember = interaction.guild?.members.cache.get(client.user.id) ?? await interaction.guild?.members.fetch(client.user.id).catch(() => null);
		if (botMember !== null) {
			// This code will only trigger if
			// 1) Bot is in the guild (always will)
			// 2) Command not being run in DMs
			// 3) Client has GuildMembers intent
			// 4) Not actively rate limited
			CheckPermissions(component.clientPerms, botMember); // bot
			CheckPermissions(component.userPerms, interaction.member); // user
		}
	} catch ([response, reason]) {
		await interaction.reply({
			content: response,
			ephemeral: true
		}).catch(() => { });
		client.logs.error(`Blocked user from ${type}: ${reason}`);
		return;
	}

	try {
		if (interaction.isAutocomplete()) {
			await component.autocomplete(interaction, client, type === 'commands' ? undefined : args);
		} else {
			await component.execute(interaction, client, type === 'commands' ? undefined : args);
		}
	} catch (error) {
		client.logs.error(error.stack);
		await interaction.deferReply({ ephemeral: true }).catch(() => { });
		await interaction.editReply({
			content: `There was an error while executing this command!\n\`\`\`${error}\`\`\``,
			embeds: [],
			components: [],
			files: [],
			ephemeral: true
		}).catch(() => { });
	}
}

client.on('interactionCreate', async function (interaction) {
	if (!interaction.isCommand() && !interaction.isAutocomplete()) return;

	const subcommand = interaction.options._subcommand ?? "";
	const subcommandGroup = interaction.options._subcommandGroup ?? "";
	const commandArgs = interaction.options._hoistedOptions ?? [];
	const args = `${subcommandGroup} ${subcommand} ${commandArgs.map(arg => arg.value).join(" ")}`.trim();
	client.logs.info(`${interaction.user.tag} (${interaction.user.id}) > /${interaction.commandName} ${args}`);

	await InteractionHandler(interaction, 'commands');
});


client.on('interactionCreate', async function (interaction) {
	if (!interaction.isButton()) return;
	client.logs.info(`${interaction.user.tag} (${interaction.user.id}) > [${interaction.customId}]`);
	await InteractionHandler(interaction, 'buttons');
});


client.on('interactionCreate', async function (interaction) {
	if (!interaction.isStringSelectMenu()) return;
	client.logs.info(`${interaction.user.tag} (${interaction.user.id}) > <${interaction.customId}>`);
	await InteractionHandler(interaction, 'menus');
});


client.on('interactionCreate', async function (interaction) {
	if (!interaction.isModalSubmit()) return;
	client.logs.info(`${interaction.user.tag} (${interaction.user.id}) > {${interaction.customId}}`);
	await InteractionHandler(interaction, 'modals');
});

client.on('messageCreate', async function (message) {
	if (message.author.bot) return;
	if (!message.content?.startsWith(PREFIX)) return;

	const args = message.content.slice(PREFIX.length).split(/\s+/);
	const name = args.shift().toLowerCase();

	const command = client.messages.get(name);
	if (!command) {
		client.logs.error(`Command not found: ${name}`);
		return await message.reply(`There was an error while executing this command!\n\`\`\`Command not found\`\`\``).catch(() => { });
	}

	try {
		CheckGuildAccess(command.guilds, message.guildId);
		CheckUserAccess(command.roles, command.users, message.member, message.author);
		CheckCooldown(message.author.id, name, command.cooldown);

		const botMember = message.guild?.members.cache.get(client.user.id) ?? await message.guild?.members.fetch(client.user.id).catch(() => null);
		if (botMember !== null) {
			CheckPermissions(command.clientPerms, botMember); // bot
			CheckPermissions(command.userPerms, message.member); // user
		}
	} catch ([response, reason]) {
		await message.reply(response).catch(() => { });
		client.logs.error(`Blocked user from message: ${reason}`);
		return;
	}

	try {
		await command.execute(message, client, args);
	} catch (error) {
		client.logs.error(error.stack);
		await message.reply(`There was an error while executing this command!\n\`\`\`${error}\`\`\``).catch(() => { });
	} finally {
		client.cooldowns.set(message.author.id, Date.now() + command.cooldown * 1000);
		setTimeout(client.cooldowns.delete.bind(client.cooldowns, message.author.id), command.cooldown * 1000);
	}
});

// Welcome Message //


client.on(Events.GuildMemberAdd, async (member, err) => {
 
    const welcomedata = await welcomeschema.findOne({ Guild: member.guild.id });
 
    if (!welcomedata) return;
    else {
 
        const channelID = welcomedata.Channel;
        const channelwelcome = member.guild.channels.cache.get(channelID)
        const roledata = await roleschema.findOne({ Guild: member.guild.id });
 
        if (roledata) {
            const giverole = await member.guild.roles.fetch(roledata.Role)
 
            member.roles.add(giverole).catch(err => {
                console.log('Error received trying to give an auto role!');
            })
        }
 
        const embedwelcome = new EmbedBuilder()
         .setColor("DarkBlue")
         .setTitle(`${member.user.username} has arrived in the Server!`)
         .setDescription( `> Welcome ${member} to SlayerMC!\n> Consider checking out our <#1247159310946013274>\n> Type \`Ip\` in chat for the server Ip`)
         .setFooter({ text: `👋 Enjoy your stay on SlayerMC!`})
         .setTimestamp()
         .setAuthor({ name: `👋 Welcome to the Server!`})
         .setThumbnail('https://cdn.discordapp.com/attachments/1200713640710524961/1265052544690815108/DClogo.png?ex=66d2347e&is=66d0e2fe&hm=41fca8f71e8e2e95c2b866ef01ac55d74832b7b1bf764fed8fd8a8f84c319ce3&')
 
        const embedwelcomedm = new EmbedBuilder()
        .setColor("DarkBlue")
        .setTitle(`${member.user.username} has arrived in the Server!`)
        .setDescription( `> Welcome ${member} to SlayerMC!\n> Consider checking out our <#1247159310946013274>\n> Type \`Ip\` in chat for the server Ip`)
        .setFooter({ text: `👋 Enjoy your stay on SlayerMC!`})
        .setTimestamp()
        .setAuthor({ name: `👋 Welcome to the Server!`})
        .setThumbnail('https://cdn.discordapp.com/attachments/1200713640710524961/1265052544690815108/DClogo.png?ex=66d2347e&is=66d0e2fe&hm=41fca8f71e8e2e95c2b866ef01ac55d74832b7b1bf764fed8fd8a8f84c319ce3&')
 
        const levmsg = await channelwelcome.send({ embeds: [embedwelcome]});
        levmsg.react('👋');
        member.send({ embeds: [embedwelcomedm]}).catch(err => console.log(`Welcome DM error: ${err}`))
 
    } 
});
client.on(Events.InteractionCreate, async interaction => {

    if (!interaction.guild) return;
    if (!interaction.message) return;
    if (!interaction.isButton) return;

    const data = await suggestion.findOne({ GuildID: interaction.guild.id, Msg: interaction.message.id });
    if (!data) return;
    const message = await interaction.channel.messages.fetch(data.Msg);

    if (interaction.customId == 'upv') {

        if (data.Upmembers.includes(interaction.user.id)) return await interaction.reply({content: `You cannot vote again! You have already sent an upvote on this suggestion.`, ephemeral: true});

        let Downvotes = data.downvotes;
        if (data.Downmembers.includes(interaction.user.id)) {
            Downvotes = Downvotes - 1;
        }

        if (data.Downmembers.includes(interaction.user.id)) {

            data.downvotes = data.downvotes - 1;
        }

        data.Upmembers.push(interaction.user.id);
        data.Downmembers.pull(interaction.user.id);
        
        const newEmbed = EmbedBuilder.from(message.embeds[0]).setFields({name: `Upvotes`, value: `> **${data.upvotes + 1}** Votes`, inline: true}, { name: `Downvotes`, value: `> **${Downvotes}** Votes`, inline: true}, {name: `Author`, value: `> <@${data.AuthorID}>`}, { name: `Votes`, value: formatResults(data.Upmembers, data.Downmembers)});

                const upvotebutton = new ButtonBuilder()
                .setCustomId('upv')
                .setEmoji('<:tup:1162598259626352652>')
                .setLabel('Upvote')
                .setStyle(ButtonStyle.Primary)

                const downvotebutton = new ButtonBuilder()
                .setCustomId('downv')
                .setEmoji('<:tdown:1162598331390889994>')
                .setLabel('Downvote')
                .setStyle(ButtonStyle.Primary)
        
                const totalvotesbutton = new ButtonBuilder()
                .setCustomId('totalvotes')
                .setEmoji('💭')
                .setLabel('Votes')
                .setStyle(ButtonStyle.Secondary)

                const btnrow = new ActionRowBuilder().addComponents(upvotebutton, downvotebutton, totalvotesbutton);

                const button2 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId('appr')
                    .setLabel('Approve')
                    .setEmoji('<a:AUSC_checked:1011088709266985110>')
                    .setStyle(ButtonStyle.Success),

                    new ButtonBuilder()
                    .setCustomId('rej')
                    .setEmoji('<a:rejected:1162622460835922043>')
                    .setLabel('Reject')
                    .setStyle(ButtonStyle.Danger)
                )
                
                await interaction.update({ embeds: [newEmbed], components: [btnrow, button2] });

                data.upvotes++;
                data.save();
    }

    if (interaction.customId == 'downv') {

        if (data.Downmembers.includes(interaction.user.id)) return await interaction.reply({ content: `You cannot vote again! You have already sent an downvote on this suggestion.`, ephemeral: true});

        let Upvotes = data.upvotes;
        if (data.Upmembers.includes(interaction.user.id)) {
            Upvotes = Upvotes - 1;
        }

        if (data.Upmembers.includes(interaction.user.id)) {

            data.upvotes = data.upvotes - 1;
        }

        data.Downmembers.push(interaction.user.id);
        data.Upmembers.pull(interaction.user.id);

        const newEmbed = EmbedBuilder.from(message.embeds[0]).setFields({name: `Upvotes`, value: `> **${Upvotes}** Votes`, inline: true}, { name: `Downvotes`, value: `> **${data.downvotes + 1}** Votes`, inline: true}, {name: `Author`, value: `> <@${data.AuthorID}>`}, { name: `Votes`, value: formatResults(data.Upmembers, data.Downmembers)});

                const upvotebutton = new ButtonBuilder()
                .setCustomId('upv')
                .setEmoji('<:tup:1162598259626352652>')
                .setLabel('Upvote')
                .setStyle(ButtonStyle.Primary)

                const downvotebutton = new ButtonBuilder()
                .setCustomId('downv')
                .setEmoji('<:tdown:1162598331390889994>')
                .setLabel('Downvote')
                .setStyle(ButtonStyle.Primary)
        
                const totalvotesbutton = new ButtonBuilder()
                .setCustomId('totalvotes')
                .setEmoji('💭')
                .setLabel('Votes')
                .setStyle(ButtonStyle.Secondary)

                const btnrow = new ActionRowBuilder().addComponents(upvotebutton, downvotebutton, totalvotesbutton);

                const button2 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId('appr')
                    .setLabel('Approve')
                    .setEmoji('<:50121checkmark:1278745788935045220>')
                    .setStyle(ButtonStyle.Success),

                    new ButtonBuilder()
                    .setCustomId('rej')
                    .setEmoji('<:7943pixelrejected:1278745786435506279>')
                    .setLabel('Reject')
                    .setStyle(ButtonStyle.Danger)
                )
                
                await interaction.update({ embeds: [newEmbed], components: [btnrow, button2] });

                data.downvotes++;
                data.save();
    }

    if (interaction.customId == 'totalvotes') {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return await interaction.reply({ content: `Only Admins & Staffs can use this button.`, ephemeral: true });

        let upvoters = [];
        await data.Upmembers.forEach(async member => {
            upvoters.push(`<@${member}>`)
        });

        let downvoters = [];
        await data.Downmembers.forEach(async member => {
            downvoters.push(`<@${member}>`)
        });

        const embed = new EmbedBuilder()
        .addFields({ name: `Upvoters (${upvoters.length})`, value: `> ${upvoters.join(', ').slice(0, 1020) || `No upvoters!`}`, inline: true})
        .addFields({ name: `Downvoters (${downvoters.length})`, value: `> ${downvoters.join(', ').slice(0, 1020) || `No downvoters!`}`, inline: true})
        .setColor('Random')
        .setTimestamp()
        .setFooter({ text: `💭 Vote Data`})
        .setAuthor({ name: `${interaction.guild.name}'s Suggestion System`})

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (interaction.customId == 'appr') {

        const upvotebutton = new ButtonBuilder()
        .setCustomId('upv')
        .setEmoji('<:tup:1162598259626352652>')
        .setLabel('Upvote')
        .setStyle(ButtonStyle.Primary)

        const downvotebutton = new ButtonBuilder()
        .setCustomId('downv')
        .setEmoji('<:tdown:1162598331390889994>')
        .setLabel('Downvote')
        .setStyle(ButtonStyle.Primary)
        
        const totalvotesbutton = new ButtonBuilder()
        .setCustomId('totalvotes')
        .setEmoji('💭')
        .setLabel('Votes')
        .setStyle(ButtonStyle.Secondary)

        upvotebutton.setDisabled(true);
        downvotebutton.setDisabled(true);

        const btnrow = new ActionRowBuilder().addComponents(upvotebutton, downvotebutton, totalvotesbutton);
        
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return await interaction.reply({ content: `Only Admins & Staffs can use this button.`, ephemeral: true });

        const newEmbed = EmbedBuilder.from(message.embeds[0]).setColor('Green').addFields({ name: '\u200B', value: '<:50121checkmark:1278745788935045220> Your suggestion has been approved!'})

        await interaction.update({ embeds: [newEmbed], components: [btnrow] });
    }

    if (interaction.customId == 'rej') {

        const upvotebutton = new ButtonBuilder()
        .setCustomId('upv')
        .setEmoji('<:tup:1162598259626352652>')
        .setLabel('Upvote')
        .setStyle(ButtonStyle.Primary)

        const downvotebutton = new ButtonBuilder()
        .setCustomId('downv')
        .setEmoji('<:tdown:1162598331390889994>')
        .setLabel('Downvote')
        .setStyle(ButtonStyle.Primary)
        
        const totalvotesbutton = new ButtonBuilder()
        .setCustomId('totalvotes')
        .setEmoji('💭')
        .setLabel('Votes')
        .setStyle(ButtonStyle.Secondary)

        upvotebutton.setDisabled(true);
        downvotebutton.setDisabled(true);

        const btnrow = new ActionRowBuilder().addComponents(upvotebutton, downvotebutton, totalvotesbutton);
        
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return await interaction.reply({ content: `Only Admins & Staffs can use this button.`, ephemeral: true });

        const newEmbed = EmbedBuilder.from(message.embeds[0]).setColor('Red').addFields({ name: '\u200B', value: '<:7943pixelrejected:1278745786435506279> Your suggestion has been rejected!'})

        await interaction.update({ embeds: [newEmbed], components: [btnrow] });
    }       
});

const linkSchema = require('./schemas/AntiLinkSchema.js');
client.on(Events.MessageCreate, async message => {

    const messageContent = message.content.toLowerCase();
    if (message.content.startsWith('http') || message.content.startsWith('discord.gg') || message.content.includes('https://') || message.content.includes('http://') || message.content.includes('discord.gg/')) {

        const Data = await linkSchema.findOne({ Guild: message.guild.id});

        if (!Data) return;

        const memberPerms = Data.Perms;
        
        const user = message.author;
        const member = message.guild.members.cache.get(user.id);

        if (member.permissions.has(memberPerms)) return;
        else {
            await message.channel.send({ content: `${message.author}, you can't send links here!`}).then(msg => {
                setTimeout(() => msg.delete(), 3000)
            })

            ; (await message).delete();
        }
    }
});

client.on(Events.InteractionCreate, async interaction => {

    if (!interaction.isModalSubmit()) return;

    const membermissing = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle("Event registeration **Submitted**")
        .setDescription(`The Event registeration has been submitted, Thanks for registering and participating in the event!`)

    if (interaction.customId === 'modal') {
        await interaction.reply({ embeds: [membermissing], ephemeral: true, ephemeral: true})
        const name = interaction.fields.getTextInputValue('name');
        const about = interaction.fields.getTextInputValue('about');
        const about2 = interaction.fields.getTextInputValue('about2');
        const about3 = interaction.fields.getTextInputValue('about3');
        const about5 = interaction.fields.getTextInputValue('about5');
    
        const member = interaction.user.id;
        const tag = interaction.user.tag;
        const channel = client.channels.cache.get('1272187677810102292');
        const member2 = interaction.member;
        const user = interaction.user;
    
        const exampleEmbed = new EmbedBuilder()
        .setColor(0x18e1ee)
        .setTitle(`Event registeration`)
        .setDescription(`<@&1277611241530986640>`)
        .addFields(
            { name: 'Discord Name', value: `${tag} - <@${member}>`, inline: false },
            { name: 'Their Ingame name', value: `${name}`, inline: false },
            { name: 'Which event are they signing up for', value: `${about}`, inline: false },
            { name: 'They have knowledge in our rules?', value: `${about2}`, inline: false },
            { name: 'Their Teammates', value: `${about3}`, inline: false },
            { name: 'Availability in the event', value: `${about5}`, inline: false },
        )
        .setTimestamp()
    
        const message = await channel.send({ embeds: [exampleEmbed], content: `<@&1277611241530986640>` });

        const thread = await message.startThread({
            name: 'New Event registeration',
            autoArchiveDuration: 10080,
        });

        const threadReplyEmbed = new EmbedBuilder()
            .setColor(0x18e1ee)
            .setTitle('New Event registeration')
            .setDescription('A new event registeration has been submitted.')
            .setTimestamp();

        await thread.send({ embeds: [threadReplyEmbed] });
    }
});

const channelId = '1272187677810102292'; //THIS IS REQUIRED 

let stickyMessage;

function sendStickyEmbed(channel) {
  const guildID = "1237377801812840508";
  const guild = client.guilds.cache.get(guildID);

  const embedMessage = new EmbedBuilder()
    .setDescription('> Fill the form to register at the event\n> by typing `/event register` in any channel.')
    .setTitle('⚔️ Event Register')
    .setTimestamp()
    .setFooter({ text: 'Enjoy your stay at SlayerMC!', iconURL: 'https://media.discordapp.net/attachments/1200713640710524961/1265052544690815108/DClogo.png?ex=66d385fe&is=66d2347e&hm=a803eb90a52d91251a32a039ec10a635a601c02d39ef2f85213f0a721c610076&=&format=webp&quality=lossless' }) // Optional: Add an icon URL
    .setThumbnail('https://media.discordapp.net/attachments/1200713640710524961/1265052544690815108/DClogo.png?ex=66d385fe&is=66d2347e&hm=a803eb90a52d91251a32a039ec10a635a601c02d39ef2f85213f0a721c610076&=&format=webp&quality=lossless')
    .setColor('Green');

  // Delete the previous sticky message if it exists
  if (stickyMessage) {
    stickyMessage.delete().catch(console.error);
  }

  // Send the new sticky message
  channel.send({ embeds: [embedMessage] })
    .then((message) => {
      stickyMessage = message;
    })
    .catch(console.error);
}

function checkStickyMessage(channel) {
  sendStickyEmbed(channel);
}

// Check every 60 seconds (60000 ms)
setInterval(() => {
  const channel = client.channels.cache.get('1272187677810102292'); // Replace with your channel ID
  checkStickyMessage(channel);
}, 60000);

const suggestionChannelId = '1279678638102413363'; // Replace with your suggestion channel ID

let suggestionStickyMessage;

function sendSuggestionStickyEmbed(channel) {
  const guildID = "1237377801812840508";
  const guild = client.guilds.cache.get(guildID);

  const embedMessage = new EmbedBuilder()
    .setDescription('> Submit your suggestion by typing:\n> `/suggestion Submit: [Your Suggestion]`.\n> Then, send a regular message, and a thread will be created\n> for the community to discuss your idea.')
    .setTitle('💡 Suggestions')
    .setTimestamp()
    .setFooter({ text: 'Enjoy your stay at SlayerMC!', iconURL: 'https://media.discordapp.net/attachments/1200713640710524961/1265052544690815108/DClogo.png?ex=66d385fe&is=66d2347e&hm=a803eb90a52d91251a32a039ec10a635a601c02d39ef2f85213f0a721c610076&=&format=webp&quality=lossless' }) // Optional: Add an icon URL
    .setThumbnail('https://media.discordapp.net/attachments/1200713640710524961/1265052544690815108/DClogo.png?ex=66d385fe&is=66d2347e&hm=a803eb90a52d91251a32a039ec10a635a601c02d39ef2f85213f0a721c610076&=&format=webp&quality=lossless') // Replace with your own thumbnail URL if needed
    .setColor('Blue');

  // Delete the previous sticky message if it exists
  if (suggestionStickyMessage) {
    suggestionStickyMessage.delete().catch(() => {}); // Suppress errors
  }

  // Send the new sticky message
  channel.send({ embeds: [embedMessage] })
    .then((message) => {
      suggestionStickyMessage = message;
    })
    .catch(() => {}); // Suppress errors
}

function checkSuggestionStickyMessage() {
  const channel = client.channels.cache.get(suggestionChannelId);
  if (channel) {
    sendSuggestionStickyEmbed(channel);
  }
}

// Check every 60 seconds (60000 ms)
setInterval(checkSuggestionStickyMessage, 60000);

const ipChannelId = '1255969719849058444'; // Replace with your IP channel ID

let ipMessageCounter = 0;
let lastIpStickyMessage;

function sendIpStickyEmbed(channel) {
  const embedMessage = new EmbedBuilder()
    .setDescription('> For the server IP, type `IP` in the chat!\n> Remember to follow our guidelines when chatting.') // Customize your message
    .setTitle('🌐 Server IP')
    .setTimestamp()
    .setFooter({ text: 'Enjoy your stay at SlayerMC!', iconURL: 'https://media.discordapp.net/attachments/1200713640710524961/1265052544690815108/DClogo.png?ex=66d385fe&is=66d2347e&hm=a803eb90a52d91251a32a039ec10a635a601c02d39ef2f85213f0a721c610076&=&format=webp&quality=lossless' }) // Optional: Add an icon URL
    .setThumbnail('https://media.discordapp.net/attachments/1200713640710524961/1265052544690815108/DClogo.png?ex=66d385fe&is=66d2347e&hm=a803eb90a52d91251a32a039ec10a635a601c02d39ef2f85213f0a721c610076&=&format=webp&quality=lossless')
    .setColor('#FF0000');

  // Delete the previous sticky message if it exists
  if (lastIpStickyMessage) {
    lastIpStickyMessage.delete().catch(() => {}); // Suppress errors
  }

  // Send the new sticky embed
  channel.send({ embeds: [embedMessage] })
    .then((sentMessage) => {
      lastIpStickyMessage = sentMessage; // Store the message to delete it later
    })
    .catch(() => {}); // Suppress errors
}

client.on('messageCreate', (message) => {
  if (message.channel.id === ipChannelId && !message.author.bot) {
    ipMessageCounter++;

    // After every 3 messages, send the sticky embed
    if (ipMessageCounter >= 3) {
      sendIpStickyEmbed(message.channel);
      ipMessageCounter = 0; // Reset the counter
    }
  }
});


// AutoThread System
const channelID = '1279678638102413363'; // Replace with your actual channel ID
client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;
    if (!message.guild) return;
    if (message.channel.id !== channelID) return;

    const channel = message.channel;
    const threadParent = message;

    try {
        const thread = await channel.threads.create({
            name: `Suggestion from ${message.author.username}`,
            autoArchiveDuration: 1440,
            reason: 'Create automatic threads',
            startMessage: threadParent
        });

        const embed = new EmbedBuilder()
            .setColor(0x2B2D30)
            .setDescription(`> Hello everyone, **${message.author.username}** has been giving suggestions, what do you guys think?`)
            .setTimestamp()
            .setFooter({
                text: `Threads are created automatically`,
                iconURL: client.user.avatarURL()
            });

        const response = await thread.members.add(client.user.id);
        if (response) {
            const botMessage = await thread.send({ embeds: [embed] });
            console.log(`Bot embed message on channel: ${botMessage.content}`);
        }
    } catch (error) {
        console.error('Something went wrong:', error);
    }
});