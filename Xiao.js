const { XIAO_TOKEN, OWNERS, XIAO_PREFIX, INVITE } = process.env;
const path = require('path');
const XiaoClient = require('./structures/Client');
const client = new XiaoClient({
	commandPrefix: XIAO_PREFIX,
	owner: OWNERS.split(','),
	invite: INVITE,
	disableEveryone: true,
	unknownCommandResponse: false,
	disabledEvents: ['TYPING_START']
});
const { discordBots } = require('./util/BotList');
const SequelizeProvider = require('./providers/Sequelize');
const activities = require('./assets/json/activity');

client.registry
	.registerDefaultTypes()
	.registerTypesIn(path.join(__dirname, 'types'))
	.registerGroups([
		['util', 'Utility'],
		['commands', 'Command Management'],
		['info', 'Discord Information'],
		['random', 'Random Response'],
		['single', 'Single Response'],
		['events', 'Events'],
		['search', 'Search'],
		['analyze', 'Analyzers'],
		['games', 'Games'],
		['voice', 'Voice Channel'],
		['image-edit', 'Image Manipulation'],
		['avatar-edit', 'Avatar Manipulation'],
		['text-edit', 'Text Manipulation'],
		['number-edit', 'Number Manipulation'],
		['tags', 'Server Tags'],
		['role-manage', 'Role Management'],
		['portal', 'Portal Messages'],
		['other', 'Other'],
		['roleplay', 'Roleplay']
	])
	.registerDefaultCommands({
		help: false,
		ping: false
	})
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.setProvider(new SequelizeProvider(client.database));

client.dispatcher.addInhibitor(msg => {
	const blacklist = client.provider.get('global', 'blacklist', []);
	if (!blacklist.includes(msg.author.id)) return false;
	return 'Blacklisted.';
});

client.on('ready', () => {
	console.log(`[READY] Logged in as ${client.user.tag}! (${client.user.id})`);
	client.setInterval(() => {
		const activity = activities[Math.floor(Math.random() * activities.length)];
		client.user.setActivity(activity.text, { type: activity.type });
	}, 60000);
	discordBots(client);
});

client.on('disconnect', event => {
	console.error(`[DISCONNECT] Disconnected with code ${event.code}.`);
	process.exit(0);
});

client.on('guildCreate', () => discordBots(client));

client.on('guildDelete', () => discordBots(client));

client.on('commandRun', command => console.log(`[COMMAND] Ran command ${command.groupID}:${command.memberName}.`));

client.on('error', err => console.error('[ERROR]', err));

client.on('warn', err => console.warn('[WARNING]', err));

client.on('commandError', (command, err) => console.error('[COMMAND ERROR]', command.name, err));

client.login(XIAO_TOKEN);

process.on('unhandledRejection', err => {
	console.error('[FATAL] Unhandled Promise Rejection.', err);
	process.exit(1);
});
