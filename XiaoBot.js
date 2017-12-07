const { XIAO_TOKEN, OWNERS, XIAO_COMMAND_PREFIX, INVITE } = process.env;
const path = require('path');
const { CommandoClient } = require('discord.js-commando');
const client = new CommandoClient({
	commandPrefix: XIAO_COMMAND_PREFIX,
	owner: OWNERS.split(','),
	invite: INVITE,
	disableEveryone: true,
	unknownCommandResponse: false,
	disabledEvents: ['TYPING_START']
});
const activities = require('./assets/json/activity');
const { MessageEmbed } = require('discord.js');
const starred = new Map();

client.registry
	.registerDefaultTypes()
	.registerTypesIn(path.join(__dirname, 'types'))
	.registerGroups([
		['util', 'Utility'],
		['info', 'Discord Information'],
		['random', 'Random Response'],
		['single', 'Single Response'],
		['events', 'Daily Events'],
		['image-edit', 'Image Manipulation'],
		['avatar-edit', 'Avatar Manipulation'],
		['text-edit', 'Text Manipulation'],
		['number-edit', 'Number Manipulation'],
		['search', 'Search'],
		['games', 'Games'],
		['role-manage', 'Role Management'],
		['other', 'Other'],
		['roleplay', 'Roleplay']
	])
	.registerDefaultCommands({
		help: false,
		ping: false,
		prefix: false,
		commandState: false
	})
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.on('ready', () => {
	console.log(`[READY] Logged in as ${client.user.tag}! (${client.user.id})`);
	client.setInterval(() => {
		const activity = activities[Math.floor(Math.random() * activities.length)];
		client.user.setActivity(activity.text, { type: activity.type });
	}, 60000);
});

client.on('disconnect', event => {
	console.error(`[DISCONNECT] Disconnected with code ${event.code}.`);
	process.exit(0);
});

client.on('error', err => console.error('[ERROR]', err));

client.on('warn', err => console.warn('[WARNING]', err));

client.on('commandError', (command, err) => console.error('[COMMAND ERROR]', command.name, err));

client.on('messageReactionAdd', async (reaction, user) => {
	if (reaction.emoji.name !== '⭐') return;
	const msg = reaction.message;
	if (msg.author.id === user.id) {
		if (msg.channel.permissionsFor(client.user).has('MANAGE_MESSAGES')) await reaction.remove(user);
		await msg.reply('You cannot star your own messages, idiot.');
		return;
	}
	const starboard = msg.guild.channels.find('name', 'starboard');
	if (!starboard) return;
	if (!starboard.permissionsFor(client.user).has(['SEND_MESSAGES', 'EMBED_LINKS'])) return;
	const embed = new MessageEmbed()
		.setAuthor(msg.author.tag, msg.author.displayAvatarURL())
		.setDescription(msg.content)
		.setImage(msg.attachments.size ? msg.attachments.first().url : null)
		.setColor(0xFFFF00)
		.setTimestamp()
		.setFooter(`⭐ ${reaction.count}`);
	let starMsg;
	if (starred.has(msg.id)) starMsg = await starred.get(msg.id).edit(`${reaction.count} ⭐ ${msg.channel}`, { embed });
	else starMsg = await starboard.send(`${reaction.count} ⭐ ${msg.channel}`, { embed });
	starred.set(msg.id, starMsg);
});

client.on('messageReactionRemove', async reaction => {
	if (reaction.emoji.name !== '⭐') return;
	const msg = reaction.message;
	if (!starred.has(msg.id)) return;
	const starboard = msg.guild.channels.find('name', 'starboard');
	if (!starboard) return;
	if (!starboard.permissionsFor(client.user).has(['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_MESSAGES'])) return;
	const embed = new MessageEmbed()
		.setAuthor(msg.author.tag, msg.author.displayAvatarURL())
		.setDescription(msg.content)
		.setImage(msg.attachments.size ? msg.attachments.first().url : null)
		.setColor(0xFFFF00)
		.setTimestamp()
		.setFooter(`⭐ ${reaction.count}`);
	if (reaction.count > 0) {
		const starMsg = await starred.get(msg.id).edit(`${reaction.count} ⭐ ${msg.channel}`, { embed });
		starred.set(msg.id, starMsg);
	} else {
		await starred.get(msg.id).delete();
		starred.delete(msg.id);
	}
});

client.login(XIAO_TOKEN);

process.on('unhandledRejection', err => {
	console.error('[FATAL] Unhandled Promise Rejection.', err);
	process.exit(1);
});
