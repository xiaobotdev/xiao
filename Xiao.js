require('dotenv').config();
const { XIAO_TOKEN, OWNERS, XIAO_PREFIX, INVITE } = process.env;
const path = require('path');
const Client = require('./structures/Client');
const client = new Client({
	commandPrefix: XIAO_PREFIX,
	owner: OWNERS.split(','),
	invite: INVITE,
	disableMentions: 'everyone',
	disabledEvents: ['TYPING_START']
});
const activities = require('./assets/json/activity');
const leaveMsgs = require('./assets/json/leave-messages');

client.registry
	.registerDefaultTypes()
	.registerTypesIn(path.join(__dirname, 'types'))
	.registerGroups([
		['util', 'Utility'],
		['info', 'Discord Information'],
		['random', 'Random Response'],
		['single', 'Single Response'],
		['auto', 'Automatic Response'],
		['seeded', 'Seeded Randomizers'],
		['events', 'Events'],
		['search', 'Search'],
		['analyze', 'Analyzers'],
		['sp-games', 'Single-Player Games'],
		['mp-games', 'Multi-Player Games'],
		['image-edit', 'Image Manipulation'],
		['avatar-edit', 'Avatar Manipulation'],
		['meme-gen', 'Meme Generators'],
		['text-edit', 'Text Manipulation'],
		['number-edit', 'Number Manipulation'],
		['other', 'Other'],
		['roleplay', 'Roleplay'],
		['readme', 'README Generators']
	])
	.registerDefaultCommands({
		help: false,
		ping: false,
		prefix: false,
		commandState: false,
		unknownCommand: false
	})
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.on('ready', () => {
	client.logger.info(`[READY] Logged in as ${client.user.tag}! ID: ${client.user.id}`);
	client.setInterval(() => {
		const activity = activities[Math.floor(Math.random() * activities.length)];
		client.user.setActivity(activity.text, { type: activity.type });
	}, 60000);
	if (client.memePoster.id && client.memePoster.token) {
		client.setInterval(() => client.memePoster.post(), client.memePoster.time);
	}
});

client.on('message', async msg => {
	if (!msg.channel.topic || !msg.channel.topic.includes('<xiao:phone>')) return;
	if (msg.author.bot || !msg.content) return;
	const origin = client.phone.find(call => call.origin.id === msg.channel.id);
	const recipient = client.phone.find(call => call.recipient.id === msg.channel.id);
	if (!origin && !recipient) return;
	const call = origin || recipient;
	if (!call.active) return;
	try {
		await call.send(origin ? call.recipient : call.origin, msg);
	} catch {
		return; // eslint-disable-line no-useless-return
	}
});

client.on('guildMemberRemove', async member => {
	const channel = member.guild.systemChannel;
	if (!channel || !channel.permissionsFor(client.user).has('SEND_MESSAGES')) return null;
	if (channel.topic && channel.topic.includes('<xiao:disable-leave>')) return null;
	try {
		const leaveMsg = leaveMsgs[Math.floor(Math.random() * leaveMsgs.length)];
		await channel.send(leaveMsg.replace(/{{user}}/gi, `**${member.user.tag}**`));
		return null;
	} catch {
		return null;
	}
});

client.on('disconnect', event => {
	client.logger.error(`[DISCONNECT] Disconnected with code ${event.code}.`);
	process.exit(0);
});

client.on('error', err => client.logger.error(err));

client.on('warn', warn => client.logger.warn(warn));

client.on('commandError', (command, err) => client.logger.error(`[COMMAND:${command.name}]\n${err.stack}`));

client.login(XIAO_TOKEN);
