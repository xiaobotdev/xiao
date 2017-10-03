const { TOKEN, OWNERS, COMMAND_PREFIX, INVITE } = process.env;
const path = require('path');
const { CommandoClient } = require('discord.js-commando');
const client = new CommandoClient({
	commandPrefix: COMMAND_PREFIX,
	owner: OWNERS.split(','),
	invite: INVITE,
	disableEveryone: true,
	unknownCommandResponse: false,
	disabledEvents: ['TYPING_START'],
	messageCacheLifetime: 600,
	messageSweepInterval: 120
});
const { postStats } = require('./structures/Util');

client.registry
	.registerDefaultTypes()
	.registerGroups([
		['util', 'Utility'],
		['user-info', 'User Info'],
		['guild-info', 'Server Info'],
		['moderation', 'Moderation'],
		['random-res', 'Random Response'],
		['random-img', 'Random Image'],
		['image-edit', 'Image Manipulation'],
		['avatar-edit', 'Avatar Manipulation'],
		['text-edit', 'Text Manipulation'],
		['num-edit', 'Number Manipulation'],
		['search', 'Search'],
		['games', 'Games'],
		['random', 'Random/Other'],
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
	console.log(`[READY] Shard ${client.shard.id} logged in as ${client.user.tag} (${client.user.id})!`);
	client.setInterval(() => {
		const activities = [
			`${COMMAND_PREFIX}help for commands`,
			`Shard ${client.shard.id}`,
			'with dragonfire535',
			client.options.invite,
			`with ${client.registry.commands.size} commands`,
			'Rune Factory 4'
		];
		client.user.setActivity(activities[Math.floor(Math.random() * activities.length)]);
	}, 60000);
});

client.on('disconnect', event => {
	console.error(`[DISCONNECT] Shard ${client.shard.id} disconnected with code ${event.code}.`);
	process.exit(0);
});

client.on('error', console.error);

client.on('warn', console.warn);

client.on('commandError', (command, err) => console.error(command.name, err));

client.on('guildCreate', async () => {
	const guilds = await client.shard.fetchClientValues('guilds.size');
	const count = guilds.reduce((prev, val) => prev + val, 0);
	postStats(count, client.user.id);
});

client.on('guildDelete', async () => {
	const guilds = await client.shard.fetchClientValues('guilds.size');
	const count = guilds.reduce((prev, val) => prev + val, 0);
	postStats(count, client.user.id);
});

client.dispatcher.addInhibitor(msg => {
	if (msg.channel.type !== 'text' || !msg.channel.topic) return false;
	if (msg.channel.topic.includes('<blocked>')) return 'topic blocked';
	return false;
});

client.login(TOKEN);

client.setInterval(() => {
	console.log(`[RESTART] Shard ${client.shard.id} restarted!`);
	process.exit(0);
}, 8.64e+7);

process.on('unhandledRejection', err => {
	console.error('Unhandled Promise Rejection:', err);
	process.exit(1);
});
